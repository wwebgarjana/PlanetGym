// let membersData = [];  // store all members data

// const addBtn = document.getElementById("addMemberBtn");
// const modal = document.getElementById("memberModal");
// const closeModal = document.getElementById("closeModal");

// // OPEN MODAL
// addBtn.onclick = () => {
//     modal.style.display = "flex";
// };

// // CLOSE MODAL
// closeModal.onclick = () => {
//     modal.style.display = "none";
//     modal.removeAttribute("data-edit-id");
//     document.getElementById("saveMember").innerText = "Save";
// };



// // -----------------------------
// // LOAD DROPDOWN PLANS
// // -----------------------------
// async function loadPlansDropdown() {
//     let planSelect = document.getElementById("plan");
//     planSelect.innerHTML = `<option value="">Select Plan</option>`;

//     let plans = await window.api.getPlans();

//     plans.forEach(p => {
//         planSelect.innerHTML += `
//             <option value="${p.months}" data-price="${p.price}">
//                 ${p.plan_type} (${p.months} Months)
//             </option>
//         `;
//     });
// }
// loadPlansDropdown();


// // -----------------------------
// // AUTO END DATE
// // -----------------------------
// function updateEndDate() {
//     let months = parseInt(document.getElementById("plan").value);
//     let start = document.getElementById("startDate").value;

//     if (!start || !months) return;

//     let sDate = new Date(start);
//     sDate.setMonth(sDate.getMonth() + months);

//     document.getElementById("endDate").value =
//         sDate.toISOString().split("T")[0];
// }

// document.getElementById("plan").addEventListener("change", updateEndDate);
// document.getElementById("startDate").addEventListener("change", updateEndDate);



// // -----------------------------
// // SAVE / UPDATE MEMBER
// // -----------------------------
// document.getElementById("saveMember").addEventListener("click", async () => {

//     let editId = modal.getAttribute("data-edit-id");

//     let member = {
//     id: editId,
//     photo: document.getElementById("photo").value || "",
//     name: document.getElementById("fullName").value,
//     email: document.getElementById("email").value,
//     mobile: document.getElementById("mobileNo").value,
//     plan: document.getElementById("plan").value,
//     startDate: document.getElementById("startDate").value,
//     endDate: document.getElementById("endDate").value
// };


//     // UPDATE
//     if (editId) {
//         let result = await window.api.updateMember(member);

//         if (result.success) {
//             modal.style.display = "none";
//             modal.removeAttribute("data-edit-id");
//             document.getElementById("saveMember").innerText = "Save";
//             await loadMembers();
//         }
//         return;
//     }

//     // SAVE NEW
//     let result = await window.api.saveMember(member);
//     if (result.success) {
//         modal.style.display = "none";
//         await loadMembers();
//     }
// });



// // -----------------------------
// // LOAD MEMBERS
// // -----------------------------
// async function loadMembers() {
//     let container = document.getElementById("memberList");
//     container.innerHTML = "";

//     container.innerHTML += `
//         <div class="member-row header">
//             <div class="col-member" style="margin-left: 25px;">Member</div>
//             <div class="col-date">Start Date</div>
//             <div class="col-date">End Date</div>
//             <div class="col-status">Status</div>
//             <div class="col-status">Action</div>
//         </div>
//     `;

//     membersData = await window.api.getMembers();

//     membersData.forEach((m, i) => {
//         container.innerHTML += `
//             <div class="member-row" 
//                 style="display:flex;align-items:center;justify-content:space-between;
//                 border-bottom:1px solid #ccc;">

//                 <div style="display:flex;align-items:center;">
//                     <img src="https://i.pravatar.cc/50?img=${i+1}" 
//                         style="border-radius:50%; width:45px; height:45px;">
//                     <div>
//                         <div>${m.name}</div>
//                         <small>${m.plan} Month Plan</small>
//                     </div>
//                 </div>

//                 <div>${m.startDate}</div>
//                 <div>${m.endDate}</div>

//                 <div class="status pending">Pending</div>

//                 <div style="display:flex; gap:15px; font-size:18px; cursor:pointer;">
//                     <i class="fa-solid fa-pen-to-square update-btn" data-id="${m.id}" style="color:#0d6efd;"></i>
//                     <i class="fa-solid fa-trash delete-btn" data-id="${m.id}" style="color:red;"></i>
//                 </div>

//             </div>
//         `;
//     });
// }



// // -----------------------------
// // CLICK HANDLER (FIXED — OUTSIDE)
// // -----------------------------
// document.addEventListener("click", async (e) => {

//     // DELETE
//     if (e.target.classList.contains("delete-btn")) {
//         let id = e.target.getAttribute("data-id");

//         if (confirm("Are you sure you want to delete this member?")) {
//             let result = await window.api.deleteMember(id);
//             if (result.success) {
//                 await loadMembers();
//             }
//         }
//     }

//     // UPDATE
//     if (e.target.classList.contains("update-btn")) {
//         let id = e.target.getAttribute("data-id");

//         // READ FROM stored data
//         let data = membersData.find(x => x.id == id);

//         if (data) {
//             modal.style.display = "flex";

//             document.getElementById("fullName").value = data.name;
//             document.getElementById("email").value = data.email;
//             document.getElementById("mobileNo").value = data.mobile;
//             document.getElementById("plan").value = data.plan;
//             document.getElementById("startDate").value = data.startDate;
//             document.getElementById("endDate").value = data.endDate;

//             modal.setAttribute("data-edit-id", id);
//             document.getElementById("saveMember").innerText = "Update Member";
//         }
//     }
// });



// // INITIAL LOAD
// loadMembers();




// members.js (frontend)
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
  if (e.target === modal) {
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
 
  const member = {
    // if editId exists, pass id for update; for new create leave id null
    id: editId,
    photo: photoBase64 || "",               // base64 string (can be empty)
    name: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    mobile: document.getElementById("mobileNo").value.trim(),
    plan: document.getElementById("plan").value,
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value
  };
 
  // basic validation
  if (!member.name) return alert("Enter full name");
  if (!member.email) return alert("Enter email");
  if (!member.plan) return alert("Choose plan");
  if (!member.startDate) return alert("Choose start date");
 
  try {
    if (editId) {
      // UPDATE
      const result = await window.api.updateMember(member);
      if (result && result.success) {
        modal.style.display = "none";
        modal.removeAttribute("data-edit-id");
        saveBtn.innerText = "Save";
        clearModalFields();
        await loadMembers();
      } else {
        alert("Update failed");
      }
    } else {
      // SAVE NEW
      const result = await window.api.saveMember(member);
      if (result && result.success) {
        modal.style.display = "none";
        clearModalFields();
        await loadMembers();
      } else {
        alert("Save failed");
      }
    }
  } catch (err) {
    console.error(err);
    alert("Operation failed: " + (err.message || err));
  }
});
 
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
        <div class="member-row"
             style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ccc;padding:10px 0;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${avatar}" style="border-radius:50%; width:45px; height:45px; object-fit:cover;">
            <div>
              <div>${escapeHtml(m.name || "")}</div>
              <small>${m.plan} Month Plan</small>
            </div>
          </div>
 
          <div>${m.startDate || ""}</div>
          <div>${m.endDate || ""}</div>
          <div class="status ${getStatusClass(m.endDate)}">${getStatusText(m.endDate)}</div>
 
          <div style="display:flex; gap:15px; font-size:18px; cursor:pointer;">
            <i class="fa-solid fa-pen-to-square update-btn" data-id="${m.id}" title="Edit" style="color:orange;"></i>
            <i class="fa-solid fa-trash delete-btn" data-id="${m.id}" title="Delete" style="color:orange;"></i>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Failed to load members:", err);
  }
}
 
// small helpers for status
function getStatusText(endDate) {
  if (!endDate) return "Pending";
  const today = new Date().toISOString().split("T")[0];
  return endDate >= today ? "Active" : "Expired";
}
function getStatusClass(endDate) {
  const t = getStatusText(endDate);
  if (t === "Active") return "active";
  if (t === "Expired") return "expired";
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
loadMembers();
