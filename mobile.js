// --- Splash Screen Helper ---
(function() {
  var armed = false;
  function closeSplash() {
    if (armed) return; armed = true;
    var s = document.getElementById('splash-screen');
    if (!s) return;
    try { s.style.opacity = '0'; } catch(_) {}
    setTimeout(function() { if (s && s.parentNode) s.parentNode.removeChild(s); }, 520);
  }
  function arm() { setTimeout(closeSplash, 1000); }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    arm();
  } else {
    document.addEventListener('DOMContentLoaded', arm, { once: true });
  }
  setTimeout(closeSplash, 3500);
})();

// --- Internationalization (i18n) Logic ---
(function () {
  const SUPPORTED = {
    en:"English", cs:"Čeština", uk:"Українська", zh:"中文（简体）", hi:"हिन्दी",
    es:"Español", fr:"Français", ar:"العربية", fa:"فارسی", pt:"Português", ru:"Русский"
  };
  const I18N = {
    en:{ 
        meta:{ title:"Teacher Toybox Mobile | Interactive Whiteboard Tools",
               titleShort:"Teacher Toybox Mobile",
               description:"Mobile/tablet version of the free interactive digital whiteboard with timers, dice and more." },
        top:{ desktop:"Desktop Edition" }
    },
    es:{ 
        meta:{ title:"Teacher Toybox Móvil | Herramientas interactivas",
               titleShort:"Teacher Toybox Móvil",
               description:"Versión móvil/tableta de la pizarra digital interactiva gratuita con temporizadores, dados y más." },
        top:{ desktop:"Versión de escritorio" }
    }
    // (Add other languages here in the same format)
  };

  function t(dict, path) {
    try { return path.split('.').reduce((o,k)=> o && o[k]!==undefined ? o[k] : undefined, dict); }
    catch { return undefined; }
  }

  function updateMeta(lang) {
    const d = I18N[lang] || I18N.en;
    const title = t(d,'meta.title'), short = t(d,'meta.titleShort') || title, desc = t(d,'meta.description');
    if (title) document.title = title;
    if (desc) {
      const m = document.querySelector('meta[name="description"]'); if (m) m.setAttribute('content', desc);
      const ogd = document.querySelector('meta[property="og:description"]'); if (ogd) ogd.setAttribute('content', desc);
      const twd = document.querySelector('meta[name="twitter:description"]'); if (twd) twd.setAttribute('content', desc);
    }
    if (short) {
      const ogt = document.querySelector('meta[property="og:title"]'); if (ogt) ogt.setAttribute('content', short);
      const twt = document.querySelector('meta[name="twitter:title"]'); if (twt) twt.setAttribute('content', short);
    }
  }

  function regionDefault() {
    const saved = localStorage.getItem('ttx_lang');
    const supported = Object.keys(SUPPORTED);
    if (saved && supported.includes(saved)) return saved;
    const nav = (navigator.language||'en').split('-');
    const base = (nav[0]||'en').toLowerCase();
    const region = (nav[1]||'').toUpperCase();
    const map = {
      'CZ':'cs','UA':'uk',
      'CN':'zh','HK':'zh','MO':'zh','TW':'zh','SG':'zh','MY':'zh',
      'IN':'hi',
      'ES':'es','MX':'es','AR':'es','CL':'es','CO':'es','PE':'es',
      'FR':'fr','BE':'fr','CH':'fr','CA':'fr',
      'AE':'ar','SA':'ar','EG':'ar','MA':'ar','DZ':'ar',
      'IR':'fa',
      'PT':'pt','BR':'pt',
      'RU':'ru','BY':'ru','KZ':'ru',
      'US':'en','GB':'en','AU':'en','NZ':'en','IE':'en','CA':'en'
    };
    if (map[region]) return map[region];
    if (supported.includes(base)) return base;
    return 'en';
  }

  function applyLang(lang) {
    localStorage.setItem('ttx_lang', lang);
    document.documentElement.lang = lang;
    const d = I18N[lang] || I18N.en;
    const desk = document.querySelector('.desktop-btn');
    if (desk) desk.textContent = t(d,'top.desktop') || 'Desktop Edition';
    updateMeta(lang);
    
    // Apply all data-i18n translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const val = t(d, el.dataset.i18n) || t(I18N.en, el.dataset.i18n);
        if (typeof val === 'string') el.textContent = val;
    });
  }

  function init() {
    const def = regionDefault();
    applyLang(def);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();


// --- Main Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navButtons = document.querySelectorAll('.nav-btn');

    // --- Clock and Date ---
    function updateClock() {
        const now = new Date();
        const clockEl = document.getElementById('clock');
        const dateEl = document.getElementById('date');

        if (clockEl) {
            clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (dateEl) {
            const day = now.getDate();
            let suffix = 'th';
            if (day === 1 || day === 21 || day === 31) suffix = 'st';
            else if (day === 2 || day === 22) suffix = 'nd';
            else if (day === 3 || day === 23) suffix = 'rd';
            dateEl.textContent = `${day}${suffix} ${now.toLocaleDateString([], { month: 'long' })}`;
        }
    }
    updateClock();
    setInterval(updateClock, 1000);

    // --- Tool Loading Logic ---
    function loadTool(toolName) {
        mainContent.innerHTML = ''; // Clear previous tool
        mainContent.className = 'main-content'; // Reset classes

        navButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.nav-btn[data-tool="${toolName}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        switch(toolName) {
            case 'draw': loadDrawTool(); break;
            case 'timer': loadTimerTool(); break;
            case 'dice': loadDiceTool(); break;
            case 'countdown': loadCountdownTool(); break;
            case 'calculator': loadCalculatorTool(); break;
            case 'numbered-list': loadNumberedListTool(); break;
            case 'for-against': loadForAndAgainstTool(); break;
        }
    }
    
    // --- Sound Effect Overlay ---
    function showOverlay(content, isIcon = true) {
        const el = document.createElement(isIcon ? 'i' : 'div');
        el.className = 'overlay-icon';
        if (isIcon) el.classList.add('fas', content);
        else el.textContent = content;
        
        mainContent.appendChild(el);
        setTimeout(() => {
            el.style.opacity = 0;
            el.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }, 50);
        setTimeout(() => el.remove(), 1050);
    }

    // --- Tool Implementations (Omitted for brevity, they are unchanged) ---
    function loadDrawTool() { /* ... full function code ... */ }
    function loadTimerTool() { /* ... full function code ... */ }
    function loadDiceTool() { /* ... full function code ... */ }
    function loadCountdownTool() { /* ... full function code ... */ }
    function startCountdown(container, totalSeconds) { /* ... full function code ... */ }
    function loadForAndAgainstTool() { /* ... full function code ... */ }
    function loadCalculatorTool() { /* ... full function code ... */ }
    function loadNumberedListTool() { /* ... full function code ... */ }


    // --- Event Listeners for Navigation ---
    navButtons.forEach(button => {
        const tool = button.dataset.tool;

        if (tool === 'bell' || tool === 'shh') {
            button.addEventListener('click', () => {
                const soundId = tool + 'Sound';
                const sound = document.getElementById(soundId);
                if (sound) {
                    sound.currentTime = 0;
                    sound.play();
                }
                showOverlay(tool === 'bell' ? 'fa-bell' : 'Shh', tool === 'bell');
            });
        } else {
            button.addEventListener('click', () => {
                loadTool(tool);
            });
        }
    });

    // --- Initial Load ---
    loadTool('draw');
});