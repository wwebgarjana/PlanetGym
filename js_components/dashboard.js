// document.addEventListener("DOMContentLoaded", async () => {

//     // ---------- SAFE API (to prevent crash if window.api missing) ----------
//     const api = window.api || {
//         countMembers: async () => 0,
//         countTrainers: async () => 0,
//         totalRevenue: async () => 0,
//         getCurrentUser: async () => ({ email: "demo@example.com" }),
//         logout: async () => {}
//     };

//     // ---------- DASHBOARD STATS ----------
//     const cards = document.querySelectorAll(".card h2");
//     const totalMembersBox  = cards[0];
//     const revenueBox       = cards[1];
//     const totalTrainersBox = cards[2];

//     const members  = await api.countMembers();
//     const trainers = await api.countTrainers();
//     const revenue  = await api.totalRevenue();

//     totalMembersBox.innerText   = members;
//     totalTrainersBox.innerText  = trainers;
//     revenueBox.innerText        = `₹${revenue}`;

//     // ---------- USER PROFILE DROPDOWN ----------
//     const userIcon     = document.getElementById("userIcon");
//     const userDropdown = document.getElementById("userDropdown");
//     const userEmail    = document.getElementById("userEmail");
//     const logoutBtn    = document.getElementById("logoutBtn");

//     if (userIcon && userDropdown && userEmail && logoutBtn) {

//         // Toggle dropdown
//         userIcon.addEventListener("click", async (e) => {
//             e.stopPropagation();
//             const user = await api.getCurrentUser();
//             userEmail.innerText = user?.email || "No email";

//             userDropdown.style.display =
//                 userDropdown.style.display === "none" ? "block" : "none";
//         });

//         // Close dropdown on outside click
//         document.addEventListener("click", () => {
//             userDropdown.style.display = "none";
//         });

//         logoutBtn.addEventListener("click", async () => {
//             await api.logout();
//             window.location.href = "sign_in.html";
//         });
//     }

// });



document.addEventListener("DOMContentLoaded", async () => {

    const api = window.api;

    // ---------- DASHBOARD STATS ----------
    const cards = document.querySelectorAll(".card h2");
    const totalMembersBox  = cards[0];
    const revenueBox       = cards[1];
    const totalTrainersBox = cards[2];

    const members  = await api.countMembers();
    const trainers = await api.countTrainers();
    const revenue  = await api.totalRevenue();

    totalMembersBox.innerText   = members;
    totalTrainersBox.innerText  = trainers;
    revenueBox.innerText        = `₹${revenue}`;

    // ---------- USER PROFILE DROPDOWN ----------
    const userIcon     = document.getElementById("userIcon");
    const userDropdown = document.getElementById("userDropdown");
    const userEmail    = document.getElementById("userEmail");
    const logoutBtn    = document.getElementById("logoutBtn");

    if (userIcon && userDropdown) {

       userIcon.addEventListener("click", async (e) => {
    e.stopPropagation();

    const email = await api.getUserEmail(); 

    userEmail.innerText = email || "No User";

    userDropdown.style.display =
        userDropdown.style.display === "none" ? "block" : "none";
});

        


        document.addEventListener("click", () => {
            userDropdown.style.display = "none";
        });

        logoutBtn.addEventListener("click", async () => {
            await api.logout();
            window.location.href = "sign_in.html";
        });
    }

});
