const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

// DB Setup
const dbFolder = path.join(app.getPath("userData"), "database");
const dbPath = path.join(dbFolder, "planetgym.db");

if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder);

const db = new sqlite3.Database(dbPath, () => {
  console.log("SQLite Connected Successfully!");
});

// USERS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )
`);


// SAVE USER
ipcMain.handle("save-user", (event, user) => {
  return new Promise(resolve => {
    db.run(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [user.email, user.password, user.role],
      err => resolve({ success: !err })
    );
  });
});

// LOGIN CHECK
ipcMain.handle("check-login", (event, user) => {
  return new Promise(resolve => {
    db.get(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [user.email, user.password],
      (err, row) => resolve(row ? { success: true, role: row.role } : { success: false })
    );
  });
});


ipcMain.handle("get-user-email", () => {
  return new Promise(resolve => {
    db.get("SELECT email FROM users LIMIT 1", (err, row) => {
      resolve(row?.email || null);
    });
  });
});


// Logout user
ipcMain.handle("logout", () => {
    currentUser = null;
    return true;
});


// PLANS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_type TEXT,
    months INTEGER,
    price INTEGER,
    facilities TEXT
  )
`);

// SAVE PLAN
ipcMain.handle("save-plan", (event, data) => {
  return new Promise(resolve => {
    db.run(
      "INSERT INTO plans (plan_type, months, price, facilities) VALUES (?, ?, ?, ?)",
      [data.plan_type, data.months, data.price, data.facilities],
      err => resolve({ success: !err })
    );
  });
});

// GET PLANS
ipcMain.handle("get-plans", () => {
  return new Promise(resolve => {
    db.all("SELECT * FROM plans", (err, rows) => resolve(rows || []));
  });
});

// UPDATE PLAN
ipcMain.handle("update-plan", (event, data) => {
  return new Promise(resolve => {
    db.run(
      "UPDATE plans SET plan_type=?, months=?, price=?, facilities=? WHERE id=?",
      [data.plan_type, data.months, data.price, data.facilities, data.id],
      err => resolve(!err)
    );
  });
});

// DELETE PLAN
ipcMain.handle("delete-plan", (event, id) => {
  return new Promise(resolve => {
    db.run("DELETE FROM plans WHERE id=?", [id], err => resolve(!err));
  });
});


// ✅ MEMBERS TABLE (UPDATED WITH MOBILE)
// --------------------------------------
// MEMBERS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo TEXT,
    name TEXT,
    email TEXT,
    mobile TEXT,
    plan TEXT,
    startDate TEXT,
    endDate TEXT
    
  )
`);


// --------------------
// IPC: Members (CRUD)
// --------------------
ipcMain.handle("save-member", (event, member) => {
  return new Promise(resolve => {
    db.run(
      `INSERT INTO members (photo, name, email, mobile, plan, startDate, endDate)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        member.photo || "",
        member.name,
        member.email,
        member.mobile,
        member.plan,
        member.startDate,
        member.endDate
      ],
      (err) => resolve({ success: !err })
    );
  });
});
 
ipcMain.handle("update-member", (event, data) => {
  return new Promise(resolve => {
    db.run(
      `UPDATE members
       SET photo=?, name=?, email=?, mobile=?, plan=?, startDate=?, endDate=?
       WHERE id=?`,
      [
        data.photo || "",
        data.name,
        data.email,
        data.mobile,
        data.plan,
        data.startDate,
        data.endDate,
        data.id
      ],
      (err) => resolve({ success: !err })
    );
  });
});
 
ipcMain.handle("delete-member", (event, id) => {
  return new Promise(resolve => {
    db.run("DELETE FROM members WHERE id=?", [id], (err) => {
      resolve({ success: !err });
    });
  });
});
 
ipcMain.handle("get-members", () => {
  return new Promise(resolve => {
    db.all("SELECT * FROM members ORDER BY id DESC", (err, rows) => {
      resolve(rows || []);
    });
  });
});


// MEMBERS TABLE
// TRAINERS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS trainers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo TEXT,
    name TEXT,
    email TEXT,
    mobile TEXT,
    startDate TEXT
  )
`);


// --------------------
// IPC: Trainers (CRUD)
// --------------------
ipcMain.handle("save-trainer", (event, trainer) => {
  return new Promise(resolve => {
    db.run(
      `INSERT INTO trainers (photo, name, email, mobile, startDate)
       VALUES (?, ?, ?, ?, ?)`,
      [
        trainer.photo || "",
        trainer.name,
        trainer.email,
        trainer.mobile,
        trainer.startDate
      ],
      err => resolve({ success: !err })
    );
  });
});

 
ipcMain.handle("update-trainer", (event, data) => {
  return new Promise(resolve => {
    db.run(
      `UPDATE trainers
       SET photo=?, name=?, email=?, mobile=?, startDate=?
       WHERE id=?`,
      [
        data.photo || "",
        data.name,
        data.email,
        data.mobile,
        data.startDate,
        data.id
      ],
      err => resolve({ success: !err })
    );
  });
});

 
ipcMain.handle("delete-trainer", (event, id) => {
  return new Promise(resolve => {
    db.run("DELETE FROM trainers WHERE id=?", [id], err => resolve({ success: !err }));
  });
});

 
ipcMain.handle("get-trainers", () => {
  return new Promise(resolve => {
    db.all("SELECT * FROM trainers ORDER BY id DESC", (err, rows) => {
      resolve(rows || []);
    });
  });
});

// COUNT MEMBERS
ipcMain.handle("count-members", () => {
  return new Promise(resolve => {
    db.get("SELECT COUNT(*) AS total FROM members", (err, row) => {
      resolve(row?.total || 0);
    });
  });
});

// COUNT TRAINERS
ipcMain.handle("count-trainers", () => {
  return new Promise(resolve => {
    db.get("SELECT COUNT(*) AS total FROM trainers", (err, row) => {
      resolve(row?.total || 0);
    });
  });
});

// TOTAL REVENUE (SUM of prices from plans & members)
ipcMain.handle("total-revenue", () => {
  return new Promise(resolve => {
    const query = `
      SELECT SUM(p.price) AS total
      FROM members m
      JOIN plans p ON p.months = m.plan
    `;

    db.get(query, (err, row) => {
      resolve(row?.total || 0);
    });
  });
});

ipcMain.handle("active-members", () => {
  return new Promise(resolve => {
    db.get("SELECT COUNT(*) AS total FROM members where status='active'", (err, row) => {
      resolve(row?.total || 0);
    });
  });
});

db.run(`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER,
    date TEXT,
    in_time TEXT,
    out_time TEXT
  )
`);
ipcMain.handle("check-today-attendance", (event, id, date) => {
  return new Promise(resolve => {
    db.get(
      "SELECT * FROM attendance WHERE member_id=? AND date=?",
      [id, date],
      (err, row) => {
        resolve({
          completed: row?.in_time && row?.out_time ? true : false,
          inDone: row?.in_time ? true : false,
          outDone: row?.out_time ? true : false
        });
      }
    );
  });
});

ipcMain.handle("mark-in", (event, id) => {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString();

  return new Promise(resolve => {
    db.run(
      `INSERT INTO attendance (member_id, date, in_time)
       VALUES (?, ?, ?)`,
      [id, date, time],
      err => resolve({ success: !err })
    );
  });
});

ipcMain.handle("mark-out", (event, id) => {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString();

  return new Promise(resolve => {
    db.run(
      `UPDATE attendance SET out_time=? 
       WHERE member_id=? AND date=?`,
      [time, id, date],
      err => resolve({ success: !err })
    );
  });
});




ipcMain.handle("get-monthly-attendance", (event, memberId, year, month) => {
  const start = `${year}-${month}-01`;
  const end = `${year}-${month}-31`;

  return new Promise(resolve => {
    db.all(
      `SELECT * FROM attendance 
       WHERE member_id=? 
       AND date BETWEEN ? AND ?`,
      [memberId, start, end],
      (err, rows) => {
        const present = rows.length;
        const absent = 30 - present; // Approx month days
        resolve({ present, absent });
      }
    );
  });
});

ipcMain.handle("update-password", async (event, data) => {
    const { email, newPassword } = data;

    const row = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if(!row){
        return false; // Email not found
    }

    await db.run("UPDATE users SET password = ? WHERE email = ?", [
        newPassword,
        email
    ]);

    return true;
});







// WINDOW
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, "html_components", "sign_in.html"));
}

app.whenReady().then(createWindow);
