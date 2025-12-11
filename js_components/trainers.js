let trainerData = [];

const addBtn = document.getElementById("addTrainerBtn");
const modal = document.getElementById("trainerModal");
const closeModal = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveTrainer");
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

// Close when click outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    modal.removeAttribute("data-edit-id");
    saveBtn.innerText = "Save";
  }
});

// Convert Image to Base64
function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// SAVE / UPDATE TRAINER
saveBtn.addEventListener("click", async () => {
  const editId = modal.getAttribute("data-edit-id") || null;

  const file = photoInput.files && photoInput.files[0];
  const photoBase64 = await readImageAsBase64(file);

  const trainer = {
    id: editId,
    photo: photoBase64 || "",
    name: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    mobile: document.getElementById("mobileNo").value.trim(),
    startDate: document.getElementById("startDate").value
  };

  if (!trainer.name) return alert("Enter full name");

// NAME → Only alphabets + spaces
if (!/^[A-Za-z ]+$/.test(trainer.name)) {
    return alert("Name must contain only alphabets.");
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!trainer.email) return alert("Enter email");
if (!emailRegex.test(trainer.email)) return alert("Enter valid email");

// MOBILE VALIDATION
if (!trainer.mobile) return alert("Enter mobile number");

// Only digits allowed
if (!/^[0-9]+$/.test(trainer.mobile)) {
    return alert("Mobile number must contain only digits.");
}

// Correct length = 10 digits
if (trainer.mobile.length !== 10) {
    return alert("Mobile number must be exactly 10 digits.");
}
  if (!trainer.startDate) return alert("Select joining date");

  try {
    if (editId) {
      const res = await window.api.updateTrainer(trainer);
      if (res.success) {
        modal.style.display = "none";
        clearModalFields();
        loadTrainers();
      } else alert("Update failed");
    } else {
      const res = await window.api.saveTrainer(trainer);
      if (res.success) {
        modal.style.display = "none";
        clearModalFields();
        loadTrainers();
      } else alert("Save failed");
    }
  } catch (err) {
    console.error(err);
  }
});

// LOAD TRAINERS
async function loadTrainers() {
  const container = document.getElementById("trainerList");
  container.innerHTML = `
    <div class="trainer-row header">
      <div class="col-trainer" style="margin-left:25px;">Trainer</div>
      <div class="col-date">Joining Date</div>
    
      <div class="col-mobile">Mobile</div>
      <div class="col-action">Action</div>
    </div>
  `;

  trainerData = await window.api.getTrainers();

  trainerData.forEach((t, i) => {
    const avatar = t.photo
      ? t.photo
      : `https://i.pravatar.cc/50?img=${(i % 70) + 1}`;

    container.innerHTML += `
      <div class="trainer-row" style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #ccc;">
        
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${avatar}" style="border-radius:50%;width:45px;height:45px;object-fit:cover;">
          <div class="trainer-name">${t.name}</div>
        </div>

        <div class="trainer-date">${t.startDate}</div>
        
        <div class="trainer-mobile">${t.mobile}</div>

        <div style="display:flex;gap:15px;font-size:18px;">
          <i class="fa-solid fa-pen-to-square update-btn" data-id="${t.id}" style="color:orange;cursor:pointer;"></i>
          <i class="fa-solid fa-trash delete-btn" data-id="${t.id}" style="color:orange;cursor:pointer;"></i>
        </div>
      </div>
    `;
  });
}

// CLICK HANDLER
document.addEventListener("click", async (e) => {
  // DELETE
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    if (confirm("Delete trainer?")) {
      await window.api.deleteTrainer(id);
      loadTrainers();
    }
  }

  // EDIT
  if (e.target.classList.contains("update-btn")) {
    const id = e.target.getAttribute("data-id");
    const t = trainerData.find(x => x.id == id);
    if (!t) return;

    modal.style.display = "flex";
    
    document.getElementById("fullName").value = t.name;
    document.getElementById("email").value = t.email;
    document.getElementById("mobileNo").value = t.mobile;
    document.getElementById("startDate").value = t.startDate;

     const preview = document.getElementById("photoPreview");
    preview.src = t.photo ? t.photo : "";

    

    photoInput.value = "";

    modal.setAttribute("data-edit-id", id);
    saveBtn.innerText = "Update Trainer";
  }
});

// CLEAR MODAL
function clearModalFields() {
  photoInput.value = "";
  document.getElementById("fullName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mobileNo").value = "";
  document.getElementById("startDate").value = "";
}

// INITIAL LOAD
loadTrainers();
