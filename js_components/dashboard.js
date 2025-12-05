const ctx = document.getElementById("chart").getContext("2d");
 
new Chart(ctx, {
    type: "line",
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
            label: "",
            data: [120, 260, 210, 340, 300, 480],
            borderColor: "#ff7a1f",
            borderWidth: 3,
            fill: false,
            tension: 0.4
        }]
    },
    options: {
        plugins: { legend: { display: false } },
        scales: {
            y: { ticks: { color: "white" }, grid: { color: "#222" }},
            x: { ticks: { color: "white" }, grid: { color: "#222" }}
        }
    }
});