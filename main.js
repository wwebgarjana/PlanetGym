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


// --------------------------------------
// ✅ SAVE MEMBER API
// --------------------------------------
ipcMain.handle("save-member", (event, member) => {
  return new Promise(resolve => {
    db.run(
      `INSERT INTO members (photo, name, email, mobile, plan, startDate, endDate)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        member.photo,
        member.name,
        member.email,
        member.mobile,
        member.plan,
        member.startDate,
        member.endDate
      ],
      err => resolve({ success: !err })
    );
  });
});

// --------------------------------------
// ✅ GET ALL MEMBERS API
// --------------------------------------
ipcMain.handle("get-members", () => {
  return new Promise(resolve => {
    db.all(
      "SELECT * FROM members ORDER BY id DESC",
      (err, rows) => resolve(rows || [])
    );
  });
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

  win.loadFile(path.join(__dirname, "html_components", "dashboard.html"));
}

app.whenReady().then(createWindow);
