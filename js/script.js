/* ── 1. Revelação por rolagem dos cards ──────────────────────────────────── */
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

/* ── 4. Projetos: filtragem por categorias ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.projetos_item');
    const projects = document.querySelectorAll('.projetos__content');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            projects.forEach(project => {
                // Se o filtro for 'all', mostra todos. 
                // Caso contrário, verifica se o projeto contém a classe correspondente ao filtro (removendo o ponto inicial do seletor)
                const filterClass = filter.replace('.', '');
                
                if (filter === 'all' || project.classList.contains(filterClass)) {
                    project.style.display = 'flex'; // Mantendo o display flex original do CSS
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
 
    /* ── 5. Projetos: botão active-work ─────────────────────────────────── */
    const filterItems = document.querySelectorAll('.projetos_item');
 
    function setActiveWork() {
        filterItems.forEach(item => item.classList.remove('active-work'));
        this.classList.add('active-work');
    }
 
    filterItems.forEach(item => item.addEventListener('click', setActiveWork));
 
    /* ── 6. Projetos: modal "Ver Detalhes" ───────────────────────────────── */
    const projectButtons = document.querySelectorAll('.projetos__button');
 
    projectButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
 
            const card        = button.closest('.projetos__content');
            const image       = card.querySelector('.projetos__img').src;
            const title       = card.querySelector('.projetos__title').textContent;
            const description = card.querySelector('.projetos__description').textContent;
 
            const area     = card.dataset.area     || 'N/A';
            const duration = card.dataset.duration || 'N/A';
            const client   = card.dataset.client   || 'Confidencial';
 
            openProjectModal({ image, title, description, area, duration, client });
        });
    });
});
 
function openProjectModal(project) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0,0,0,.7);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; opacity: 0;
        transition: opacity .3s ease;
        padding: 1rem;
    `;
 
    overlay.innerHTML = `
        <div class="modal-card" style="
            background: var(--color-white);
            border-radius: 1rem;
            max-width: 560px; width: 100%;
            max-height: 90vh; overflow-y: auto;
            position: relative;
            transform: scale(.88);
            transition: transform .3s ease;
            box-shadow: 0 20px 60px rgba(0,0,0,.25);
        ">
            <button class="modal-close-btn" aria-label="Fechar" style="
                position: absolute; top: .75rem; right: .75rem;
                background: none; border: none; cursor: pointer;
                font-size: 1.5rem; color: var(--color-dark);
                line-height: 1; padding: .25rem .5rem;
                border-radius: 4px; transition: background .2s;
            ">&times;</button>
 
            <img src="${project.image}" alt="${project.title}" style="
                width: 100%; height: 220px; object-fit: cover;
                border-radius: 1rem 1rem 0 0; display: block;
            ">
 
            <div style="padding: 1.4rem 1.6rem 1.8rem;">
                <h3 style="
                    font-size: clamp(16px,2vw,20px);
                    color: var(--color-dark); font-weight: 700;
                    margin-bottom: .5rem;
                ">${project.title}</h3>
 
                <p style="
                    font-size: clamp(13px,1.3vw,14px);
                    color: var(--color-dark); line-height: 1.6;
                    margin-bottom: 1.2rem;
                ">${project.description}</p>
 
                <div style="
                    display: grid; grid-template-columns: repeat(3,1fr);
                    gap: .75rem;
                ">
                    ${[
                        ['Área',    project.area],
                        ['Duração', project.duration],
                        ['Cliente', project.client]
                    ].map(([label, value]) => `
                        <div style="
                            background: var(--color-bg);
                            border-radius: .5rem;
                            padding: .7rem .6rem;
                            text-align: center;
                        ">
                            <p style="font-size:.7rem; font-weight:700;
                                color:var(--color-teal); text-transform:uppercase;
                                letter-spacing:.8px; margin-bottom:.3rem;">
                                ${label}
                            </p>
                            <p style="font-size:clamp(12px,1.2vw,13px);
                                color:var(--color-dark); font-weight:600;">
                                ${value}
                            </p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
 
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
 
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.querySelector('.modal-card').style.transform = 'scale(1)';
    });
 
    function closeModal() {
        overlay.style.opacity = '0';
        overlay.querySelector('.modal-card').style.transform = 'scale(.88)';
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.style.overflow = '';
        }, 280);
    }
 
    overlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

/* ── 7. Rodapé: ano automático no copyright ──────────────────────────────── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── 8. Footer: animação de entrada via IntersectionObserver ──────────────
   Cada coluna desliza suavemente para cima ao entrar na viewport.
   ─────────────────────────────────────────────────────────────────────── */
(function initFooterReveal() {
    const cols = document.querySelectorAll('.footer__col');

    if (!cols.length) return;

    cols.forEach((col) => {
        col.style.opacity   = '0';
        col.style.transform = 'translateY(28px)';
        col.style.transition = 'opacity .55s ease, transform .55s ease';
    });

    const footerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const cols = entry.target.querySelectorAll('.footer__col');
                cols.forEach((col, i) => {
                    setTimeout(() => {
                        col.style.opacity   = '1';
                        col.style.transform = 'translateY(0)';
                    }, i * 100);
                });

                footerObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.08 }
    );

    const footerGrid = document.querySelector('.footer__grid');
    if (footerGrid) footerObserver.observe(footerGrid);
})();

/* ── 10. Contato: badge de disponibilidade dinâmico ──────────────────────── */
(function initAvailBadge() {
    const badge = document.getElementById('contato-avail-badge');
    const replyMsg = document.getElementById('contato-reply-msg');
    if (!badge || !replyMsg) return;

    const now = new Date();
    const day = now.getDay();   /* 0 = dom, 6 = sáb */
    const hour = now.getHours();
    const isOpen = day >= 1 && day <= 5 && hour >= 8 && hour < 18;

    if (isOpen) {
        badge.innerHTML =
            '<div class="contato-avail online">' +
                '<span class="avail-dot on" aria-hidden="true"></span>' +
                'Online agora' +
            '</div>';
        replyMsg.textContent = 'Respondemos em até 1h';
    } else {
        const nextDay = (day === 0 || day === 6) ? 'segunda-feira' : 'amanhã';
        badge.innerHTML =
            '<div class="contato-avail offline">' +
                '<span class="avail-dot off" aria-hidden="true"></span>' +
                'Fora do horário' +
            '</div>';
        replyMsg.textContent = 'Respondemos ' + nextDay + ' a partir das 8h';
    }
})();
(function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    function toggleVisibility() {
        if (window.scrollY > window.innerHeight * 0.6) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();