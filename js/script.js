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
 
            const card = button.closest('.projetos__content');
            const image           = card.querySelector('.projetos__img').src;
            const title           = card.querySelector('.projetos__title').textContent;
            const description     = card.querySelector('.projetos__description').textContent;
 
            const area            = card.dataset.area            || 'N/A';
            const duration        = card.dataset.duration        || 'N/A';
            const client          = card.dataset.client          || 'Confidencial';
            const sketchfab       = card.dataset.sketchfab       || '';
            const subtitle        = card.dataset.subtitle        || '';
            const fullDescription = card.dataset.fullDescription || description;
            const planta          = card.dataset.planta          || '';
 
            openProjectModal({ image, title, description, area, duration, client, sketchfab, subtitle, fullDescription, planta });
        });
    });
});
 
function openProjectModal(project) {
    const has3D    = !!project.sketchfab;
    const hasPlanta = project.planta && project.planta !== '#';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position:fixed;inset:0;
        background:rgba(11,42,64,.75);
        display:flex;align-items:center;justify-content:center;
        z-index:9999;opacity:0;
        transition:opacity .3s ease;
        padding:1rem;
    `;

    const infoCards = [
        ['Área',    project.area,     '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'],
        ['Duração', project.duration, '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'],
        ['Cliente', project.client,   '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>'],
    ].map(([label, value, icon]) => `
        <div style="background:var(--color-bg);border-radius:.6rem;padding:.75rem .5rem;text-align:center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="var(--color-teal)" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round"
                 style="margin:0 auto .3rem;display:block;">${icon}</svg>
            <p style="font-size:.62rem;font-weight:700;color:var(--color-teal);
                text-transform:uppercase;letter-spacing:.8px;margin-bottom:.2rem;">${label}</p>
            <p style="font-size:clamp(11px,1.1vw,12.5px);color:var(--color-dark);font-weight:600;">${value}</p>
        </div>
    `).join('');

    const tabsHTML = has3D ? `
        <div style="display:flex;border-top:1px solid #EEF2F2;background:var(--color-white);flex-shrink:0;">
            <button data-tab="foto" class="modal-tab" style="
                flex:1;padding:.7rem .5rem;border:none;background:none;
                font-family:'Montserrat',sans-serif;font-size:12px;font-weight:600;
                color:var(--color-dark);cursor:pointer;
                border-bottom:2.5px solid var(--color-teal);
                display:flex;align-items:center;justify-content:center;gap:6px;
            ">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                Fotos
            </button>
            <button data-tab="3d" class="modal-tab" style="
                flex:1;padding:.7rem .5rem;border:none;background:none;
                font-family:'Montserrat',sans-serif;font-size:12px;font-weight:600;
                color:#7a8f9a;cursor:pointer;border-bottom:2.5px solid transparent;
                display:flex;align-items:center;justify-content:center;gap:6px;
            ">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                Modelo 3D
            </button>
        </div>
    ` : '';

    const plantaBtn = hasPlanta ? `
        <a href="${project.planta}" target="_blank" style="
            display:inline-flex;align-items:center;gap:8px;
            padding:.65rem 1.1rem;border-radius:8px;
            border:1.5px solid var(--color-teal);
            color:var(--color-teal);font-size:12.5px;font-weight:600;
            font-family:'Montserrat',sans-serif;
            text-decoration:none;transition:background .2s,color .2s;
            background:transparent;cursor:pointer;
        "
        onmouseover="this.style.background='var(--color-teal)';this.style.color='#fff';"
        onmouseout="this.style.background='transparent';this.style.color='var(--color-teal)';"
        >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Ver planta baixa
        </a>
    ` : '';

    overlay.innerHTML = `
        <div class="modal-card" style="
            background:var(--color-white);border-radius:1rem;
            max-width:880px;width:100%;max-height:92vh;
            position:relative;transform:scale(.88);
            transition:transform .3s ease;
            box-shadow:0 24px 64px rgba(0,0,0,.3);
            display:grid;grid-template-columns:1.15fr 1fr;
            overflow:hidden;
        ">
            <!-- Botão fechar -->
            <button class="modal-close-btn" aria-label="Fechar" style="
                position:absolute;top:.8rem;right:.8rem;
                width:32px;height:32px;background:var(--color-white);
                border:none;cursor:pointer;font-size:1.25rem;
                color:var(--color-dark);line-height:1;border-radius:50%;
                z-index:10;box-shadow:0 2px 8px rgba(0,0,0,.18);
                display:flex;align-items:center;justify-content:center;
            ">&times;</button>

            <!-- Esquerdo: mídia -->
            <div style="display:flex;flex-direction:column;min-height:0;">
                <div id="modal-media-wrap" style="position:relative;flex:1;min-height:280px;background:#0B2A40;overflow:hidden;">
                    <img id="modal-photo" src="${project.image}" alt="${project.title}"
                         style="width:100%;height:100%;object-fit:cover;display:block;">
                    <div id="modal-3d-wrap" style="display:none;position:absolute;inset:0;"></div>
                </div>
                ${tabsHTML}
            </div>

            <!-- Direito: info -->
            <div style="padding:1.6rem 1.8rem;display:flex;flex-direction:column;gap:1rem;overflow-y:auto;max-height:92vh;">

                <div>
                    <h3 style="font-size:clamp(17px,2vw,22px);color:var(--color-dark);font-weight:700;margin-bottom:.3rem;line-height:1.2;">${project.title}</h3>
                    ${project.subtitle ? `<p style="font-size:12.5px;color:#7a8f9a;line-height:1.5;">${project.subtitle}</p>` : ''}
                </div>

                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;">
                    ${infoCards}
                </div>

                <div>
                    <p style="font-size:.68rem;font-weight:700;color:var(--color-dark);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.8px;">Sobre o projeto</p>
                    <p style="font-size:clamp(12px,1.2vw,13px);color:#4a5a66;line-height:1.75;">${project.fullDescription}</p>
                </div>

                ${plantaBtn}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.querySelector('.modal-card').style.transform = 'scale(1)';
    });

    /* ── Tabs ── */
    if (has3D) {
        const tabs      = overlay.querySelectorAll('.modal-tab');
        const photo     = overlay.querySelector('#modal-photo');
        const wrap3d    = overlay.querySelector('#modal-3d-wrap');
        let iframeReady = false;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => { t.style.color = '#7a8f9a'; t.style.borderBottom = '2.5px solid transparent'; });
                tab.style.color        = 'var(--color-dark)';
                tab.style.borderBottom = '2.5px solid var(--color-teal)';

                if (tab.dataset.tab === '3d') {
                    photo.style.display  = 'none';
                    wrap3d.style.display = 'block';
                    if (!iframeReady) {
                        wrap3d.innerHTML = `<iframe
                            src="https://sketchfab.com/models/${project.sketchfab}/embed?autostart=1&ui_theme=dark&preload=1"
                            title="${project.title} — Modelo 3D"
                            frameborder="0" allowfullscreen
                            mozallowfullscreen="true" webkitallowfullscreen="true"
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                            style="width:100%;height:100%;border:none;display:block;">
                        </iframe>`;
                        iframeReady = true;
                    }
                } else {
                    photo.style.display  = 'block';
                    wrap3d.style.display = 'none';
                }
            });
        });
    }

    /* ── Fechar ── */
    function closeModal() {
        overlay.style.opacity = '0';
        overlay.querySelector('.modal-card').style.transform = 'scale(.88)';
        setTimeout(() => { document.body.removeChild(overlay); document.body.style.overflow = ''; }, 280);
    }

    overlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
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