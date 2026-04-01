/* ── 1. Formulário: rótulo flutuante ─────────────────────────────────────── */
const inputs = document.querySelectorAll(".input");

function focusFunc() { this.parentNode.classList.add("focus"); }
function blurFunc()  { if (this.value === "") this.parentNode.classList.remove("focus"); }

inputs.forEach((input) => {
    input.addEventListener("focus", focusFunc);
    input.addEventListener("blur",  blurFunc);
});

/* ── 2. Revelação por rolagem dos cards ──────────────────────────────────── */
const cards = document.querySelectorAll(".card_sobre");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity   = "1";
                    entry.target.style.transform = "translateY(0)";
                }, i * 120);
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

cards.forEach((card) => {
    card.style.opacity    = "0";
    card.style.transform  = "translateY(24px)";
    card.style.transition = "opacity .5s ease, transform .5s ease, box-shadow .25s ease";
    revealObserver.observe(card);
});

/* ── 3. Menu hamburguer ──────────────────────────────────────────────────── */
const menuToggle = document.querySelector(".menu-toggle");
const navbar     = document.querySelector(".navbar");
const navOverlay = document.getElementById("nav-overlay");
const navLinks   = document.querySelectorAll(".navbar .nav-link");

function openMenu() {
    navbar.classList.add("open");
    menuToggle.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    navOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeMenu() {
    navbar.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    navOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

menuToggle.addEventListener("click", () => navbar.classList.contains("open") ? closeMenu() : openMenu());
navOverlay.addEventListener("click", closeMenu);
navLinks.forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => { if (window.innerWidth >= 768) closeMenu(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });