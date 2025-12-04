const { app, BrowserWindow } = require('electron');
const path = require('path');

// -------------------- SQLITE CODE --------------------
const sqlite3 = require("sqlite3").verbose();

// Path to DB inside database folder
const dbPath = path.join(__dirname, "database", "planetgym.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.log("DB Connection Error:", err);
  else console.log("SQLite Connected Successfully!");
});

// Create table to force DB creation
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, role TEXT)",
    (err) => {
      if (err) console.log(err);
      else console.log("Users table checked/created");
    }
  );
});
// ------------------------------------------------------


// ---------------- WINDOW CODE (SAME AS YOURS) ----------------
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile(path.join(__dirname, 'html_components', 'sign_in.html'));
}

app.whenReady().then(createWindow);
// --------------------------------------------------------------





