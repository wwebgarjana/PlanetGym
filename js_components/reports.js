document.getElementById("loadReportBtn").onclick = loadReports;

function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerText = msg;
    el.style.display = "block";
}

function clearErrors() {
    document.querySelectorAll(".error-msg").forEach(e => {
        e.innerText = "";
        e.style.display = "none";
    });
}

async function loadReports() {
  clearErrors(); // clear old errors

  let monthInput = document.getElementById("reportMonth").value;

  if (!monthInput) {
    showError("monthError", "Please select month");
    return;
  }

  const [year, month] = monthInput.split("-");

  // Load Revenue Report
  // ...

  // Load Attendance Summary
  const members = await window.api.getMembers();
  const table = document.getElementById("attendanceTable");
  table.innerHTML = "";

  for (let m of members) {
    const summary = await window.api.getMonthlyAttendance(m.id, year, month);

    const present = summary.present;
    const absent = summary.absent;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.name}</td>
      <td>${present}</td>
      <td>${absent}</td>
    `;
    table.appendChild(row);
  }
}
