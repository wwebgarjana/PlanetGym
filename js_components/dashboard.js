document.addEventListener("DOMContentLoaded", async () => {
    
    const totalMembersBox = document.querySelectorAll(".card h2")[0];
    const activeTodayBox  = document.querySelectorAll(".card h2")[1];
    const revenueBox      = document.querySelectorAll(".card h2")[2];
    const totalTrainersBox= document.querySelectorAll(".card h2")[3];

    // FETCH FROM DB (IPC)
    const members = await window.api.countMembers();
    const trainers = await window.api.countTrainers();
    const revenue = await window.api.totalRevenue();
    const active=await window.api.countActiveToday();

    // SET DASHBOARD VALUES
    totalMembersBox.innerText = members;
    totalTrainersBox.innerText = trainers;
    revenueBox.innerText = `₹${revenue}`;
    activeTodayBox.innerText = active;

    
    
});
