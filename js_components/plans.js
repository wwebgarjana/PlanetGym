const { ipcRenderer } = window.electron;

// UI Elements
const openFormBtn = document.getElementById("openFormBtn");
const popupForm = document.getElementById("popupForm");
const closeFormBtn = document.getElementById("closeFormBtn");
const savePlanBtn = document.getElementById("savePlanBtn");
const plansContainer = document.getElementById("plansContainer");

// Open Popup
openFormBtn.onclick = () => {
    popupForm.classList.remove("hidden");
};

// Close Popup
closeFormBtn.onclick = () => {
    popupForm.classList.add("hidden");
};

// Save Plan
savePlanBtn.onclick = async () => {
    const data = {
        plan_type: document.getElementById("planType").value,
        months: document.getElementById("planMonths").value,
        price: document.getElementById("planPrice").value,
        facilities: document.getElementById("planFacilities").value
    };

    await ipcRenderer.invoke("save-plan", data);

    popupForm.classList.add("hidden");
    loadPlans();
};

// Load Plans
async function loadPlans() {
    const plans = await ipcRenderer.invoke("get-plans");

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

            <button class="edit-btn">Edit Plan</button>
        `;

        plansContainer.appendChild(card);
    });
}

// Load plans on start
loadPlans();
