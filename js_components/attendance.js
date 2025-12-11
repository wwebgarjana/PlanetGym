// TODAY DATE
const today = new Date().toISOString().split("T")[0];

// Load all members
async function loadMembers() {
  const members = await window.api.getMembers();

  const tbody = document.getElementById("membersTable");
  tbody.innerHTML = "";

  members.forEach(async (m) => {
    const status = await window.api.checkTodayAttendance(m.id, today);

    const row = document.createElement("tr");

    row.innerHTML = `
      
      
      <td style="color:black">${m.name}</td>
      <td style="color:black">${m.mobile}</td>

      <td>
        <button class="in-btn" id="in-${m.id}">IN</button>
      </td>

      <td>
        <button class="out-btn" id="out-${m.id}" disabled>OUT</button>
      </td>
    `;

    tbody.appendChild(row);

    const inBtn = document.getElementById(`in-${m.id}`);
    const outBtn = document.getElementById(`out-${m.id}`);

    // IF ALREADY COMPLETED
    if (status.completed) {
      disableBoth(inBtn, outBtn);
    }

    // IF already IN done but not OUT
    if (status.inDone && !status.outDone) {
      inBtn.classList.add("disabled");
      inBtn.disabled = true;
      outBtn.disabled = false;
    }

    // IN CLICK
    inBtn.onclick = async () => {
      const res = await window.api.markIn(m.id);

      if (!res.success) return alert("Error marking IN");

      inBtn.classList.add("disabled");
      inBtn.disabled = true;
      outBtn.disabled = false;
    };

    // OUT CLICK
    outBtn.onclick = async () => {
      const res = await window.api.markOut(m.id);

      if (!res.success) return alert("Error marking OUT");

      disableBoth(inBtn, outBtn);
    };

  });
}

function disableBoth(inBtn, outBtn) {
  inBtn.classList.add("disabled");
  outBtn.classList.add("disabled");
  inBtn.disabled = true;
  outBtn.disabled = true;
}

loadMembers();
