document.getElementById("loadReportBtn").onclick = loadReports;

async function loadReports() {
  let monthInput = document.getElementById("reportMonth").value;

  if (!monthInput) {
    alert("Please select month");
    return;
  }

  const [year, month] = monthInput.split("-");

  // Load Revenue Report
 


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
