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
    bg: '#0a0a06', bg2: '#0f0e08', bg3: '#14120a',
    accent: '#fc4903', accent2: '#005426',
    accentGlow: 'rgba(252,73,3,0.18)',
    text: '#f0e8d8', textMuted: '#5a4a30',
    border: 'rgba(252,73,3,0.14)'
  },
  whisper: {
    bg: '#07080f', bg2: '#0e0f1a', bg3: '#131524',
    accent: '#c8d8f0', accent2: '#9ab8e8',
    accentGlow: 'rgba(180,210,240,0.15)',
    text: '#e8f0f8', textMuted: '#3a4a6a',
    border: 'rgba(180,210,240,0.12)'
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
  remembering_this: {
    bg: '#020a14', bg2: '#061220', bg3: '#0a1a2e',
    accent: '#6bb8e0', accent2: '#3a9fd4',
    accentGlow: 'rgba(107,184,224,0.14)',
    text: '#d0e8f8', textMuted: '#2a5070',
    border: 'rgba(107,184,224,0.10)'
  },
  grey: {
    bg: '#08080a', bg2: '#111114', bg3: '#1a1a1e',
    accent: '#a0a0b0', accent2: '#787890',
    accentGlow: 'rgba(160,160,176,0.12)',
    text: '#d0d0d8', textMuted: '#484858',
    border: 'rgba(160,160,176,0.10)'
  },
  introvert: {
    bg: '#04040e', bg2: '#0a0a1c', bg3: '#10102a',
    accent: '#7080c0', accent2: '#5060a8',
    accentGlow: 'rgba(112,128,192,0.14)',
    text: '#c8d0e8', textMuted: '#3a4068',
    border: 'rgba(112,128,192,0.10)'
  },
  johl_i: {
    bg: '#020208', bg2: '#060612', bg3: '#0a0a1c',
    accent: '#4a6ea0', accent2: '#2e5088',
    accentGlow: 'rgba(74,110,160,0.14)',
    text: '#b0c0d8', textMuted: '#2a3858',
    border: 'rgba(74,110,160,0.10)'
  },
  deep: {
    bg: '#010108', bg2: '#03030e', bg3: '#060616',
    accent: '#305080', accent2: '#1e3868',
    accentGlow: 'rgba(48,80,128,0.12)',
    text: '#8098b8', textMuted: '#1e2840',
    border: 'rgba(48,80,128,0.08)'
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
  const name         = document.getElementById('hero-name');
  const eyebrow      = document.querySelector('.hero-eyebrow');
  const manifestoWrap = document.querySelector('.manifesto-wrap');
  const actions      = document.querySelector('.hero-actions');
  const hint         = document.querySelector('.scroll-hint');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(name, {
    duration: 1.6,
    scrambleText: { text: 'LOIC JOHL', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#', speed: 0.5, revealDelay: 0.3 },
    ease: 'power2.inOut'
  }, 0.2);

  tl.from(name, { y: 60, duration: 1.4, ease: 'power4.out' }, 0.2);

  tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8 }, 0.9)
    .from(eyebrow, { y: 12 }, '<');

  tl.to(manifestoWrap, { opacity: 0.85, y: 0, duration: 1 }, 1.1)
    .from(manifestoWrap, { y: 20 }, '<');

  tl.to(actions, { opacity: 1, duration: 0.7 }, 1.6)
    .from(actions, { y: 16 }, '<');

  tl.to(hint, { opacity: 1, duration: 0.6 }, 2);
})();

// ── Featured cards entrance ──────────────────
(function initFeatured() {
  const cards = document.querySelectorAll('.featured-card');
  cards.forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true
      }
    });
  });
})();

// ── Creations: reveal + theme shift ───────────
(function initCreations() {
  const items = document.querySelectorAll('.creation');

  items.forEach(item => {
    const info  = item.querySelector('.creation-info');
    const art   = item.querySelector('.creation-art');
    const theme = item.dataset.theme;

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

    ScrollTrigger.create({
      trigger: item,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter:      () => applyTheme(theme),
      onEnterBack:  () => applyTheme(theme),
      onLeaveBack:  () => {
        // find previous creation's theme or default
        const prev = item.previousElementSibling;
        if (prev && prev.classList.contains('creation')) {
          applyTheme(prev.dataset.theme);
        } else {
          applyTheme('default');
        }
      },
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
    requestAnimationFrame(() => modal.classList.add('open'));
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
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
})();

// ── Audio preview system ──────────────────────
(function initAudioPreview() {
  const bar      = document.getElementById('audio-bar');
  const barTitle = document.getElementById('audio-bar-title');
  const barFill  = document.getElementById('audio-bar-fill');
  const barClose = document.getElementById('audio-bar-close');
  let audio      = null;
  let currentBtn = null;
  let rafId      = null;

  function getTrackName(btn) {
    // For EP tracks, get track name
    const epTrack = btn.closest('.ep-track');
    if (epTrack) {
      const name = epTrack.querySelector('.ep-track-name');
      return name ? name.textContent : 'Preview';
    }
    // For regular creations, get title
    const creation = btn.closest('.creation');
    if (creation) {
      const title = creation.querySelector('.creation-title');
      return title ? title.textContent : 'Preview';
    }
    return 'Preview';
  }

  function updateProgress() {
    if (audio && audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      barFill.style.width = pct + '%';
    }
    rafId = requestAnimationFrame(updateProgress);
  }

  function stopPlayback() {
    if (audio) {
      audio.pause();
      audio.src = '';
      audio = null;
    }
    if (rafId) cancelAnimationFrame(rafId);
    if (currentBtn) {
      currentBtn.classList.remove('playing');
      currentBtn = null;
    }
    bar.classList.remove('visible');
    barFill.style.width = '0%';
  }

  function play(btn) {
    const src = btn.dataset.audio || btn.closest('[data-audio]')?.dataset.audio;
    if (!src) return;

    // If same button, toggle off
    if (currentBtn === btn && audio && !audio.paused) {
      stopPlayback();
      return;
    }

    stopPlayback();

    audio = new Audio(src);
    currentBtn = btn;
    btn.classList.add('playing');

    barTitle.textContent = getTrackName(btn);
    bar.hidden = false;
    requestAnimationFrame(() => bar.classList.add('visible'));

    audio.play().catch(() => stopPlayback());
    rafId = requestAnimationFrame(updateProgress);

    audio.addEventListener('ended', stopPlayback);
  }

  // Cover preview buttons
  document.querySelectorAll('.preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      play(btn);
    });
  });

  // EP track preview buttons
  document.querySelectorAll('.ep-preview-btn').forEach(btn => {
    const track = btn.closest('.ep-track');
    if (track) {
      btn.dataset.audio = track.dataset.audio;
    }
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      play(btn);
    });
  });

  barClose.addEventListener('click', stopPlayback);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && audio) stopPlayback();
  });
})();

// ── Manifesto EN/FR toggle ────────────────────
(function initManifestoToggle() {
  const toggle = document.getElementById('manifesto-toggle');
  const enText = document.getElementById('manifesto-en');
  const frText = document.getElementById('manifesto-fr');
  if (!toggle || !enText || !frText) return;

  let isEn = true;

  toggle.addEventListener('click', () => {
    isEn = !isEn;
    enText.hidden = !isEn;
    frText.hidden = isEn;

    const spans = toggle.querySelectorAll('span');
    if (isEn) {
      spans[0].className = 'lang-active';
      spans[1].className = 'lang-inactive';
      toggle.setAttribute('aria-label', 'Traduire en français');
    } else {
      spans[0].className = 'lang-inactive';
      spans[1].className = 'lang-active';
      toggle.setAttribute('aria-label', 'Translate to English');
    }
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
