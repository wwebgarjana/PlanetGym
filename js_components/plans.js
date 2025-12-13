const ipc = window.api;


function validatePlanForm() {
    let isValid = true;

    // clear old errors
    document.querySelectorAll(".error-msg").forEach(e => {
        e.style.display = "none";
        e.innerText = "";
    });

    const price = document.getElementById("planPrice").value;
    const facilities = document.getElementById("planFacilities").value.trim();

    // PRICE validation
    if (!price || Number(price) <= 0) {
        showError("priceError", "Price is required and must be greater than 0");
        isValid = false;
    }

    // FACILITIES validation
    if (!facilities) {
        showError("dataError", "Facilities are required");
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




// UI Elements
const openFormBtn = document.getElementById("openFormBtn");
const popupForm = document.getElementById("popupForm");
const closeFormBtn = document.getElementById("closeFormBtn");
const savePlanBtn = document.getElementById("savePlanBtn");
const deletePlanBtn = document.getElementById("deletePlanBtn");
const plansContainer = document.getElementById("plansContainer");

let editMode = false;
let editPlanId = null;

// Reset Form
function resetForm() {
    document.getElementById("planType").value = "Basic";
    document.getElementById("planMonths").value = "1";
    document.getElementById("planPrice").value = "";
    document.getElementById("planFacilities").value = "";
}

// OPEN ADD PLAN POPUP
openFormBtn.onclick = () => {
    resetForm();
    editMode = false;
    editPlanId = null;

    savePlanBtn.innerText = "Save Plan";
    document.getElementById("formTitle").innerText = "Add New Plan";

    deletePlanBtn.classList.add("hidden");

    popupForm.classList.remove("hidden");
};

// CLOSE POPUP
closeFormBtn.onclick = () => {
    popupForm.classList.add("hidden");
};

savePlanBtn.onclick = async () => {
    const plan_type = document.getElementById("planType").value;
    const months = document.getElementById("planMonths").value;
    const price = document.getElementById("planPrice").value;
    const facilities = document.getElementById("planFacilities").value;

    // ✅ New validation
    if (!validatePlanForm()) return;

    if (editMode) {
        await ipc.updatePlan({
            id: editPlanId,
            plan_type,
            months,
            price,
            facilities
        });
    } else {
        await ipc.savePlan(plan_type, months, price, facilities);
    }

    popupForm.classList.add("hidden");
    loadPlans();
};

   // DELETE PLAN (global)
deletePlanBtn.addEventListener("click", async () => {
    if (!editPlanId) return;

    try {
        await ipc.deletePlan(editPlanId);

        popupForm.classList.add("hidden");
        editPlanId = null;
        editMode = false;
        deletePlanBtn.classList.add("hidden");

        loadPlans();
    } catch (err) {
        console.error("Delete failed:", err);
        alert("Something went wrong while deleting the plan.");
    }
});

// OPEN EDIT PLAN
function openEditPlan(id, plans) {
    const plan = plans.find(p => p.id == id);
    if (!plan) return;

    editMode = true;
    editPlanId = id;

    document.getElementById("formTitle").innerText = "Update Plan";
    document.getElementById("planType").value = plan.plan_type;
    document.getElementById("planMonths").value = plan.months;
    document.getElementById("planPrice").value = plan.price;
    document.getElementById("planFacilities").value = plan.facilities;

    savePlanBtn.innerText = "Update Plan";

    // SHOW DELETE BUTTON
    deletePlanBtn.classList.remove("hidden");

    // OPEN POPUP
    popupForm.classList.remove("hidden");
}

// LOAD PLANS
async function loadPlans() {
    const plans = await ipc.getPlans();

    plansContainer.innerHTML = "";

    plans.forEach(plan => {
        const card = document.createElement("div");
        card.className = "plan-card";

        card.innerHTML = `
            <h3>${plan.months} Month ${plan.plan_type}</h3>
            <div class="price">₹${plan.price}</div>
            <ul>
                ${plan.facilities.split(",").map(f => `<li>${f.trim()}</li>`).join("")}
            </ul>
            <button class="edit-btn" data-id="${plan.id}">Edit Plan</button>
        `;

        plansContainer.appendChild(card);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = () => openEditPlan(btn.dataset.id, plans);
    });
}

loadPlans();
