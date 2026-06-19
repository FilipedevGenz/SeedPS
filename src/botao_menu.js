const menuToggle = document.querySelector(".menu-toggle");
        const menuMobile = document.querySelector(".menu-mobile");

        menuToggle.addEventListener("click", () => {
            menuMobile.classList.toggle("ativo");
            document.body.classList.toggle("menu-aberto");
        });