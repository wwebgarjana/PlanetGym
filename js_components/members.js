

// members.js (frontend)
function validateMemberForm(member) {
  let isValid = true;

  // clear old errors
  document.querySelectorAll(".error-msg").forEach(e => {
    e.style.display = "none";
    e.innerText = "";
  });

  if (!member.photo) {
    showError("profileError", "Photo is required");
    isValid = false;
  }

  // NAME
  if (!member.name) {
    showError("nameError", "Full name is required");
    isValid = false;
  } else if (!/^[A-Za-z ]+$/.test(member.name)) {
    showError("nameError", "Only alphabets allowed");
    isValid = false;
  }

  // EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!member.email) {
    showError("emailError", "Email is required");
    isValid = false;
  } else if (!emailRegex.test(member.email)) {
    showError("emailError", "Enter valid email");
    isValid = false;
  }

  // MOBILE
  if (!member.mobile) {
    showError("mobileError", "Mobile number is required");
    isValid = false;
  } else if (!/^[0-9]{10}$/.test(member.mobile)) {
    showError("mobileError", "Enter 10 digit mobile number");
    isValid = false;
  }

  if (!member.plan) {
    showError("planError", "Plan is required");
    isValid = false;
  }

  // =====================
  // START DATE
  // =====================
  if (!member.startDate) {
    showError("dateError", "Start date is required");
    isValid = false;
  }

  return isValid;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerText = msg;
  el.style.display = "block";
}



let membersData = [];  // store loaded members
 
const addBtn = document.getElementById("addMemberBtn");
const modal = document.getElementById("memberModal");
const closeModal = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveMember");
const photoInput = document.getElementById("photo");
 
// OPEN MODAL
addBtn.onclick = () => {
  clearModalFields();
  modal.style.display = "flex";
};
 
// CLOSE MODAL
closeModal.onclick = () => {
  modal.style.display = "none";
  modal.removeAttribute("data-edit-id");
  saveBtn.innerText = "Save";
};
 
// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal"))
 {
    modal.style.display = "none";
    modal.removeAttribute("data-edit-id");
    saveBtn.innerText = "Save";
  }
});
 
// -----------------------------
// LOAD DROPDOWN PLANS
// -----------------------------
async function loadPlansDropdown() {
  const planSelect = document.getElementById("plan");
  // keep default option and add plans from backend (if available)
  planSelect.innerHTML = `<option value="">Select Plan</option>`;
  try {
    const plans = await window.api.getPlans();
    if (Array.isArray(plans) && plans.length) {
      plans.forEach(p => {
        const months = p.months || p.months === 0 ? p.months : '';
        planSelect.innerHTML += `
          <option value="${months}" data-price="${p.price || 0}">
            ${p.plan_type || 'Plan'} (${months} ${months > 1 ? 'Months' : 'Month'})
          </option>
        `;
      });
    }
  } catch (err) {
    console.warn("Failed to load plans:", err);
  }
}
loadPlansDropdown();
 
// -----------------------------
// AUTO END DATE
// -----------------------------
function updateEndDate() {
  const months = parseInt(document.getElementById("plan").value);
  const start = document.getElementById("startDate").value;
 
  if (!start || !months) {
    document.getElementById("endDate").value = "";
    return;
  }
 
  const sDate = new Date(start);
  sDate.setMonth(sDate.getMonth() + months);
  document.getElementById("endDate").value = sDate.toISOString().split("T")[0];
}
 
document.getElementById("plan").addEventListener("change", updateEndDate);
document.getElementById("startDate").addEventListener("change", updateEndDate);
 
// -----------------------------
// Utility: read image as base64
// -----------------------------
function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // base64 string
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
 
// -----------------------------
// SAVE / UPDATE MEMBER
// -----------------------------
saveBtn.addEventListener("click", async () => {
  const editId = modal.getAttribute("data-edit-id") || null;
 
  // read photo file as base64 if chosen
  const file = photoInput.files && photoInput.files[0];
  const photoBase64 = await readImageAsBase64(file).catch(() => "");
 
// 🔹 find existing member (for update)
const existingMember = editId
  ? membersData.find(m => String(m.id) === String(editId))
  : null;

const member = {
  id: editId,
  // ✅ agar new photo select ki hai → wahi use karo
  // ✅ warna purani photo hi rakho
  photo: photoBase64
    ? photoBase64
    : (existingMember?.photo || ""),

  name: document.getElementById("fullName").value.trim(),
  email: document.getElementById("email").value.trim(),
  mobile: document.getElementById("mobileNo").value.trim(),
  plan: document.getElementById("plan").value,
  startDate: document.getElementById("startDate").value,
  endDate: document.getElementById("endDate").value
};



 // ✅ NEW VALIDATION
  if (!validateMemberForm(member)) return;

  try {
    const result = editId
      ? await window.api.updateMember(member)
      : await window.api.saveMember(member);

    if (result?.success) {
      modal.style.display = "none";
      modal.removeAttribute("data-edit-id");
      saveBtn.innerText = "Save";
      clearModalFields();
      loadMembers();
    }
  } catch (err) {
    console.error(err);
  }
});

// -----------------------------
// CLEAR MODAL
// -----------------------------
function clearModalFields() {
  photoInput.value = "";
  fullName.value = "";
  email.value = "";
  mobileNo.value = "";
  plan.value = "";
  startDate.value = "";
  endDate.value = "";
}

// -----------------------------
// LOAD MEMBERS
// -----------------------------
async function loadMembers() {
  const container = document.getElementById("memberList");
  container.innerHTML = "";
 
  // header row
  container.innerHTML += `
    <div class="member-row header">
      <div class="col-member" style="margin-left: 25px;">Member</div>
      <div class="col-date">Start Date</div>
      <div class="col-enddate">End Date</div>
      <div class="col-status">Status</div>
      <div class="col-action">Action</div>
    </div>
  `;
 
  try {
    membersData = await window.api.getMembers();
    if (!Array.isArray(membersData)) membersData = [];
 
    membersData.forEach((m, i) => {
      // choose avatar either stored photo or placeholder
      const avatar = m.photo && m.photo.startsWith("data:")
        ? m.photo
        : `https://i.pravatar.cc/50?img=${(i % 70) + 1}`;
 
      container.innerHTML += `
    <div class="member-row">
 
        <div class="col-member">
            <img src="${avatar}"
                 style="border-radius:50%; width:45px; height:45px; object-fit:cover;">
            <div>
                <div class="member-name">${escapeHtml(m.name || "")}</div>
                <small>${m.plan} Month Plan</small>
            </div>
        </div>
 
        <div class="col-date">${m.startDate || ""}</div>
        <div class="col-enddate">${m.endDate || ""}</div>
 
        <div class="col-status ${getStatusClass(m.endDate)}">
            ${getStatusText(m.endDate)}
        </div>
       
 
        <div class="col-action">
            <i class="fa-solid fa-pen-to-square update-btn"
               data-id="${m.id}" style="color:orange;"></i>
            <i class="fa-solid fa-trash delete-btn"
               data-id="${m.id}" style="color:orange;"></i>
        </div>
 
    </div>
`;
    });
     loadExpiringWidget();
  } catch (err) {
    console.error("Failed to load members:", err);
  }
}
 


function getStatusText(endDate) {
  if (!endDate) return "Pending";

  const today = new Date();
  const end = new Date(endDate);

  // Difference in days
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired";        // Date chali gayi
  if (diffDays <= 5) return "Expiring Soon"; // Last 5 days
  return "Active";
}

function getStatusClass(endDate) {
  const status = getStatusText(endDate);

  if (status === "Active") return "active";
  if (status === "Expired") return "expired";
  if (status === "Expiring Soon") return "expiring-soon";
  return "pending";
}
 
// escape simple html to avoid injection in names/emails
function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (s) => {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[s];
  });
}
 
// -----------------------------
// CLICK HANDLER (delegated)
// -----------------------------
document.addEventListener("click", async (e) => {
  // DELETE
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    if (!id) return;
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        const result = await window.api.deleteMember(id);
        if (result && result.success) {
          await loadMembers();
        } else {
          alert("Delete failed");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Delete failed");
      }
    }
  }
 
  // UPDATE
  if (e.target.classList.contains("update-btn")) {
    const id = e.target.getAttribute("data-id");
    if (!id) return;
 
    const data = membersData.find(x => String(x.id) === String(id));
    if (!data) return alert("Record not found");
 
    // populate modal
    modal.style.display = "flex";
    document.getElementById("fullName").value = data.name || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("mobileNo").value = data.mobile || "";
    document.getElementById("plan").value = data.plan || "";
    document.getElementById("startDate").value = data.startDate || "";
    document.getElementById("endDate").value = data.endDate || "";
 
    // clear file input (user can choose new image)
    const preview = document.getElementById("photoPreview");
    preview.src = data.photo ? data.photo : "";
    photoInput.value = "";
 
    modal.setAttribute("data-edit-id", id);
    saveBtn.innerText = "Update Member";
  }
});
 
// clear modal inputs
function clearModalFields() {
  photoInput.value = "";
  document.getElementById("fullName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mobileNo").value = "";
  document.getElementById("plan").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
}
 
// INITIAL LOAD
//window.api.refreshStatus();
loadMembers();

// -----------------------------
// SMS Sending Utility
// -----------------------------
async function sendSms(mobileNumber, message) {
  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": "yue8b4madwJQlx2qjDPtrkLIOVv0in6XM1HgUcKpAoWZSTER7CuUqhQW6kB2ye4pb8nKFrRPHNzd7mEY", // API key डालो
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: "v3",             // modern route
        sender_id: "TXTIND",     // approved sender ID
        message: message,
        language: "english",
        flash: 0,
        numbers: mobileNumber
      })
    });

    const res = await response.json();
    console.log("SMS API Response:", res);

    // Fast2SMS में success key true/false में return हो सकती है
    return res.return || res.success || false;
  } catch (err) {
    console.error("SMS Error:", err);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById('expiringList');
  if (!list) return;

  list.addEventListener('click', async function (e) {
  const btn = e.target.closest('.sms-btn');
  if (!btn) return;

  const name = btn.dataset.name || 'User';
  const member = membersData.find(m => m.name === name);

  if (!member || !member.mobile) {
    return showTemporaryToast("Mobile number not found");
  }

  const mobileNumber = member.mobile.trim();
  const message = `Hi ${name}, your plan is expiring soon.`;

  const success = await sendSms(mobileNumber, message);  // ✅ call new function
  if (success) {
    showTemporaryToast(`SMS sent to ${name}`);
  } else {
    showTemporaryToast("SMS sending failed");
  }
});

   // simple toast
  function showTemporaryToast(text) {
    const t = document.createElement('div');
    t.textContent = text;
    Object.assign(t.style, {
      position: 'fixed',
      right: '18px',
      bottom: '18px',
      background: 'rgba(0,0,0,0.7)',
      color: '#fff',
      padding: '10px 14px',
      borderRadius: '8px',
      zIndex: 9999,
      fontSize: '14px'
    });
    document.body.appendChild(t);
    setTimeout(()=> t.style.opacity = '0', 2000);
    setTimeout(()=> t.remove(), 2600);
  }
});


function getRemainingDays(endDate) {
    const today = new Date();
    const end = new Date(endDate);

    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
}

async function loadExpiringWidget() {
    const list = document.getElementById("expiringList");
    list.innerHTML = ""; // Clear old content

    if (!membersData.length) return;

    membersData.forEach(m => {
        const status = getStatusText(m.endDate);

        if (status === "Expiring Soon") {
            const days = getRemainingDays(m.endDate);

            list.innerHTML += `
                <div class="expiring-item">
                    <div class="item-info">
                        <div class="name">${escapeHtml(m.name)}</div>
                        <div class="days">${days} days</div>
                    </div>
                    <button class="sms-btn" data-name="${escapeHtml(m.name)}">Send SMS</button>
                </div>
            `;
        }
    });
}
loadExpiringWidget();






