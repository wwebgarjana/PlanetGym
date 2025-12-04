const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]').value;

    // Hardcoded credentials
    const hardcodedEmail = "admin@planetgym.com";
    const hardcodedPassword = "123456";

    if(email === hardcodedEmail && password === hardcodedPassword){
        alert(`Logged in as ${role} with email ${email}`);

        // Save login info to SQLite
        const sqlite3 = require("sqlite3").verbose();
        const path = require("path");

        const dbPath = path.join(__dirname, "../database/planetgym.db");
        const db = new sqlite3.Database(dbPath);

        db.run(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            [email, password, role],
            function(err){
                if(err) console.error("DB Insert Error:", err);
                else console.log("User saved to DB!");
            }
        );

        db.close();
    } else {
        alert("Invalid email or password.");
    }
});
