/* ── 0. Galerias de projeto ───────────────────────────────────────────────
   Fotos extras de cada projeto exibidas no modal (além da capa do card).
   A capa do card entra automaticamente como "Fachada" e a planta é
   adicionada ao final. Para trocar/adicionar fotos, edite este objeto.

   As fotos de cômodos internos (salas, cozinhas, suítes, etc.) foram
   removidas: cada projeto exibe apenas Fachada, Planta Baixa e o modelo 3D.
   ────────────────────────────────────────────────────────────────────── */
const PLANTA_SRC = "assets/images/gallery/planta-modelo.jpg";

const PROJ_GALLERIES = {
    "residencia-moderna": [],
    "residencia-contemporanea": [],
    "condominio-residencial": [],
    "centro-empresarial": [],
    "edificio-comercial-misto": [],
    "shopping-center": [],
    "complexo-industrial": [],
    "galpao-industrial": [],
    "planta-industrial": [],
};

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
            const slug            = card.dataset.project          || '';
            const gallery         = PROJ_GALLERIES[slug]          || [];
 
            openProjectModal({ image, title, description, area, duration, client, sketchfab, subtitle, fullDescription, gallery });
        });
    });
});
 
function openProjectModal(project) {
    const has3D = !!project.sketchfab;

    /* Monta a lista de mídias: capa (Fachada) + fotos extras + planta + (3D) */
    const media = [{ type: 'photo', src: project.image, label: 'Fachada' }];
    (project.gallery || []).forEach(g => media.push({ type: 'photo', src: g.src, label: g.label }));
    media.push({ type: 'planta', src: PLANTA_SRC, label: 'Planta Baixa' });
    if (has3D) media.push({ type: '3d', label: 'Modelo 3D' });

    const photoIdx = [];
    media.forEach((m, i) => { if (m.type === 'photo') photoIdx.push(i); });

    /* Ícones SVG (o tamanho vem do CSS) */
    const cubeIcon   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';
    const photoIcon  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    const plantaIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>';

    /* Cartões de informação (Área / Duração / Cliente) */
    const stat = (label, value, icon) =>
        '<div class="pm-stat"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-teal)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg><span class="lbl">' + label + '</span><span class="val">' + value + '</span></div>';
    const statsHTML =
        stat('Área', project.area, '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>') +
        stat('Duração', project.duration, '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>') +
        stat('Cliente', project.client, '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>');

    /* Miniaturas (fotos + 3D + planta) */
    const thumbsHTML = media.map((m, i) => {
        const inner = (m.type === '3d')
            ? '<span class="pm-thumb-icon">' + cubeIcon + '</span>'
            : '<span class="pm-thumb-img"><img src="' + m.src + '" alt="' + m.label + '" loading="lazy"></span>';
        return '<button class="pm-thumb" type="button" data-i="' + i + '">' + inner + '<span class="pm-thumb-cap">' + m.label + '</span></button>';
    }).join('');

    /* Abas (Fotos / Modelo 3D) */
    const tabsHTML =
        '<button class="pm-tab" type="button" data-mode="fotos">' + photoIcon + ' Fotos</button>' +
        (has3D ? '<button class="pm-tab" type="button" data-mode="3d">' + cubeIcon + ' Modelo 3D</button>' : '');

    const overlay = document.createElement('div');
    overlay.className = 'pm-overlay';
    overlay.innerHTML =
        '<div class="pm-card" role="dialog" aria-modal="true" aria-label="' + project.title + '">' +
            '<button class="pm-close" type="button" aria-label="Fechar">&times;</button>' +
            '<div class="pm-media">' +
                '<div class="pm-stage">' +
                    '<img class="pm-photo" src="' + project.image + '" alt="' + project.title + '">' +
                    '<div class="pm-3d"></div>' +
                    '<button class="pm-arrow pm-prev" type="button" aria-label="Foto anterior">&#8249;</button>' +
                    '<button class="pm-arrow pm-next" type="button" aria-label="Próxima foto">&#8250;</button>' +
                    '<span class="pm-counter"></span>' +
                '</div>' +
                '<div class="pm-tabs">' + tabsHTML + '</div>' +
                '<div class="pm-thumbs">' + thumbsHTML + '</div>' +
            '</div>' +
            '<div class="pm-info">' +
                '<div>' +
                    '<h3 class="pm-title">' + project.title + '</h3>' +
                    (project.subtitle ? '<p class="pm-subtitle">' + project.subtitle + '</p>' : '') +
                '</div>' +
                '<div class="pm-stats">' + statsHTML + '</div>' +
                '<div>' +
                    '<p class="pm-about-h">Sobre o projeto</p>' +
                    '<p class="pm-about-t">' + project.fullDescription + '</p>' +
                '</div>' +
                '<button class="pm-planta-btn" type="button">' + plantaIcon + ' Ver planta baixa</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlay.classList.add('open'));

    /* Referências aos elementos */
    const photoEl = overlay.querySelector('.pm-photo');
    const wrap3d  = overlay.querySelector('.pm-3d');
    const prevBtn = overlay.querySelector('.pm-prev');
    const nextBtn = overlay.querySelector('.pm-next');
    const counter = overlay.querySelector('.pm-counter');
    const tabs    = Array.prototype.slice.call(overlay.querySelectorAll('.pm-tab'));
    const thumbs  = Array.prototype.slice.call(overlay.querySelectorAll('.pm-thumb'));
    let current = 0;
    let iframeLoaded = false;

    function ensureIframe() {
        if (iframeLoaded) return;
        wrap3d.innerHTML = '<iframe src="https://sketchfab.com/models/' + project.sketchfab +
            '/embed?autostart=1&ui_theme=dark&preload=1" title="' + project.title +
            ' — Modelo 3D" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking"></iframe>';
        iframeLoaded = true;
    }

    function render() {
        const item = media[current];
        const is3D = item.type === '3d';
        const isPhoto = item.type === 'photo';

        if (is3D) {
            ensureIframe();
            wrap3d.style.display = 'block';
        } else {
            wrap3d.style.display = 'none';
            photoEl.src = item.src;
            photoEl.alt = item.label;
        }

        prevBtn.style.display = nextBtn.style.display = isPhoto ? 'flex' : 'none';
        if (isPhoto) {
            counter.style.display = 'block';
            counter.textContent = (photoIdx.indexOf(current) + 1) + ' / ' + photoIdx.length;
        } else {
            counter.style.display = 'none';
        }

        tabs.forEach(t => t.classList.toggle('active', (t.dataset.mode === '3d') ? is3D : !is3D));
        thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
    }

    function go(delta) {
        const pos = photoIdx.indexOf(current);
        const base = pos === -1 ? 0 : pos;
        current = photoIdx[(base + delta + photoIdx.length) % photoIdx.length];
        render();
    }

    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));
    thumbs.forEach(t => t.addEventListener('click', () => { current = parseInt(t.dataset.i, 10); render(); }));
    tabs.forEach(t => t.addEventListener('click', () => {
        if (t.dataset.mode === '3d') {
            const i = media.findIndex(m => m.type === '3d');
            if (i >= 0) current = i;
        } else {
            current = photoIdx[0];
        }
        render();
    }));
    overlay.querySelector('.pm-planta-btn').addEventListener('click', () => {
        const i = media.findIndex(m => m.type === 'planta');
        if (i >= 0) { current = i; render(); }
    });

    render();

    /* Fechar */
    function closeModal() {
        overlay.classList.remove('open');
        document.removeEventListener('keydown', onKey);
        setTimeout(() => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            document.body.style.overflow = '';
        }, 280);
    }
    function onKey(e) {
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'ArrowLeft'  && media[current].type === 'photo') go(-1);
        else if (e.key === 'ArrowRight' && media[current].type === 'photo') go(1);
    }
    overlay.querySelector('.pm-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', onKey);
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