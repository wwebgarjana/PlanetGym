const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.querySelector('input[name="role"]').value;

  // 1️⃣ FIRST TIME HARDCODED LOGIN
  if (email === "aaa@gmail.com" && password === "1234") {
    const res = await window.api.saveUser(email, password, role);
    
    if (res.success) {
      alert("First Login Successful (Saved to DB)");
    } else {
      alert("User already exists! Logging you in...");
    }

    window.location.href = "dashboard.html";  
    return;
  }

  // 2️⃣ NEXT TIME — CHECK FROM DATABASE
  const loginCheck = await window.api.checkLogin(email, password);

  if (loginCheck.success) {
    alert("Login Success!");

    // PAGE REFRESH + REDIRECT
    window.location.href = "dashboard.html";
  } else {
    alert("Incorrect email or password!");
  }
});
