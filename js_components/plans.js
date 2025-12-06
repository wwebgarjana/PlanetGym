const ipc = window.api;

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

// SAVE or UPDATE PLAN
savePlanBtn.onclick = async () => {
    const plan_type = document.getElementById("planType").value;
    const months = document.getElementById("planMonths").value;
    const price = document.getElementById("planPrice").value;
    const facilities = document.getElementById("planFacilities").value;

    if (!price || !facilities.trim()) {
        alert("Please fill all fields!");
        return;
    }

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

// OPEN EDIT MODE
function openEditPlan(id, plans) {
    const plan = plans.find(p => p.id == id);

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

    deletePlanBtn.onclick = async () => {
        if (confirm("Are you sure you want to delete this plan?")) {
            await ipc.deletePlan(editPlanId);
            popupForm.classList.add("hidden");
            loadPlans();
            deletePlanBtn.classList.add("hidden");
        }
    };

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
