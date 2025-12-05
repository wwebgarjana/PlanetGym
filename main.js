// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

// DB inside userData folder
const dbFolder = path.join(app.getPath("userData"), "database");
const dbPath = path.join(dbFolder, "planetgym.db");

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder);
}

const db = new sqlite3.Database(dbPath, () => {
    console.log("SQLite Connected Successfully!");
});

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )
`);

// ---------------- IPC: Insert User ----------------
ipcMain.handle("save-user", (event, user) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [user.email, user.password, user.role],
      (err) => {
        if (err) {
          resolve({ success: false, message: "Already Exists" });
        } else {
          resolve({ success: true });
        }
      }
    );
  });
});

// ---------------- IPC: Check Login ----------------
ipcMain.handle("check-login", (event, user) => {
  return new Promise((resolve) => {
    db.get(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [user.email, user.password],
      (err, row) => {
        if (row) resolve({ success: true, role: row.role });
        else resolve({ success: false });
      }
    );
  });
});

// ---------- CREATE PLANS TABLE ----------
db.run(`
  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_type TEXT,
    months INTEGER,
    price INTEGER,
    facilities TEXT
  )
`);

// ---------- SAVE PLAN ----------
ipcMain.handle("save-plan", (event, data) => {
  return new Promise((resolve) => {
    db.run(
      "INSERT INTO plans (plan_type, months, price, facilities) VALUES (?, ?, ?, ?)",
      [data.plan_type, data.months, data.price, data.facilities],
      (err) => {
        if (err) resolve({ success: false });
        else resolve({ success: true });
      }
    );
  });
});

// ---------- FETCH PLANS ----------
ipcMain.handle("get-plans", () => {
  return new Promise((resolve) => {
    db.all("SELECT * FROM plans", (err, rows) => {
      if (err) resolve([]);
      else resolve(rows);
    });
  });
});


// ---------------- WINDOW ----------------
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
