document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll('.sidebar .menu li a');
    let path = window.location.pathname.split("/").pop();

    // Agar URL empty ho (home), dashboard.html ko consider karo
    if (path === "") path = "dashboard.html";

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split("/").pop().trim();

        // Pehle saare se active class remove kar do
        link.classList.remove('active');

        // Fir sirf current page ko add karo
        if (linkHref === path) {
            link.classList.add('active');
        }
    });
});
