document.addEventListener("DOMContentLoaded", () => {

    const email = document.getElementById("email");
    const newPass = document.getElementById("newPass");
    const confirmPass = document.getElementById("confirmPass");
    const resetBtn = document.getElementById("resetBtn");

    resetBtn.addEventListener("click", async () => {

        if(email.value.trim() === "" || newPass.value.trim() === "" || confirmPass.value.trim() === ""){
            alert("Please fill all fields!");
            return;
        }

        if(newPass.value !== confirmPass.value){
            alert("Passwords do not match!");
            return;
        }

        // Send to backend (DB update)
        const result = await window.api.updatePassword(email.value, newPass.value);

        if(result){
            alert("Password updated successfully!");
            window.location.href = "sign_in.html";
        } else {
            alert("Email not found!");
        }
    });
});
