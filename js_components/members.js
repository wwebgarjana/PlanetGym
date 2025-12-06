// // Open & Close Modal
// const addBtn = document.getElementById("addMemberBtn");
// const modal = document.getElementById("memberModal");
// const closeModal = document.getElementById("closeModal");

// addBtn.onclick = () => modal.style.display = "flex";
// closeModal.onclick = () => modal.style.display = "none";

// // Auto End Date
// document.getElementById("plan").addEventListener("change", () => {
//     let months = parseInt(document.getElementById("plan").value);
//     let start = document.getElementById("startDate").value;

//     if (!start) return;

//     let sDate = new Date(start);
//     sDate.setMonth(sDate.getMonth() + months);

//     document.getElementById("endDate").value = sDate.toISOString().split("T")[0];
// });

// // ---------------------------
// // SAVE MEMBER IN DATABASE
// // ---------------------------
// document.getElementById("saveMember").addEventListener("click", async () => {

//     let member = {
//         photo: "", // file handling baad me add kar denge
//         name: document.getElementById("fullName").value,
//         email: document.getElementById("email").value,
//         mobile: document.getElementById("mobileNo").value,
//         plan: document.getElementById("plan").value,
//         startDate: document.getElementById("startDate").value,
//         endDate: document.getElementById("endDate").value
//     };

//     let result = await window.api.saveMember(member);

//     if (result.success) {
//         modal.style.display = "none";
//         loadMembers();
//     }
// });

// // ---------------------------
// // FETCH MEMBERS
// // ---------------------------
// async function loadMembers() {
//     let container = document.getElementById("memberList");
//     container.innerHTML = "";

//     let members = await window.api.getMembers();

//     members.forEach((m, i) => {
//         container.innerHTML += `
//             <div class="member-row">
//                 <div style="display:flex;align-items:center;">
//                     <img src="https://i.pravatar.cc/50?img=${i+1}">
//                     <div>
//                         <div>${m.name}</div>
//                         <small>${m.plan} Month Plan</small>
//                     </div>
//                 </div>

//                 <div>${m.endDate}</div>

//                 <div class="status pending">Pending</div>
//             </div>
//         `;
//     });
// }

// loadMembers();





// ---------------------------------
// OPEN & CLOSE MODAL
// ---------------------------------
const addBtn = document.getElementById("addMemberBtn");
const modal = document.getElementById("memberModal");
const closeModal = document.getElementById("closeModal");

addBtn.onclick = () => modal.style.display = "flex";
closeModal.onclick = () => modal.style.display = "none";


// ---------------------------------
// LOAD PLANS INTO DROPDOWN
// ---------------------------------
async function loadPlansDropdown() {
    let planSelect = document.getElementById("plan");
    planSelect.innerHTML = `<option value="">Select Plan</option>`;

    let plans = await window.api.getPlans();

    plans.forEach(p => {
        planSelect.innerHTML += `
            <option value="${p.months}" data-price="${p.price}">
                ${p.plan_type} (${p.months} Months)
            </option>
        `;
    });
}
loadPlansDropdown();


// ---------------------------------
// AUTO END DATE CALCULATION
// ---------------------------------
document.getElementById("plan").addEventListener("change", () => {
    let months = parseInt(document.getElementById("plan").value);
    let start = document.getElementById("startDate").value;

    if (!start || !months) return;

    let sDate = new Date(start);
    sDate.setMonth(sDate.getMonth() + months);

    document.getElementById("endDate").value = sDate.toISOString().split("T")[0];
});

document.getElementById("startDate").addEventListener("change", () => {
    let months = parseInt(document.getElementById("plan").value);
    let start = document.getElementById("startDate").value;

    if (!start || !months) return;

    let sDate = new Date(start);
    sDate.setMonth(sDate.getMonth() + months);

    document.getElementById("endDate").value = sDate.toISOString().split("T")[0];
});


// ---------------------------------
// SAVE MEMBER
// ---------------------------------
document.getElementById("saveMember").addEventListener("click", async () => {

    let member = {
        photo: "",
        name: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobileNo").value,
        plan: document.getElementById("plan").value,
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value
    };

    let result = await window.api.saveMember(member);

    if (result.success) {
        modal.style.display = "none";
        loadMembers();
    }
});


// ---------------------------------
// FETCH MEMBERS
// ---------------------------------
async function loadMembers() {
    let container = document.getElementById("memberList");
    container.innerHTML = "";

    // ---------- HEADER ROW ----------
    container.innerHTML += `
        <div class="member-row header">
            <div style="margin-left: 50px;">Member</div>
            <div>End Date</div>
            <div>Status</div>
        </div>
    `;

    // ---------- MEMBERS ----------
    let members = await window.api.getMembers();

    members.forEach((m, i) => {
        container.innerHTML += `
            <div class="member-row" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-bottom:1px solid #ccc;">
                
                <div style="display:flex;align-items:center; gap:10px;">
                    <img src="https://i.pravatar.cc/50?img=${i+1}" style="border-radius:50%;">
                    <div>
                        <div style="font-weight:500;">${m.name}</div>
                        <small>${m.plan} Month Plan</small>
                    </div>
                </div>

                <div style="width:120px; text-align:center;">${m.endDate}</div>

                <div class="status pending" style="width:80px; text-align:center;">Pending</div>
            </div>
        `;
    });
}

loadMembers();



