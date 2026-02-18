/* ═══════════════════════════════════════════════
   LOIC JOHL — app.js
   Requires: GSAP, ScrollTrigger, SplitText, ScrambleTextPlugin
═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

// ── Scroll restoration ─────────────────────────
try { history.scrollRestoration = "manual"; } catch(_) {}
window.scrollTo(0, 0);

// ── Colour themes per creation ─────────────────
const THEMES = {
  default: {
    bg: '#000315', bg2: '#000820', bg3: '#010c28',
    accent: '#bdf2ff', accent2: '#5be0ff',
    accentGlow: 'rgba(93,224,255,0.18)',
    text: '#daeeff', textMuted: '#2e4d66',
    border: 'rgba(93,224,255,0.12)'
  },
  melancholia: {
    bg: '#07051a', bg2: '#100c2e', bg3: '#18113f',
    accent: '#c084fc', accent2: '#a855f7',
    accentGlow: 'rgba(168,85,247,0.18)',
    text: '#ede0ff', textMuted: '#5b3d80',
    border: 'rgba(168,85,247,0.14)'
  },
  eternally: {
    bg: '#0c0800', bg2: '#1a1000', bg3: '#251600',
    accent: '#fbbf24', accent2: '#f59e0b',
    accentGlow: 'rgba(251,191,36,0.16)',
    text: '#fff8e0', textMuted: '#7a6030',
    border: 'rgba(251,191,36,0.14)'
  },
  whisper: {
    bg: '#07080f', bg2: '#0e0f1a', bg3: '#131524',
    accent: '#c8d8f0', accent2: '#9ab8e8',
    accentGlow: 'rgba(180,210,240,0.15)',
    text: '#e8f0f8', textMuted: '#3a4a6a',
    border: 'rgba(180,210,240,0.12)'
  }
};

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0,2), 16),
    parseInt(clean.slice(2,4), 16),
    parseInt(clean.slice(4,6), 16)
  ];
}
function rgbToHex(r, g, b) {
  return '#' + [r,g,b].map(v => Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
}
function lerpColor(a, b, t) {
  const [r1,g1,b1] = hexToRgb(a), [r2,g2,b2] = hexToRgb(b);
  return rgbToHex(r1+(r2-r1)*t, g1+(g2-g1)*t, b1+(b2-b1)*t);
}

let currentTheme = 'default';
let themeProxy = { t: 0 };
let themeTween = null;

function applyTheme(name) {
  if (name === currentTheme) return;
  const from = THEMES[currentTheme];
  const to   = THEMES[name] || THEMES.default;
  currentTheme = name;
  if (themeTween) themeTween.kill();
  themeProxy.t = 0;
  const root = document.documentElement;
  themeTween = gsap.to(themeProxy, {
    t: 1,
    duration: 1.1,
    ease: 'power2.inOut',
    onUpdate() {
      const p = themeProxy.t;
      root.style.setProperty('--bg',          lerpColor(from.bg,        to.bg,        p));
      root.style.setProperty('--bg2',         lerpColor(from.bg2,       to.bg2,       p));
      root.style.setProperty('--bg3',         lerpColor(from.bg3,       to.bg3,       p));
      root.style.setProperty('--accent',      lerpColor(from.accent,    to.accent,    p));
      root.style.setProperty('--accent2',     lerpColor(from.accent2,   to.accent2,   p));
      root.style.setProperty('--text',        lerpColor(from.text,      to.text,      p));
      root.style.setProperty('--text-muted',  lerpColor(from.textMuted, to.textMuted, p));
    }
  });
}

// ── Grain overlay ──────────────────────────────
(function initGrain() {
  const canvas = document.getElementById('grain');
  const ctx    = canvas.getContext('2d');
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function tick() {
    const w = canvas.width, h = canvas.height;
    const img = ctx.createImageData(w, h);
    const buf = new Uint32Array(img.data.buffer);
    for (let i = 0; i < buf.length; i++) {
      buf[i] = Math.random() < 0.5 ? 0xffffffff : 0x00000000;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(tick);
  }
  resize();
  window.addEventListener('resize', resize);
  tick();
})();

// ── Hero waveform ──────────────────────────────
(function initWaveform() {
  const canvas = document.getElementById('waveform');
  const ctx    = canvas.getContext('2d');
  let t = 0;

  function resize() {
    canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function draw() {
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    // draw 3 stacked sine waves with different frequencies and phases
    const waves = [
      { amp: 38, freq: 0.006, phase: 0,    alpha: 0.18, width: 1.5 },
      { amp: 20, freq: 0.012, phase: 1.4,  alpha: 0.10, width: 1 },
      { amp: 12, freq: 0.020, phase: 2.8,  alpha: 0.07, width: 0.7 }
    ];

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#bdf2ff';

    waves.forEach(w => {
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        const envelope = Math.sin((x / W) * Math.PI);
        const y = H / 2 + Math.sin(x * w.freq + t + w.phase) * w.amp * envelope;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = accent;
      ctx.globalAlpha = w.alpha;
      ctx.lineWidth   = w.width;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    t += 0.018;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();

// ── Nav: show on scroll ────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 'top -80',
    onToggle: self => nav.classList.toggle('visible', self.isActive)
  });
})();

// ── Hero animations ────────────────────────────
(function initHero() {
  const name    = document.getElementById('hero-name');
  const eyebrow = document.querySelector('.hero-eyebrow');
  const actions = document.querySelector('.hero-actions');
  const hint    = document.querySelector('.scroll-hint');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Scramble the name in
  tl.to(name, {
    duration: 1.6,
    scrambleText: { text: 'LOIC JOHL', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#', speed: 0.5, revealDelay: 0.3 },
    ease: 'power2.inOut'
  }, 0.2);

  tl.from(name, { y: 60, duration: 1.4, ease: 'power4.out' }, 0.2);

  tl.to(eyebrow, { opacity: 0.65, y: 0, duration: 0.8 }, 0.9)
    .from(eyebrow, { y: 12 }, '<');

  tl.to(actions, { opacity: 1, duration: 0.7 }, 1.2)
    .from(actions, { y: 16 }, '<');

  tl.to(hint, { opacity: 1, duration: 0.6 }, 1.6);
})();

// ── Creations: reveal + theme shift ───────────
(function initCreations() {
  const items = document.querySelectorAll('.creation');

  items.forEach(item => {
    const info  = item.querySelector('.creation-info');
    const art   = item.querySelector('.creation-art');
    const theme = item.dataset.theme;

    // reveal on scroll
    gsap.to(info, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 70%',
        once: true
      }
    });

    gsap.from(art, {
      opacity: 0,
      scale: 1.04,
      duration: 1.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 75%',
        once: true
      }
    });

    // colour theme shift when creation fills viewport
    ScrollTrigger.create({
      trigger: item,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter:      () => applyTheme(theme),
      onEnterBack:  () => applyTheme(theme),
      onLeaveBack:  () => applyTheme('default'),
    });
  });

  // reset to default after last creation
  const last = items[items.length - 1];
  if (last) {
    ScrollTrigger.create({
      trigger: last,
      start: 'bottom 40%',
      onLeave: () => applyTheme('default')
    });
  }
})();

// ── Section title glitch on scroll-enter ──────
(function initSectionTitles() {
  document.querySelectorAll('.section-title').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });
})();

// ── About: word-by-word bio reveal ─────────────
(function initAbout() {
  const bio = document.getElementById('about-bio');
  if (!bio) return;

  const split = new SplitText(bio, { type: 'words' });
  gsap.set(split.words, { opacity: 0, y: 14 });

  gsap.to(split.words, {
    opacity: 1,
    y: 0,
    stagger: 0.03,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: bio,
      start: 'top 78%',
      once: true
    }
  });

  // parallax on about images
  gsap.to('.img1', {
    yPercent: -12,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2
    }
  });

  gsap.to('.img2', {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.8
    }
  });
})();

// ── Live Events: poster entrance ──────────────
(function initLive() {
  const poster = document.querySelector('.poster');
  if (!poster) return;
  gsap.from(poster, {
    opacity: 0,
    scale: 0.96,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: poster, start: 'top 75%', once: true }
  });
})();

// ── Contact: terminal email glitch ─────────────
(function initContact() {
  const el = document.getElementById('contact-email');
  if (!el) return;

  el.addEventListener('mouseenter', () => {
    const addr = el.querySelector('.email-addr');
    gsap.to(addr, {
      duration: 0.5,
      scrambleText: {
        text: 'loicjohl27@gmail.com',
        chars: '!@#$%^&*ABCDEFGabcdefg0123456789',
        speed: 1.2
      }
    });
  });
})();

// ── YouTube modal ──────────────────────────────
(function initModal() {
  const modal  = document.getElementById('video-modal');
  const iframe = document.getElementById('modal-iframe');
  const close  = document.getElementById('modal-close');

  function openModal(videoId) {
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      modal.classList.add('open');
    });
  }

  function closeModal() {
    modal.classList.remove('open');
    setTimeout(() => {
      modal.hidden = true;
      iframe.src = '';
      document.body.style.overflow = '';
    }, 400);
  }

  document.querySelectorAll('.watch-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.video));
  });

  close.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();

// ── Mobile hamburger nav ───────────────────────
(function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) closeMenu();
  });
})();

// ── Reduced motion ─────────────────────────────
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  ScrollTrigger.getAll().forEach(st => st.kill());
  gsap.globalTimeline.clear();
  document.querySelectorAll('.creation-info').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

// ── Refresh on load ────────────────────────────
window.addEventListener('load', () => ScrollTrigger.refresh());
