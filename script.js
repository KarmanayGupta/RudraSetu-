/* Utility */
const qs = (s, o = document) => o.querySelector(s);
const qsa = (s, o = document) => [...o.querySelectorAll(s)];

/* Year in footer */
document.getElementById('year').textContent = new Date().getFullYear();

/* Particle Background */
(function () {
    const canvas = qs('.particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
    window.addEventListener('resize', resize); resize();
    function make() { particles = []; for (let i = 0; i < 90; i++) { particles.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.6, vx: (Math.random() - 0.5) / 1.4, vy: (Math.random() - 0.5) / 1.4, alpha: 0.05 + Math.random() * 0.2 }); } }
    make();
    function draw() { ctx.clearRect(0, 0, w, h); for (let p of particles) { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; ctx.beginPath(); ctx.fillStyle = 'rgba(14,165,164,' + p.alpha + ')'; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); } requestAnimationFrame(draw); }
    draw();
})();

/* Timeline expand/collapse */
(function () {
    const steps = qsa('.timeline .step');
    steps.forEach(step => {
        step.addEventListener('click', () => toggle(step));
    });
    function toggle(step) {
        const expanded = step.classList.contains('expanded');
        steps.forEach(s => s.classList.remove('expanded'));
        if (!expanded) step.classList.add('expanded');
    }
})();

/* Counters animation */
(function () {
    const counters = qsa('.counter .big');
    const duration = 1400;
    const animated = new WeakSet();
    function animate(el, start, end) {
        const st = performance.now();
        function tick(now) {
            const prog = Math.min((now - st) / duration, 1);
            const eased = 1 - Math.pow(1 - prog, 3);
            el.textContent = Math.floor(start + (end - start) * eased).toLocaleString();
            if (prog < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !animated.has(e.target)) {
                animate(e.target, 0, Number(e.target.dataset.target) || 0);
                animated.add(e.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
})();

/* Modal + Pillar Details */
const modal = qs('#modal'); const panel = qs('#panel');
const PILLAR_DATA = {
    psyconnect: { title: 'PsyConnect', content: `<p><strong>PsyConnect</strong> engages psychology &amp; social work cadets in emotional first aid, therapy and companionship.</p>` },
    teachon: { title: 'TeachOn', content: `<p><strong>TeachOn</strong> mobilizes education and STEM cadets for mentoring, STEM workshops and digital literacy.</p>` },
    legalease: { title: 'LegalEase', content: `<p><strong>LegalEase</strong> equips cadets to run legal literacy drives, help desks and scheme guidance.</p>` },
    sheshield: { title: 'SheShield', content: `<p><strong>SheShield</strong> focuses on female cadets delivering self-defence, safety and health awareness.</p>` },
    rapidrelief: { title: 'RapidRelief', content: `<p><strong>RapidRelief</strong> trains cadets in first aid, BLS, rapid response and environmental drives.</p>` }
};
function openModal(key) {
    if (key === 'download') {
        panel.innerHTML = `<h3>Download Brief</h3><p class="muted">Proposal brief (PDF) — placeholder.</p><div class="btn-row"><button onclick="location.href='#'">Download PDF</button><button class="ghost-btn" onclick='closeModal()'>Close</button></div>`;
        modal.classList.add('show'); return;
    }
    if (key === 'info') {
        panel.innerHTML = `<h3>How it works</h3><p class="muted">RUDRA-SETU matches cadets to community roles, provides training, and ensures transparent monitoring.</p><div class="btn-row"><button onclick='closeModal()'>Close</button></div>`;
        modal.classList.add('show'); return;
    }
    const data = PILLAR_DATA[key]; if (!data) return;
    panel.innerHTML = `<h3>${data.title}</h3>${data.content}<div class="btn-row"><button onclick='closeModal()'>Close</button><button class="ghost-btn" onclick="alert('Request sent for live workshop demo — placeholder')">Request Pilot</button></div>`;
    modal.classList.add('show');
}
function closeModal() { modal.classList.remove('show'); }

/* Contact Form */
(function () {
    /* Section fade/slide-in on scroll */
    const sections = document.querySelectorAll("main section");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(sec => observer.observe(sec));

    /* Contact Form */
    try { if (window.emailjs) emailjs.init('YOUR_USER_ID'); } catch (e) { }
    const form = qs('#contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = qs('#name').value.trim();
            const email = qs('#email').value.trim();
            const message = qs('#message').value.trim();
            if (!name || !email || !message) return alert('Please fill all fields');
            alert('Message sent successfully! (Placeholder — integrate with EmailJS)');
            form.reset();
        });
    }

    /* India Map Integration */
    const mapEl = document.getElementById("indiaMap");
    if (mapEl) {
        // Initialize map centered on India
        var map = L.map('indiaMap').setView([22.9734, 78.6569], 5);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Marker at Jammu (approx coordinates)
        var jammuCoords = [32.7266, 74.8570];
        L.marker(jammuCoords).addTo(map)
            .bindPopup("<b>Pilot Region</b><br>Jammu")
            .openPopup();
    }
})();

