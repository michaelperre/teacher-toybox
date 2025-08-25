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
        top:{ desktop:"Desktop Edition" },
        panel: {
            upgrade: { title: "Go Premium", intro: "Supercharge your classroom by unlocking every interactive tool in the Teacher Toybox!", feature1_title: "Unlock All Tools", feature1_desc: "Get immediate access to every premium tool.", feature2_title: "Webcam & Document Camera", feature2_desc: "Use your webcam for live demonstrations.", feature3_title: "Photo Carousel", feature3_desc: "Create engaging visual stories and slideshows.", feature4_title: "Gamify Lessons", feature4_desc: "Use the Dice Roller and Counters to make learning fun.", feature8_title: "Support Development", feature8_desc: "Help keep the core platform free for all teachers.", priceBig: "$2 per month", priceSmall: "$24 billed annually" }
        }
    },
    es:{ 
        meta:{ title:"Teacher Toybox Móvil | Herramientas interactivas",
               titleShort:"Teacher Toybox Móvil",
               description:"Versión móvil/tableta de la pizarra digital interactiva gratuita con temporizadores, dados y más." },
        top:{ desktop:"Versión de escritorio" },
        panel: {
            upgrade: { title: "Hazte Premium", intro: "¡Potencia tu aula desbloqueando todas las herramientas interactivas de Teacher Toybox!", feature1_title: "Desbloquea Todo", feature1_desc: "Obtén acceso inmediato a todas las herramientas premium.", feature2_title: "Webcam y Cámara de Documentos", feature2_desc: "Usa tu webcam para demostraciones en vivo.", feature3_title: "Carrusel de Fotos", feature3_desc: "Crea historias visuales y presentaciones atractivas.", feature4_title: "Gamifica las Lecciones", feature4_desc: "Usa el Lanzador de Dados y los Contadores para que aprender sea divertido.", feature8_title: "Apoya el Desarrollo", feature8_desc: "Ayuda a mantener la plataforma principal gratuita para todos los profesores.", priceBig: "$2 por mes", priceSmall: "$24 facturados anualmente" }
        }
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
    
    // --- Premium User Simulation ---
    // Set to `true` to simulate a premium user and unlock features
    const isPremiumUser = false;

    // --- Upgrade Panel Logic ---
    const upgradePanel = document.getElementById('upgrade-panel');
    const upgradeBackdrop = document.getElementById('upgrade-backdrop');
    const closeUpgradeBtn = document.getElementById('close-upgrade-btn');

    function showUpgradePanel() {
        document.body.classList.add('no-scroll');
        upgradeBackdrop.classList.add('visible');
        upgradePanel.classList.add('visible');
    }

    function hideUpgradePanel() {
        document.body.classList.remove('no-scroll');
        upgradeBackdrop.classList.remove('visible');
        upgradePanel.classList.remove('visible');
    }

    closeUpgradeBtn.addEventListener('click', hideUpgradePanel);
    upgradeBackdrop.addEventListener('click', hideUpgradePanel);


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

    // --- Tool Implementations ---

    function loadDrawTool() {
        const canvas = document.createElement('canvas');
        canvas.id = 'draw-canvas';
        mainContent.appendChild(canvas);

        const controls = document.createElement('div');
        controls.id = 'draw-controls';
        
        const colors = ['#FFFFFF', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE'];
        colors.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            if (index === 0) swatch.classList.add('active');
            swatch.onclick = () => {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = color;
                controls.querySelector('.active')?.classList.remove('active');
                swatch.classList.add('active');
            };
            controls.appendChild(swatch);
        });

        const sizeInput = document.createElement('input');
        sizeInput.type = 'range';
        sizeInput.min = 1;
        sizeInput.max = 50;
        sizeInput.value = 5;
        sizeInput.oninput = e => { ctx.lineWidth = e.target.value; };
        
        const eraserBtn = document.createElement('button');
        eraserBtn.className = 'tool-btn-draw';
        eraserBtn.innerHTML = '<i class="fas fa-eraser"></i>';
        eraserBtn.onclick = () => {
            ctx.globalCompositeOperation = 'destination-out';
            controls.querySelector('.active')?.classList.remove('active');
            eraserBtn.classList.add('active');
        };

        const undoBtn = document.createElement('button');
        undoBtn.className = 'tool-btn-draw';
        undoBtn.innerHTML = '<i class="fas fa-undo"></i>';
        undoBtn.onclick = () => {
            if (history.length > 0) {
                ctx.putImageData(history.pop(), 0, 0);
            }
        };

        const clearBtn = document.createElement('button');
        clearBtn.className = 'tool-btn-draw';
        clearBtn.innerHTML = '<i class="fas fa-trash"></i>';
        clearBtn.onclick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            history.length = 0;
        };

        controls.append(sizeInput, eraserBtn, undoBtn, clearBtn);
        mainContent.appendChild(controls);

        const ctx = canvas.getContext('2d');
        let drawing = false;
        const history = [];

        function saveState() {
            if (history.length > 20) history.shift();
            history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }

        function resizeCanvas() {
            const oldData = history.length > 0 ? history[history.length - 1] : null;
            const oldCompositeOp = ctx.globalCompositeOperation;
            
            canvas.width = mainContent.clientWidth;
            canvas.height = mainContent.clientHeight;
            
            if (oldData) ctx.putImageData(oldData, 0, 0);

            ctx.globalCompositeOperation = oldCompositeOp;
            ctx.lineCap = 'round';
            const activeColorSwatch = controls.querySelector('.color-swatch.active');
            if (activeColorSwatch) {
                ctx.strokeStyle = activeColorSwatch.style.backgroundColor;
            }
            ctx.lineWidth = sizeInput.value;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches ? e.touches[0] : e;
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        }

        canvas.addEventListener('pointerdown', e => {
            saveState();
            drawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        });
        canvas.addEventListener('pointermove', e => {
            if (drawing) {
                const pos = getPos(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            }
        });
        canvas.addEventListener('pointerup', () => drawing = false);
        canvas.addEventListener('pointerleave', () => drawing = false);
    }

    function loadTimerTool() {
        mainContent.className = 'main-content timer-active';
        const container = document.createElement('div');
        container.className = 'tool-container';
        container.innerHTML = `
            <div class="timer-display">00:00.00</div>
            <div class="tool-controls">
                <button id="startStopBtn" class="tool-btn" style="background-color: var(--success-color);"><i class="fas fa-play"></i></button>
                <button id="resetBtn" class="tool-btn" style="background-color: var(--danger-color);"><i class="fas fa-sync-alt"></i></button>
            </div>
        `;
        mainContent.appendChild(container);

        const display = container.querySelector('.timer-display');
        const startStopBtn = container.querySelector('#startStopBtn');
        const resetBtn = container.querySelector('#resetBtn');
        
        const updateFontSize = (el) => {
            const containerWidth = el.clientWidth;
            const newSize = containerWidth / 4.6;
            display.style.fontSize = `${newSize}px`;
        };

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                updateFontSize(entry.target);
            }
        });
        resizeObserver.observe(container);
        updateFontSize(container);

        let timerInterval = null, elapsedTime = 0, startTime = 0, isRunning = false;

        const formatTime = () => {
            const diff = elapsedTime;
            const minutes = String(Math.floor(diff / 60000)).padStart(2, '0');
            const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
            const milliseconds = String(Math.floor((diff % 1000) / 10)).padStart(2, '0');
            display.textContent = `${minutes}:${seconds}.${milliseconds}`;
        };
        
        startStopBtn.onclick = () => {
            if (isRunning) {
                clearInterval(timerInterval);
                elapsedTime = Date.now() - startTime;
                startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                startTime = Date.now() - elapsedTime;
                timerInterval = setInterval(() => {
                    elapsedTime = Date.now() - startTime;
                    formatTime();
                }, 10);
                startStopBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isRunning = !isRunning;
        };

        resetBtn.onclick = () => {
            clearInterval(timerInterval);
            isRunning = false;
            elapsedTime = 0;
            startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
            formatTime();
        };
    }

    function loadDiceTool() {
        mainContent.className = 'tool-container dice-active';
        mainContent.innerHTML = `
            <div class="die-container" role="group" aria-label="Dice"></div>
            <div class="tool-controls dice-controls">
            <button id="addDieBtn" class="tool-btn" style="background-color: var(--accent-color);" aria-label="Add die"><i class="fas fa-plus"></i></button>
            <button id="removeDieBtn" class="tool-btn" style="background-color: var(--accent-color);" aria-label="Remove die"><i class="fas fa-minus"></i></button>
            <button id="rollBtn" class="tool-btn" style="background-color: var(--success-color);" aria-label="Roll dice"><i class="fas fa-dice-d6"></i></button>
            <button id="shakeBtn" class="tool-btn" style="background-color: var(--bar-bg); border: 1px solid var(--border-color);" aria-label="Enable shake to roll" aria-pressed="false">
                <i class="fas fa-mobile-alt"></i>
            </button>
            <div class="dice-total" aria-live="polite"></div>
            </div>
        `;

        const diceContainer = mainContent.querySelector('.die-container');
        const totalDisplay  = mainContent.querySelector('.dice-total');
        const addBtn        = mainContent.querySelector('#addDieBtn');
        const removeBtn     = mainContent.querySelector('#removeDieBtn');
        const rollBtn       = mainContent.querySelector('#rollBtn');
        const shakeBtn      = mainContent.querySelector('#shakeBtn');

        let numDice = 1;
        const MAX_DICE = 12;

        function createDie(value = 1) {
            const die = document.createElement('div');
            die.className = 'die';
            die.setAttribute('role', 'img');
            die.dataset.value = value;
            for (let i = 1; i <= 9; i++) {
                const dot = document.createElement('div');
                dot.className = `die-dot dot-${i}`;
                die.appendChild(dot);
            }
            return die;
        }

        function secureRandom1to6() {
            if (crypto && crypto.getRandomValues) {
                const buf = new Uint8Array(1);
                while (true) {
                    crypto.getRandomValues(buf);
                    if (buf[0] < 252) return (buf[0] % 6) + 1;
                }
            }
            return Math.floor(Math.random() * 6) + 1;
        }

        function rollDice(animate = true) {
            let total = 0;
            const dice = diceContainer.querySelectorAll('.die');
            dice.forEach(die => {
                const value = secureRandom1to6();
                total += value;
                die.dataset.value = value;
                if (animate) {
                    die.classList.add('rolling');
                    die.addEventListener('animationend', () => die.classList.remove('rolling'), { once: true });
                }
                die.setAttribute('aria-label', `Die shows ${value}`);
            });
            totalDisplay.textContent = `Total: ${total}`;
        }

        function renderDice() {
            diceContainer.innerHTML = '';
            for (let i = 0; i < numDice; i++) diceContainer.appendChild(createDie());
            rollDice(false);
            resizeDice();
        }

        let resizeScheduled = false;
        function resizeDice() {
            if (resizeScheduled) return;
            resizeScheduled = true;
            requestAnimationFrame(() => {
                resizeScheduled = false;
                const cs = getComputedStyle(diceContainer);
                const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
                const padY = (parseFloat(cs.paddingTop)  || 0) + (parseFloat(cs.paddingBottom) || 0);
                const innerW = Math.max(0, diceContainer.clientWidth  - padX);
                const innerH = Math.max(0, diceContainer.clientHeight - padY);
                const n = Math.max(1, numDice);
                const cols = Math.ceil(Math.sqrt(n));
                const rows = Math.ceil(n / cols);
                const gap  = parseFloat(cs.gap || cs.columnGap || 0) || 0;
                const cellW = Math.floor((innerW - gap * (cols - 1)) / cols);
                const cellH = Math.floor((innerH - gap * (rows - 1)) / rows);
                const size  = Math.max(48, Math.min(cellW, cellH));
                diceContainer.querySelectorAll('.die').forEach(d => {
                    d.style.width = d.style.height = size + 'px';
                });
            });
        }

        try {
            const ro = new ResizeObserver(resizeDice);
            ro.observe(diceContainer);
        } catch {
            window.addEventListener('resize', resizeDice);
        }

        let shakeOn = false, lastShakeTime = 0, motionHandler = null;
        const SHAKE_DEBOUNCE_MS = 900, SHAKE_THRESHOLD = 13;

        async function ensureMotionPermission() {
            if (typeof DeviceMotionEvent?.requestPermission === 'function') {
                return await DeviceMotionEvent.requestPermission() === 'granted';
            }
            return true;
        }

        function attachMotion() {
            if (motionHandler) window.removeEventListener('devicemotion', motionHandler);
            let last = { x: 0, y: 0, z: 0 };
            motionHandler = (e) => {
                let ax, ay, az;
                if (e.acceleration) {
                    ({x: ax, y: ay, z: az} = e.acceleration);
                } else {
                    const a = e.accelerationIncludingGravity || {x:0,y:0,z:0};
                    ax = a.x - last.x; ay = a.y - last.y; az = a.z - last.z;
                    last = { x: a.x, y: a.y, z: a.z };
                }
                const mag = Math.sqrt((ax||0)**2 + (ay||0)**2 + (az||0)**2);
                const now = Date.now();
                if (mag > SHAKE_THRESHOLD && now - lastShakeTime > SHAKE_DEBOUNCE_MS) {
                    lastShakeTime = now;
                    rollDice(true);
                }
            };
            window.addEventListener('devicemotion', motionHandler, { passive: true });
        }

        shakeBtn.addEventListener('click', async () => {
            if (!shakeOn) {
                if (!await ensureMotionPermission()) {
                    showOverlay('Motion blocked', false);
                    return;
                }
                attachMotion();
                shakeOn = true;
                shakeBtn.setAttribute('aria-pressed', 'true');
            } else {
                if (motionHandler) window.removeEventListener('devicemotion', motionHandler);
                motionHandler = null;
                shakeOn = false;
                shakeBtn.setAttribute('aria-pressed', 'false');
            }
        });

        addBtn.onclick = () => { if (numDice < MAX_DICE) { numDice++; renderDice(); } };
        removeBtn.onclick = () => { if (numDice > 1) { numDice--; renderDice(); } };
        rollBtn.onclick = () => rollDice(true);
        diceContainer.addEventListener('click', () => rollDice(true));

        renderDice();
    }

    function loadCountdownTool() {
        mainContent.className = 'main-content timer-active';
        const container = document.createElement('div');
        container.className = 'tool-container';
        
        const title = document.createElement('h2');
        title.className = 'countdown-title';
        title.textContent = 'Timer';
        container.appendChild(title);

        const selectionGrid = document.createElement('div');
        selectionGrid.className = 'countdown-selection-grid';
        
        const times = [
            { label: '30 sec', seconds: 30 }, { label: '1 min', seconds: 60 },
            { label: '5 min', seconds: 300 }, { label: '10 min', seconds: 600 },
            { label: '15 min', seconds: 900 }, { label: '20 min', seconds: 1200 },
            { label: '30 min', seconds: 1800 }, { label: '45 min', seconds: 2700 },
            { label: '1 Hour', seconds: 3600 }
        ];

        times.forEach(time => {
            const btn = document.createElement('button');
            btn.className = 'countdown-btn';
            btn.textContent = time.label;
            btn.onclick = () => startCountdown(container, time.seconds);
            selectionGrid.appendChild(btn);
        });

        container.appendChild(selectionGrid);
        mainContent.appendChild(container);
    }

    function startCountdown(container, totalSeconds) {
        container.innerHTML = ''; 

        const wrapper = document.createElement('div');
        wrapper.className = 'countdown-display-wrapper';

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('viewBox', '0 0 100 100');

        const bgCircle = document.createElementNS(svgNS, "circle");
        bgCircle.setAttribute('cx', '50');
        bgCircle.setAttribute('cy', '50');
        bgCircle.setAttribute('r', '45');
        bgCircle.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
        bgCircle.setAttribute('stroke-width', '5');
        bgCircle.setAttribute('fill', 'transparent');

        const fgCircle = document.createElementNS(svgNS, "circle");
        fgCircle.setAttribute('cx', '50');
        fgCircle.setAttribute('cy', '50');
        fgCircle.setAttribute('r', '45');
        fgCircle.setAttribute('stroke', 'var(--accent-color)');
        fgCircle.setAttribute('stroke-width', '5');
        fgCircle.setAttribute('fill', 'transparent');
        fgCircle.style.transformOrigin = 'center';
        fgCircle.style.transform = 'rotate(-90deg)';
        
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        fgCircle.setAttribute('stroke-dasharray', circumference);
        fgCircle.setAttribute('stroke-dashoffset', 0);
        fgCircle.style.transition = 'stroke-dashoffset 1s linear';

        svg.append(bgCircle, fgCircle);
        
        const display = document.createElement('div');
        display.className = 'timer-display countdown-time';

        wrapper.append(svg, display);
        container.appendChild(wrapper);

        const updateFontSize = () => {
            const newSize = wrapper.clientWidth / 4.5;
            display.style.fontSize = `${newSize}px`;
        };
        const resizeObserver = new ResizeObserver(updateFontSize);
        resizeObserver.observe(wrapper);
        updateFontSize();

        let t = totalSeconds;
        const timer = setInterval(() => {
            const progress = t / totalSeconds;
            fgCircle.setAttribute('stroke-dashoffset', circumference * (1 - progress));
            const hours = Math.floor(t / 3600);
            const minutes = Math.floor((t % 3600) / 60);
            const seconds = t % 60;
            if (totalSeconds >= 3600) {
                display.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
            } else if (totalSeconds >= 60) {
                display.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
            } else {
                display.textContent = `${String(seconds).padStart(2,'0')}`;
            }
            t--;

            if (t < 0) {
                clearInterval(timer);
                resizeObserver.disconnect();
                display.textContent = "Done!";
                document.getElementById('bellSound')?.play();
            }
        }, 1000);
    }
    
    function loadForAndAgainstTool() {
        mainContent.className = 'main-content for-against-active';
        mainContent.innerHTML = `<div class="for-against-container"></div>`;
        const forAgainstContainer = mainContent.querySelector('.for-against-container');

        const createPanel = (title, panelClass) => {
            let count = 0;
            const panel = document.createElement('div');
            panel.className = `for-against-panel ${panelClass}`;

            const titleEl = document.createElement('h2');
            titleEl.textContent = title;

            const display = document.createElement('div');
            display.className = 'for-against-display';
            
            const controls = document.createElement('div');
            controls.className = 'for-against-controls';

            const updateDisplay = () => {
                display.textContent = count;
            };

            const minusBtn = document.createElement('button');
            minusBtn.className = 'tool-btn';
            minusBtn.innerHTML = '<i class="fas fa-minus"></i>';
            minusBtn.onclick = (e) => { e.stopPropagation(); if (count > 0) count--; updateDisplay(); };

            const plusBtn = document.createElement('button');
            plusBtn.className = 'tool-btn';
            plusBtn.innerHTML = '<i class="fas fa-plus"></i>';
            plusBtn.onclick = (e) => { e.stopPropagation(); count++; updateDisplay(); };
            
            const resetBtn = document.createElement('button');
            resetBtn.className = 'tool-btn';
            resetBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            resetBtn.onclick = (e) => { e.stopPropagation(); count = 0; updateDisplay(); };

            panel.onclick = () => { count++; updateDisplay(); };

            controls.append(minusBtn, plusBtn, resetBtn);
            panel.append(titleEl, display, controls);
            updateDisplay();
            return panel;
        };

        forAgainstContainer.append(createPanel('For', 'for-panel'), createPanel('Against', 'against-panel'));
    }

    // --- Calculator Tool ---
    function loadCalculatorTool() {
        mainContent.className = 'main-content calculator-active';
        
        mainContent.innerHTML = `
            <div class="calculator-grid">
                <div class="calculator-display">
                    <div id="calc-expression">&nbsp;</div>
                    <div id="calc-input">0</div>
                </div>
                <div class="calculator-buttons"></div>
            </div>
        `;

        const buttonsGrid = mainContent.querySelector('.calculator-buttons');
        const btns = ['sin','cos','tan','log','ln','(',')','√','^','!','7','8','9','÷','AC','4','5','6','×','C','1','2','3','-','=','0','.','π','+'];
        btns.forEach((t) => {
            const label = t.trim();
            const b = document.createElement('button');
            let cls = 'calc-btn ';
            if (label === 'AC') cls += 'ac';
            else if (label === '=') cls += 'equals';
            else if ('+-×÷'.includes(label)) cls += 'operator';
            else if (/[a-z√^!()]|π/i.test(label)) cls += 'function';
            else cls += 'number';
            b.className = cls;
            b.dataset.value = label;
            b.textContent = label;
            if (label === '=') b.style.gridRow = 'span 2';
            buttonsGrid.appendChild(b);
        });

        const expressionDiv = document.getElementById('calc-expression');
        const inputDiv = document.getElementById('calc-input');
        let expression = '';
        let lastResult = '';

        function updateDisplay() {
            expressionDiv.innerHTML = (expression.replace(/\*/g,'×').replace(/\//g,'÷') || '&nbsp;');
            inputDiv.textContent = lastResult || '0';
        }

        function factorial(n){ return (n<=1)?1:n*factorial(n-1); }

        buttonsGrid.addEventListener('click', (e) => {
            const target = e.target.closest('.calc-btn');
            if (!target) return;
            
            const r = document.createElement('span');
            r.className = 'ripple';
            const rect = target.getBoundingClientRect();
            r.style.setProperty('--x', `${(e.clientX - rect.left) / rect.width * 100}%`);
            r.style.setProperty('--y', `${(e.clientY - rect.top) / rect.height * 100}%`);
            target.querySelector('.ripple')?.remove();
            target.appendChild(r);
            setTimeout(() => r.remove(), 480);
            
            const v = target.dataset.value;
            switch(v) {
                case 'AC': expression=''; lastResult=''; break;
                case 'C': expression = expression.slice(0,-1); break;
                case '=':
                    try {
                        let s = expression
                            .replace(/×/g,'*')
                            .replace(/÷/g,'/')
                            .replace(/√/g,'Math.sqrt')
                            .replace(/\^/g,'**')
                            .replace(/\blog\b/g,'Math.log10')
                            .replace(/\bln\b/g,'Math.log')
                            .replace(/\bsin\b/g,'Math.sin')
                            .replace(/\bcos\b/g,'Math.cos')
                            .replace(/\btan\b/g,'Math.tan')
                            .replace(/π/g,'Math.PI')
                            .replace(/(\d+)!/g, (_,n)=>`factorial(${parseInt(n,10)})`);
                        const result = Function('factorial','return '+s)(factorial);
                        lastResult = Number(result.toPrecision(10));
                        expression = String(lastResult);
                    } catch(err){ lastResult='Error'; expression=''; }
                    break;
                default:
                    if (lastResult==='Error'){ lastResult=''; expression=''; }
                    expression += v;
            }
            updateDisplay();
        });
    }

    // --- Numbered List Tool ---
    function loadNumberedListTool() {
        mainContent.className = 'main-content numbered-list-active';
        mainContent.innerHTML = '';
    
        const container = document.createElement('div');
        container.className = 'numbered-list-container';
    
        const title = document.createElement('h2');
        title.className = 'list-title';
        title.contentEditable = true;
        title.textContent = 'The List';
        title.addEventListener('focus', () => { if (title.textContent === 'The List') { title.textContent = ''; } });
        title.addEventListener('blur', () => { if (title.textContent.trim() === '') { title.textContent = 'The List'; } });
    
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'list-table-wrapper';
        const table = document.createElement('table');
        table.className = 'list-table';
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
    
        const controls = document.createElement('div');
        controls.className = 'list-controls';
    
        const addRowBtn = document.createElement('button');
        addRowBtn.className = 'control-btn-large';
        addRowBtn.innerHTML = '<i class="fas fa-plus"></i>';
        addRowBtn.title = 'Add Row';
    
        const removeRowBtn = document.createElement('button');
        removeRowBtn.className = 'control-btn-large';
        removeRowBtn.innerHTML = '<i class="fas fa-minus"></i>';
        removeRowBtn.title = 'Remove Row';
    
        const resetBtn = document.createElement('button');
        resetBtn.className = 'control-btn-large';
        resetBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        resetBtn.title = 'Reset List';
    
        controls.append(addRowBtn, removeRowBtn, resetBtn);
    
        const createRow = () => {
            const row = tbody.insertRow();
            const rowNumber = tbody.rows.length;
    
            const cellNum = row.insertCell();
            cellNum.className = 'col-number';
            cellNum.textContent = rowNumber;
    
            const cellText = row.insertCell();
            cellText.className = 'col-text';
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.placeholder = `Item ${rowNumber}...`;
            cellText.appendChild(textInput);
    
            const cellCounter = row.insertCell();
            cellCounter.className = 'col-counter';
            const minusBtn = document.createElement('button');
            minusBtn.className = 'counter-btn';
            minusBtn.textContent = '-';
            const valueSpan = document.createElement('span');
            valueSpan.className = 'counter-value';
            valueSpan.textContent = '0';
            const plusBtn = document.createElement('button');
            plusBtn.className = 'counter-btn';
            plusBtn.textContent = '+';
    
            plusBtn.onclick = () => { valueSpan.textContent = parseInt(valueSpan.textContent, 10) + 1; };
            minusBtn.onclick = () => {
                let current = parseInt(valueSpan.textContent, 10);
                if (current > 0) { valueSpan.textContent = current - 1; }
            };
            cellCounter.append(minusBtn, valueSpan, plusBtn);
        };
        
        const setupInitialState = () => {
            tbody.innerHTML = '';
            title.textContent = 'The List';
            for (let i = 0; i < 5; i++) createRow();
        };
    
        addRowBtn.onclick = createRow;
        removeRowBtn.onclick = () => { if (tbody.rows.length > 1) tbody.deleteRow(-1); };
        resetBtn.onclick = setupInitialState;
    
        container.append(title, tableWrapper, controls);
        mainContent.appendChild(container);
        setupInitialState();
    }


    // --- Event Listeners for Navigation ---
    navButtons.forEach(button => {
        const tool = button.dataset.tool;
        const isPremiumFeature = button.dataset.premium === 'true';

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
                if (isPremiumFeature && !isPremiumUser) {
                    showUpgradePanel(); // Show panel instead of alert
                    return;
                }
                loadTool(tool);
            });
        }
    });

    // --- Initial Load ---
    loadTool('draw');
});