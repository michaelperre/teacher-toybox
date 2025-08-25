<<<<<<< HEAD
/**
 * script.js
 * © 2025 TeacherToybox.com. All Rights Reserved.
 */

// Core bootstrap & shared state
const global = window;
global.TT = global.TT || {};
global.TT.isPremium = false; // Add premium status to global state

// --- Date Display & Localization ---
// This function is now defined in the global scope to prevent race conditions.
// It will be available immediately when the script is loaded.
global.TT.updateDateDisplay = function(lang) {
    // It finds the 'date-display' element by its ID directly.
    const dateDisplay = document.getElementById('date-display');
    if (!dateDisplay) return;
    
    const today = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    // Use the modern Intl.DateTimeFormat for robust, automatic localization.
    const formatter = new Intl.DateTimeFormat(lang, options);
    dateDisplay.textContent = formatter.format(today);
};


document.addEventListener('DOMContentLoaded', () => {
    // --- Splash Screen ---
    const _splash = document.getElementById('splash-screen');
    if (_splash) {
        setTimeout(() => {
            _splash.style.opacity = '0';
            setTimeout(() => _splash.remove(), 500); // match CSS transition
        }, 1000); // show for 1 second
    }
    // --- End Splash Screen ---

    const $ = id => document.getElementById(id);

    // *** Premium Modal Logic for tool usage ***
    const upgradePanel = $('upgrade-panel');
    const upgradeBackdrop = $('upgrade-backdrop');
    const closeUpgradeBtn = $('close-upgrade-btn');
    const panelUpgradeBtn = $('panel-upgrade-btn');

    const openUpgradePanel = () => {
        if (upgradeBackdrop && upgradePanel) {
            upgradeBackdrop.classList.remove('hidden');
            upgradePanel.classList.add('open');
        }
    };

    const closeUpgradePanel = () => {
        if (upgradeBackdrop && upgradePanel) {
            upgradeBackdrop.classList.add('hidden');
            upgradePanel.classList.remove('open');
        }
    };

    // --- NEW: Reusable function to start the checkout process ---
    const initiateCheckout = async () => {
      // This function assumes the user is authenticated.
      try {
        const user = await auth0Client.getUser();
        if (!user) {
          throw new Error("User not found after authentication.");
        }
        // IMPORTANT: Replace with your Stripe PUBLISHABLE Key
        const stripe = Stripe('pk_live_51RyVoHFCA6YfGQJzhJ8SlyEuCayZQXmmbpI0AGeJoLGsNIxz1W8qICgjAqrjkJdSnStHH9U9XvFW49x0PnX2Gxyg000uNaxUaF'); // UPDATED KEY
        const priceId = 'price_1RyXtBFCA6YfGQJz7BUMxTQo'; // UPDATED KEY

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.sub, priceId: priceId }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session.');
        }

        const { sessionId } = await response.json();
        await stripe.redirectToCheckout({ sessionId });
      } catch (error) {
        console.error("Error redirecting to checkout:", error);
        alert("Could not connect to the payment service. Please try again later.");
      }
    };
    // --- END of new function ---

    if (closeUpgradeBtn) closeUpgradeBtn.onclick = closeUpgradePanel;
    if (upgradeBackdrop) upgradeBackdrop.onclick = closeUpgradePanel;

    if (panelUpgradeBtn) {
        panelUpgradeBtn.onclick = async () => {
            if (!await auth0Client.isAuthenticated()) {
                login('upgrade'); // Redirects to login with upgrade intent
                return;
            }
            // If already logged in, go straight to checkout
            initiateCheckout();
        };
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('light-mode', themeToggle.checked);
            localStorage.setItem('ttx_theme', themeToggle.checked ? 'light' : 'dark');
        });
    }

    const getSidebarWidth = () => $('sidebar').offsetWidth;

    let lastWindowWidth = window.innerWidth;
    let lastWindowHeight = window.innerHeight;

    // --- New Clock Feature ---
    const clockButton = $('clockButton');
    const digitalClockBar = $('digital-clock-bar');
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');

    function setClocks() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        // Update Analog Clock
        const secondsDeg = (seconds / 60) * 360;
        const minutesDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
        const hoursDeg = (hours / 12) * 360 + (minutes / 60) * 30;
        
        if (hourHand && minuteHand && secondHand) {
            // Add a check to prevent initial flicker from 359deg to 0deg
            if (secondsDeg < 1) { 
                secondHand.style.transition = 'none';
            } else {
                secondHand.style.transition = '';
            }

            secondHand.style.transform = `rotate(${secondsDeg}deg)`;
            minuteHand.style.transform = `rotate(${minutesDeg}deg)`;
            hourHand.style.transform = `rotate(${hoursDeg}deg)`;
        }

        // Update Digital Clock
        if (digitalClockBar) {
            const digitalHours = String(hours).padStart(2, '0');
            const digitalMinutes = String(minutes).padStart(2, '0');
            const digitalSeconds = String(seconds).padStart(2, '0');
            digitalClockBar.textContent = `${digitalHours}:${digitalMinutes}:${digitalSeconds}`;
        }
    }

    if (clockButton) {
        clockButton.addEventListener('click', () => {
            clockButton.classList.toggle('active');
            digitalClockBar.classList.toggle('open');
        });

        if (digitalClockBar) {
            digitalClockBar.addEventListener('mouseenter', () => {
                clockButton.classList.remove('active');
                digitalClockBar.classList.remove('open');
            });
        }
        
        // Set initial state and start interval
        setClocks();
        setInterval(setClocks, 1000);
    }
    // --- End New Clock Feature ---


    // The date text is now handled by the global TT.updateDateDisplay function.
    // This block only sets up the click-to-enlarge functionality.
    const dateDisplay = $('date-display');
    if (dateDisplay) {
      const closeEnlargedDate = () => {
        const backdrop = document.querySelector('.date-backdrop');
        if (dateDisplay.classList.contains('date-enlarged')) {
          dateDisplay.classList.remove('date-enlarged');
        }
        if (backdrop) {
          backdrop.style.opacity = '0';
          setTimeout(() => backdrop.remove(), 400); // Match CSS transition time
        }
      };
    
      const openEnlargedDate = () => {
        if (!dateDisplay.classList.contains('date-enlarged')) {
          dateDisplay.classList.add('date-enlarged');
          const backdrop = document.createElement('div');
          backdrop.className = 'date-backdrop';
          
          backdrop.addEventListener('click', closeEnlargedDate);
          
          document.body.appendChild(backdrop);
          setTimeout(() => backdrop.style.opacity = '1', 10);
        }
      };
    
      dateDisplay.addEventListener('click', () => {
        if (dateDisplay.classList.contains('date-enlarged')) {
          closeEnlargedDate();
        } else {
          openEnlargedDate();
        }
      });
    }
    
    const toolStyles = `
        /* Dice Roller Styles */
        .die-container { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; align-items: center; flex-grow: 1; padding: 10px; }
        .die { width: 10rem; height: 10rem; background-color: white; border-radius: 8px; padding: 6px; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 4px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); border: 2px solid black; }
        .die .die-dot { visibility: hidden; width: 100%; height: 100%; background-color: black; border-radius: 50%; }
        .die[data-value="1"] .dot-5,
        .die[data-value="2"] .dot-1, .die[data-value="2"] .dot-9,
        .die[data-value="3"] .dot-1, .die[data-value="3"] .dot-5, .die[data-value="3"] .dot-9,
        .die[data-value="4"] .dot-1, .die[data-value="4"] .dot-3, .die[data-value="4"] .dot-7, .die[data-value="4"] .dot-9,
        .die[data-value="5"] .dot-1, .die[data-value="5"] .dot-3, .die[data-value="5"] .dot-5, .die[data-value="5"] .dot-7, .die[data-value="5"] .dot-9,
        .die[data-value="6"] .dot-1, .die[data-value="6"] .dot-3, .die[data-value="6"] .dot-4, .die[data-value="6"] .dot-6, .die[data-value="6"] .dot-7, .die[data-value="6"] .dot-9 { visibility: visible; }
        .dice-controls { display: flex; justify-content: center; align-items: center; gap: 12px; padding: 12px; background: rgba(0,0,0,0.2); flex-shrink: 0; }
        .dice-controls .icon-btn { width: 40px; height: 40px; font-size: 16px; }
        .dice-total { font-size: 18px; font-weight: bold; color: white; min-width: 80px; text-align: center; }
        .die.rolling { animation: roll 0.5s ease-in-out; }
        @keyframes roll { 0% { transform: rotate(0deg) scale(1); } 25% { transform: rotate(15deg) scale(1.1); } 75% { transform: rotate(-15deg) scale(1.1); } 100% { transform: rotate(0deg) scale(1); } }

        /* Stopwatch Styles */
        .stopwatch-display { font-size: clamp(3rem, 14vw, 10rem); font-weight: 700; color: white; text-align: center; flex-grow: 1; display: flex; justify-content: center; align-items: center; font-family: 'monospace'; }
        .stopwatch-controls { display: flex; justify-content: center; align-items: center; gap: 12px; padding: 12px; background: rgba(0,0,0,0.2); flex-shrink: 0; }
        .stopwatch-controls .icon-btn { width: 50px; height: 50px; font-size: 20px; }

        /* Countdown Timer Styles */
        .countdown-title { color: var(--text-secondary); font-size: 1.5rem; font-weight: 500; text-align: center; margin-bottom: 1rem; }
        .countdown-selection-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; width: 100%; max-width: 500px; }
        .countdown-btn { background-color: var(--sidebar-bg); border: 1px solid var(--border-color); color: var(--text-primary); padding: 20px 10px; border-radius: 8px; font-size: 1.1rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease; }
        .countdown-btn:hover { background-color: var(--window-bg); border-color: var(--accent-color); }
        .countdown-running-controls { display: flex; justify-content: center; align-items: center; gap: 12px; padding: 12px; flex-shrink: 0; }
        .countdown-running-controls .icon-btn { width: 50px; height: 50px; font-size: 20px; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = toolStyles;
    document.head.appendChild(styleSheet);

    let hotkeysEnabled = true;
    let layoutState = { activeLayout: null, isVisible: true };
    const gridSizePx = 20;
    const defaultAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

    let dragCounter = 0;
    window.addEventListener('dragenter', (e) => {
        if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            dragCounter++;
            document.body.classList.add('is-dragging');
        }
    });
    window.addEventListener('dragleave', (e) => {
        if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            dragCounter--;
            if (dragCounter === 0) {
                document.body.classList.remove('is-dragging');
            }
        }
    });
    window.addEventListener('drop', (e) => {
        e.preventDefault();
        dragCounter = 0;
        document.body.classList.remove('is-dragging');
    });

    function closeInfoIfOpen() {
        if (layoutState.activeLayout === 'info') {
            clearWins();
            layoutState.activeLayout = null;
            return true;
        }
        return false;
    }

    function showOverlay(txt) {
        const ov = document.createElement('div');
        ov.className = 'overlay-number';
        ov.textContent = txt;
        document.body.appendChild(ov);
        setTimeout(() => { ov.style.opacity = 0; ov.style.transform = 'translate(-50%, -50%) scale(1.5)'; }, 10);
        setTimeout(() => ov.remove(), 2000);
    }

    function clearWins() {
        document.querySelectorAll('.floating').forEach(w => {
            cleanupWindowTools(w);
            w.remove();
        });
    }

    function setActiveWindow(win) {
        document.querySelectorAll('.floating.active-window').forEach(aw => {
            aw.classList.remove('active-window');
            aw.style.zIndex = 1000;
        });
        if (win) {
            win.classList.add('active-window');
            win.style.zIndex = 1001;
        }
    }

    function cleanupWindowTools(win) {
        if (!win) return;
        const drawControls = win.querySelector('.draw-controls-bar');
        if (drawControls) {
            drawControls.remove();
        }
        const leftControls = win.querySelector('.drag-bar .tool-controls');
        if (leftControls) {
            leftControls.style.display = 'flex';
        }
        win.removeAttribute('data-tool');
        
        if (win.activeInterval) {
            clearInterval(win.activeInterval);
            win.activeInterval = null;
        }

        if (win.toolResizeObserver) {
            win.toolResizeObserver.disconnect();
            win.toolResizeObserver = null;
        }

        if (win.annotationResizeObserver) {
            win.annotationResizeObserver.disconnect();
            win.annotationResizeObserver = null;
        }
    }

    function saveDrawingState(canvas, ctx, history) {
        if (!canvas || !ctx || !history) return;
        if (history.length > 20) { // Limit history size
            history.shift();
        }
        history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    function displayFileInWindow(win, file) {
        if (!file) return;
        cleanupWindowTools(win);
        const mainArea = win.querySelector('.win-main-area');
        if (!mainArea) return;
    
        mainArea.innerHTML = '';
        const url = URL.createObjectURL(file);
        const cont = document.createElement('div');
        cont.className = 'content-fill';
    
        if (file.type === 'application/pdf') {
            const ifr = document.createElement('iframe');
            ifr.src = url;
            cont.appendChild(ifr);
        } else if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = url;
            img.style.objectFit = 'contain';
            img.crossOrigin = "anonymous";
            cont.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const vid = document.createElement('video');
            vid.src = url;
            vid.controls = true;
            vid.autoplay = true;
            cont.appendChild(vid);
        } else if (file.name.toLowerCase().endsWith('.pptx') || file.name.toLowerCase().endsWith('.ppt')) {
            cont.innerHTML = `
                <div class="unsupported-file-message">
                    <i class="fas fa-file-powerpoint"></i>
                    <h3>PowerPoint File</h3>
                    <p>To display this file, please convert it to a PDF first and then drop it here.</p>
                </div>
            `;
        } else {
            cont.textContent = 'Unsupported file';
            cont.style.color = 'white';
        }
        mainArea.appendChild(cont);
    }

    function handleDrop(e) {
        e.preventDefault();
        displayFileInWindow(this, e.dataTransfer.files[0]);
    }

    function createWinArrangement(arr) {
        clearWins();
        arr.forEach(cfg => {
            const w = createWin();
            w.style.left = cfg.left;
            w.style.top = cfg.top;
            w.style.width = cfg.width;
            w.style.height = cfg.height;
        });
    }

    function activateDraw(win) {
        if (win.querySelector('.draw-controls-bar')) return;
    
        const mainArea = win.querySelector('.win-main-area');
        if (!mainArea) return;
        
        cleanupWindowTools(win);
        mainArea.innerHTML = '';
        mainArea.style.padding = '0';
        mainArea.style.display = 'flex';
        mainArea.style.flexDirection = 'column';
        
        win.dataset.tool = 'draw';
    
        const leftControls = win.querySelector('.drag-bar .tool-controls');
        if (leftControls) {
            leftControls.style.display = 'none';
        }

        const canvas = document.createElement('canvas');
        const cont = document.createElement('div');
        cont.className = 'content-fill';
        cont.style.position = 'relative';
        cont.appendChild(canvas);
    
        const ctx = canvas.getContext('2d');
        let drawing = false;
        const hist = [];
    
        function saveState() {
            if (hist.length > 30) hist.shift();
            hist.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
    
        const resizeObserver = new ResizeObserver(() => {
            const oldData = hist.length > 0 ? hist[hist.length - 1] : null;
            canvas.width = cont.clientWidth;
            canvas.height = cont.clientHeight;
            if (oldData) ctx.putImageData(oldData, 0, 0);
            ctx.lineCap = 'round';
            ctx.strokeStyle = controls.querySelector('.color-swatch.active')?.style.backgroundColor || '#FFFFFF';
            ctx.lineWidth = sizeInput.value;
        });
        win.toolResizeObserver = resizeObserver;
        resizeObserver.observe(cont);
    
        canvas.style.background = '#333';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    
        canvas.addEventListener('pointerdown', e => {
            drawing = true;
            saveState();
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        });
        canvas.addEventListener('pointermove', e => {
            if (drawing) {
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            }
        });
        canvas.addEventListener('pointerup', () => drawing = false);
    
        const controls = document.createElement('div');
        controls.className = 'draw-controls-bar';
    
        const colorSwatches = [];
        ['#FFFFFF', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE'].forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.onclick = () => {
                ctx.strokeStyle = color;
                controls.querySelector('.color-swatch.active')?.classList.remove('active');
                swatch.classList.add('active');
            };
            colorSwatches.push(swatch);
        });
    
        const sizeInput = document.createElement('input');
        sizeInput.type = 'range';
        sizeInput.min = 1;
        sizeInput.max = 50;
        sizeInput.value = 5;
        sizeInput.style.width = '80px';
        sizeInput.oninput = e => { ctx.lineWidth = e.target.value; };
    
        const undoBtn = document.createElement('button');
        undoBtn.innerHTML = '<i class="fas fa-undo"></i>';
        undoBtn.onclick = () => { if (hist.length > 0) ctx.putImageData(hist.pop(), 0, 0); };
    
        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = '<i class="fas fa-trash"></i>';
        clearBtn.onclick = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); hist.length = 0; };
    
        controls.append(sizeInput, ...colorSwatches, undoBtn, clearBtn);
        
        mainArea.append(controls, cont);
    
        ctx.strokeStyle = '#FFFFFF';
        colorSwatches[0].classList.add('active');
    }

    function activateCam(win) {
        const mainArea = win.querySelector('.win-main-area');
        if (!mainArea) return;
        mainArea.innerHTML = '';
        mainArea.style.padding = '0';

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const v = document.createElement('video');
                v.srcObject = stream;
                v.autoplay = true;
                v.muted = true;
                v.style.width = '100%';
                v.style.height = '100%';
                v.style.objectFit = 'cover';
                mainArea.appendChild(v);
            }).catch(err => {
                mainArea.textContent = "Could not access camera.";
                console.error(err);
            });
    }

    function activateTimer(win) {
        const mainArea = win.querySelector('.win-main-area');
        if (!mainArea) return;

        function setupRunningTimer(initialSeconds) {
            mainArea.innerHTML = '';
            mainArea.style.padding = '0';
            mainArea.style.display = 'flex';
            mainArea.style.flexDirection = 'column';
            win.classList.add('timer-is-running');

            let remainingSeconds = initialSeconds;
            let isRunning = false;
            let endTime;
            
            const displayContainer = document.createElement('div');
            displayContainer.style.cssText = `flex-grow: 1; position: relative; width: 100%; display: flex; align-items: center; justify-content: center;`;
            
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.style.position = 'absolute';
            svg.style.width = '90%';
            svg.style.height = '90%';
            svg.setAttribute('viewBox', '0 0 100 100');
            const bgCircle = document.createElementNS(svgNS, "circle");
            bgCircle.setAttribute('cx', '50'); bgCircle.setAttribute('cy', '50'); bgCircle.setAttribute('r', '45');
            bgCircle.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)'); bgCircle.setAttribute('stroke-width', '5'); bgCircle.setAttribute('fill', 'transparent');
            const fgCircle = document.createElementNS(svgNS, "circle");
            fgCircle.setAttribute('cx', '50'); fgCircle.setAttribute('cy', '50'); fgCircle.setAttribute('r', '45');
            fgCircle.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim());
            fgCircle.setAttribute('stroke-width', '5'); fgCircle.setAttribute('fill', 'transparent');
            fgCircle.style.transformOrigin = 'center'; fgCircle.style.transform = 'rotate(-90deg)';
            const radius = 45;
            const circumference = 2 * Math.PI * radius;
            fgCircle.setAttribute('stroke-dasharray', circumference);
            fgCircle.setAttribute('stroke-dashoffset', 0);
            fgCircle.style.transition = 'stroke-dashoffset 1s linear';
            svg.append(bgCircle, fgCircle);
            displayContainer.appendChild(svg);

            const display = document.createElement('div');
            display.style.cssText = `color: white; font-weight: 700; line-height: 1; position: relative; z-index: 1;`;
            displayContainer.appendChild(display);
            mainArea.appendChild(displayContainer);

            const updateDisplay = (timeInSeconds) => {
                const progress = timeInSeconds / initialSeconds;
                const offset = circumference * (1 - progress);
                fgCircle.setAttribute('stroke-dashoffset', offset);

                if (timeInSeconds < 0) timeInSeconds = 0;

                if (timeInSeconds < 60) {
                    display.textContent = String(timeInSeconds).padStart(2, '0');
                } else {
                    const minutes = Math.floor(timeInSeconds / 60);
                    const seconds = String(timeInSeconds % 60).padStart(2, '0');
                    const minutesDisplay = (minutes > 0 && minutes < 10) ? String(minutes) : String(minutes).padStart(2, '0');
                    display.textContent = `${minutesDisplay}:${seconds}`;
                }
                updateFontSize();
            };
            
            const updateFontSize = () => {
                const charCount = display.textContent.length > 2 ? 4.4 : 2.2;
                const newSize = displayContainer.clientWidth / charCount;
                display.style.fontSize = `${newSize}px`;
            };
            
            const resizeObserver = new ResizeObserver(updateFontSize);
            win.toolResizeObserver = resizeObserver;
            resizeObserver.observe(displayContainer);

            function timerTick() {
                const secondsLeft = Math.round((endTime - Date.now()) / 1000);
                remainingSeconds = secondsLeft;
                updateDisplay(secondsLeft);

                if (secondsLeft <= 0) {
                    $('bellSound').play();
                    cleanupWindowTools(win);
                    activateTimer(win);
                }
            }

            const controls = document.createElement('div');
            controls.className = 'countdown-running-controls';

            const startPauseBtn = document.createElement('button');
            startPauseBtn.className = 'icon-btn timer-start-pause-btn';
            startPauseBtn.title = 'Start/Pause Timer (Enter)';
            startPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            startPauseBtn.style.backgroundColor = 'var(--success-color)';
            startPauseBtn.onclick = () => {
                isRunning = !isRunning;
                if (isRunning) {
                    endTime = Date.now() + remainingSeconds * 1000;
                    win.activeInterval = setInterval(timerTick, 1000);
                    timerTick();
                    startPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    clearInterval(win.activeInterval);
                    win.activeInterval = null;
                    startPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            };
            
            const resetBtn = document.createElement('button');
            resetBtn.className = 'icon-btn timer-reset-btn';
            resetBtn.title = 'Reset Timer (Spacebar)';
            resetBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            resetBtn.style.backgroundColor = 'var(--danger-color)';
            resetBtn.onclick = () => {
                cleanupWindowTools(win);
                activateTimer(win);
            };

            controls.append(startPauseBtn, resetBtn);
            mainArea.appendChild(controls);

            updateDisplay(initialSeconds);
        }

        mainArea.innerHTML = '';
        mainArea.style.padding = '16px';
        mainArea.style.display = 'flex';
        mainArea.style.flexDirection = 'column';
        win.classList.remove('timer-is-running');

        const title = document.createElement('h2');
        title.className = 'countdown-title';
        title.textContent = 'Choose Timer Duration';
        mainArea.appendChild(title);

        const selectionGrid = document.createElement('div');
        selectionGrid.className = 'countdown-selection-grid';
        const times = [{ label: '30 sec', seconds: 30 }, { label: '1 min', seconds: 60 }, { label: '2 min', seconds: 120 }, { label: '5 min', seconds: 300 }, { label: '10 min', seconds: 600 }, { label: '15 min', seconds: 900 }, { label: '30 min', seconds: 1800 }, { label: '1 Hour', seconds: 3600 }];
        times.forEach(time => {
            const btn = document.createElement('button');
            btn.className = 'countdown-btn';
            btn.textContent = time.label;
            btn.onclick = () => setupRunningTimer(time.seconds);
            selectionGrid.appendChild(btn);
        });
        mainArea.appendChild(selectionGrid);
    }

    function activateType(win) {
        const mainArea = win.querySelector('.win-main-area');
        if (!mainArea) return;
        mainArea.innerHTML = '';
        mainArea.style.padding = '0';
        mainArea.style.display = 'flex';
        mainArea.style.flexDirection = 'column';

        const ta = document.createElement('div');
        ta.contentEditable = true;
        ta.style.flex = '1';
        ta.style.padding = '16px';
        ta.addEventListener('focus', () => { hotkeysEnabled = false; });
        ta.addEventListener('blur', () => { hotkeysEnabled = true; });

        const ctrl = document.createElement('div');
        ctrl.style.cssText = 'display:flex;justify-content:center;gap:12px;padding:8px;';
        ['fas fa-plus', 'fas fa-minus'].forEach(icon => {
            const b = document.createElement('button');
            b.className = 'icon-btn text-editor-control-btn';
            b.innerHTML = `<i class="${icon}"></i>`;
            b.style.width = '40px'; b.style.height = '40px'; b.style.fontSize = '16px';
            b.onclick = () => { const sz = parseInt(getComputedStyle(ta).fontSize, 10); ta.style.fontSize = `${sz + (icon.includes('plus') ? 6 : -6)}px`; };
            ctrl.appendChild(b);
        });

        mainArea.append(ta, ctrl);
        ta.focus();
    }

    function activateDiceRoller(win) {
        const mainArea = win.querySelector('.win-main-area');
        if (!mainArea) return;
        mainArea.innerHTML = '';
        mainArea.style.padding = '0';
        mainArea.style.display = 'flex';
        mainArea.style.flexDirection = 'column';

        const diceContainer = document.createElement('div');
        diceContainer.className = 'die-container';
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'dice-controls';
        mainArea.append(diceContainer, controlsContainer);
        let numDice = 1;
        
        const createDie = (value = 1) => { 
            const die = document.createElement('div'); 
            die.className = 'die'; 
            die.dataset.value = value; 
            for (let i = 1; i <= 9; i++) { 
                const dot = document.createElement('div'); 
                dot.className = `die-dot dot-${i}`; 
                die.appendChild(dot); 
            } 
            return die; 
        };
        
        const totalDisplay = document.createElement('div');
        totalDisplay.className = 'dice-total';
        
        const rollDice = (animate = true) => { 
            let total = 0; 
            const dice = diceContainer.querySelectorAll('.die'); 
            dice.forEach(die => { 
                const value = Math.floor(Math.random() * 6) + 1; 
                total += value; 
                die.dataset.value = value; 
                if (animate) { 
                    die.classList.add('rolling'); 
                    die.addEventListener('animationend', () => die.classList.remove('rolling'), { once: true }); 
                } 
            }); 
            totalDisplay.textContent = `Total: ${total}`; 
        };

        const resizeDice = () => {
            requestAnimationFrame(() => {
                const containerStyle = getComputedStyle(diceContainer);
                const gap = parseFloat(containerStyle.gap) || 32;
                const containerWidth = diceContainer.clientWidth - (parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight));
                const containerHeight = diceContainer.clientHeight - (parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom));

                if (containerWidth <= 0 || containerHeight <= 0) return;

                const cols = Math.ceil(Math.sqrt(numDice));
                const rows = Math.ceil(numDice / cols);

                const sizeFromWidth = (containerWidth - (cols - 1) * gap) / cols;
                const sizeFromHeight = (containerHeight - (rows - 1) * gap) / rows;
                
                const optimalSize = Math.max(48, Math.floor(Math.min(sizeFromWidth, sizeFromHeight)));

                diceContainer.querySelectorAll('.die').forEach(d => {
                    d.style.width = `${optimalSize}px`;
                    d.style.height = `${optimalSize}px`;
                });
            });
        };
        
        const renderDice = () => { 
            diceContainer.innerHTML = ''; 
            for (let i = 0; i < numDice; i++) { 
                diceContainer.appendChild(createDie(1)); 
            } 
            rollDice(false);
            resizeDice();
        };
        
        const addDieBtn = document.createElement('button');
        addDieBtn.className = 'icon-btn'; addDieBtn.innerHTML = '<i class="fas fa-plus"></i>';
        addDieBtn.onclick = () => { if (numDice < 6) { numDice++; renderDice(); } };

        const removeDieBtn = document.createElement('button');
        removeDieBtn.className = 'icon-btn'; removeDieBtn.innerHTML = '<i class="fas fa-minus"></i>';
        removeDieBtn.onclick = () => { if (numDice > 1) { numDice--; renderDice(); } };

        const rollBtn = document.createElement('button');
        rollBtn.className = 'icon-btn'; rollBtn.innerHTML = '<i class="fas fa-dice-d6"></i>'; rollBtn.style.backgroundColor = 'var(--success-color)'; rollBtn.onclick = () => rollDice(true);
        
        controlsContainer.append(addDieBtn, removeDieBtn, rollBtn, totalDisplay);
        
        const resizeObserver = new ResizeObserver(resizeDice);
        win.toolResizeObserver = resizeObserver;
        resizeObserver.observe(mainArea);
        
        renderDice();
    }

    function activateStopwatch(win) {
        const mainArea = win.querySelector('.win-main-area');
        if (!mainArea) return;
        mainArea.innerHTML = '';
        mainArea.style.padding = '0';
        mainArea.style.display = 'flex';
        mainArea.style.flexDirection = 'column';

        const display = document.createElement('div');
        display.className = 'stopwatch-display';
        display.textContent = '00:00.00';
        const controls = document.createElement('div');
        controls.className = 'stopwatch-controls';
        mainArea.append(display, controls);
        let elapsedTime = 0, startTime = 0, isRunning = false;
        const formatTime = () => { const diff = elapsedTime; const minutes = String(Math.floor(diff / 60000)).padStart(2, '0'); const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'); const milliseconds = String(Math.floor((diff % 1000) / 10)).padStart(2, '0'); display.textContent = `${minutes}:${seconds}.${milliseconds}`; };
        
        const startStopBtn = document.createElement('button');
        startStopBtn.className = 'icon-btn'; startStopBtn.innerHTML = '<i class="fas fa-play"></i>'; startStopBtn.style.backgroundColor = 'var(--success-color)';
        startStopBtn.onclick = () => { 
            if (isRunning) { 
                clearInterval(win.activeInterval);
                win.activeInterval = null;
                elapsedTime = Date.now() - startTime; 
                startStopBtn.innerHTML = '<i class="fas fa-pause"></i>'; 
            } else { 
                startTime = Date.now() - elapsedTime; 
                win.activeInterval = setInterval(() => { elapsedTime = Date.now() - startTime; formatTime(); }, 10); 
                startStopBtn.innerHTML = '<i class="fas fa-play"></i>'; 
            } 
            isRunning = !isRunning; 
        };
        
        const resetBtn = document.createElement('button');
        resetBtn.className = 'icon-btn'; resetBtn.innerHTML = '<i class="fas fa-sync-alt"></i>'; resetBtn.style.backgroundColor = 'var(--danger-color)';
        resetBtn.onclick = () => { 
            clearInterval(win.activeInterval);
            win.activeInterval = null;
            isRunning = false; 
            elapsedTime = 0; 
            startStopBtn.innerHTML = '<i class="fas fa-play"></i>'; 
            formatTime(); 
        };
        
        controls.append(startStopBtn, resetBtn);
        const updateFontSize = (el) => { const newSize = el.clientWidth / 4.6; display.style.fontSize = `${newSize}px`; };
        const resizeObserver = new ResizeObserver(entries => { for (let entry of entries) { updateFontSize(entry.target); } });
        win.toolResizeObserver = resizeObserver;
        resizeObserver.observe(mainArea);
        updateFontSize(mainArea);
    }

    function activateForAndAgainst(win) {
        const mainArea = win.querySelector('.win-main-area');
        if (!mainArea) return;
        mainArea.innerHTML = '';
        mainArea.style.padding = '0';
        mainArea.style.display = 'flex';
        mainArea.style.gap = '0';
        mainArea.style.overflow = 'hidden';

        win.dataset.disablesHotkeys = 'true';
        mainArea.addEventListener('pointerdown', (e) => { hotkeysEnabled = false; e.stopPropagation(); });

        const createPanel = (title, bgColor) => {
            let count = 0;
            const panel = document.createElement('div');
            panel.className = 'for-against-panel'; panel.style.backgroundColor = `var(${bgColor})`; panel.style.boxSizing = 'border-box';
            const titleEl = document.createElement('h2');
            titleEl.textContent = title;
            const display = document.createElement('div');
            display.className = 'for-against-display'; display.textContent = count;
            const controls = document.createElement('div');
            controls.className = 'for-against-controls';
            const minusBtn = document.createElement('button');
            minusBtn.innerHTML = '<i class="fas fa-minus"></i>';
            minusBtn.onclick = () => {
                if (count > 0) {
                    count--;
                    display.textContent = count;
                }
            };
            const plusBtn = document.createElement('button');
            plusBtn.innerHTML = '<i class="fas fa-plus"></i>';
            plusBtn.onclick = () => { count++; display.textContent = count; };
            controls.append(minusBtn, plusBtn);
            panel.append(titleEl, display, controls);
            return panel;
        };
        const againstPanel = createPanel('Against', '--danger-color');
        const forPanel = createPanel('For', '--success-color');
        mainArea.append(forPanel, againstPanel);

        const updateSizes = (baseDimension) => {
            const titleSize = baseDimension * 0.1, displaySize = baseDimension * 0.3, buttonSize = baseDimension * 0.2, buttonIconSize = buttonSize * 0.5, paddingSize = baseDimension * 0.05;
            mainArea.querySelectorAll('.for-against-panel').forEach(el => el.style.padding = `${Math.max(10, paddingSize)}px`);
            mainArea.querySelectorAll('.for-against-panel h2').forEach(el => el.style.fontSize = `${Math.max(14, titleSize)}px`);
            mainArea.querySelectorAll('.for-against-display').forEach(el => el.style.fontSize = `${Math.max(30, displaySize)}px`);
            mainArea.querySelectorAll('.for-against-controls').forEach(el => el.style.gap = `${Math.max(10, paddingSize)}px`);
            mainArea.querySelectorAll('.for-against-controls button').forEach(el => { el.style.width = `${Math.max(35, buttonSize)}px`; el.style.height = `${Math.max(35, buttonSize)}px`; el.style.fontSize = `${Math.max(16, buttonIconSize)}px`; });
        };
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                const isPortrait = height > width * 0.95;
                if (isPortrait) {
                    mainArea.style.flexDirection = 'column';
                    [againstPanel, forPanel].forEach(p => { p.style.height = '50%'; p.style.width = '100%'; });
                    updateSizes(height / 2);
                } else {
                    mainArea.style.flexDirection = 'row';
                    [againstPanel, forPanel].forEach(p => { p.style.height = '100%'; p.style.width = '50%'; });
                    updateSizes(width / 2);
                }
            }
        });
        win.toolResizeObserver = resizeObserver;
        resizeObserver.observe(mainArea);
    }

    function activateCarousel(win) {
        const mainArea = win.querySelector('.win-main-area');
        if (!mainArea) return;

        cleanupWindowTools(win);
        win.dataset.tool = 'carousel';

        mainArea.innerHTML = '';
        mainArea.style.padding = '0';
        mainArea.style.display = 'flex';
        mainArea.style.flexDirection = 'column';

        let imageUrls = [];
        let currentIndex = 0;

        const imageViewer = document.createElement('div');
        imageViewer.className = 'carousel-container';

        const imageElement = document.createElement('img');
        imageElement.className = 'carousel-image';
        imageElement.alt = 'Carousel Image';
        
        const placeholderText = document.createElement('p');
        placeholderText.className = 'carousel-placeholder';
        placeholderText.textContent = 'Click the folder icon to select images';

        imageViewer.append(imageElement, placeholderText);

        const controls = document.createElement('div');
        controls.className = 'carousel-controls';

        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-btn';
        prevButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
        prevButton.disabled = true;

        const folderButton = document.createElement('button');
        folderButton.className = 'carousel-btn';
        folderButton.innerHTML = '<i class="fas fa-folder-open"></i>';

        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-btn';
        nextButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
        nextButton.disabled = true;

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        controls.append(prevButton, folderButton, nextButton, fileInput);
        mainArea.append(imageViewer, controls);
        
        const showImage = () => {
            if (imageUrls.length > 0) {
                imageElement.src = imageUrls[currentIndex];
                imageElement.style.display = 'block';
                placeholderText.style.display = 'none';
                prevButton.disabled = false;
                nextButton.disabled = false;
            } else {
                imageElement.style.display = 'none';
                placeholderText.style.display = 'block';
                prevButton.disabled = true;
                nextButton.disabled = true;
            }
        };

        folderButton.onclick = () => {
            fileInput.click();
        };

        fileInput.onchange = (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            imageUrls = Array.from(files).map(file => URL.createObjectURL(file));

            currentIndex = 0;
            showImage();
        };

        prevButton.onclick = () => {
            if (imageUrls.length === 0) return;
            currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
            showImage();
        };

        nextButton.onclick = () => {
            if (imageUrls.length === 0) return;
            currentIndex = (currentIndex + 1) % imageUrls.length;
            showImage();
        };
    }

    function activateCalculator(win) {
        const mainArea = win.querySelector('.win-main-area');
        if (!mainArea) return;
        mainArea.innerHTML = '';
        mainArea.style.padding = '0';
        mainArea.style.overflow = 'hidden';

        const calcGrid = document.createElement('div');
        calcGrid.className = 'calculator-grid';

        const display = document.createElement('div');
        display.className = 'calculator-display';
        const expressionDiv = document.createElement('div');
        expressionDiv.id = 'calc-expression';
        expressionDiv.innerHTML = '&nbsp;';
        const inputDiv = document.createElement('div');
        inputDiv.id = 'calc-input';
        inputDiv.textContent = '0';
        display.append(expressionDiv, inputDiv);

        const buttonsGrid = document.createElement('div');
        buttonsGrid.className = 'calculator-buttons';

        const buttons = [
            { text: 'sin', class: 'function' }, { text: 'cos', class: 'function' }, { text: 'tan', class: 'function' }, { text: 'log', class: 'function' }, { text: 'ln', class: 'function' },
            { text: '(', class: 'function' }, { text: ')', class: 'function' }, { text: '√', class: 'function' }, { text: '^', class: 'function' }, { text: '!', class: 'function' },
            { text: '7', class: 'number' }, { text: '8', class: 'number' }, { text: '9', class: 'number' }, { text: '÷', class: 'operator' }, { text: 'AC', class: 'ac' },
            { text: '4', class: 'number' }, { text: '5', class: 'number' }, { text: '6', class: 'number' }, { text: '×', class: 'operator' }, { text: 'C', class: 'operator' },
            { text: '1', class: 'number' }, { text: '2', class: 'number' }, { text: '3', class: 'number' }, { text: '-', class: 'operator' }, { text: '=', class: 'equals' },
            { text: '0', class: 'number' }, { text: '.', class: 'number' }, { text: 'π', class: 'number' }, { text: '+', class: 'operator' }
        ];

        buttons.forEach(btnDef => {
            const button = document.createElement('button');
            button.textContent = btnDef.text;
            button.className = `calc-btn ${btnDef.class}`;
            button.dataset.value = btnDef.text;
            if (btnDef.text === '=') button.style.gridRow = 'span 2';
            buttonsGrid.appendChild(button);
        });

        calcGrid.append(display, buttonsGrid);
        mainArea.appendChild(calcGrid);

        let expression = '';
        let lastResult = '';
        const updateDisplay = () => {
            expressionDiv.innerHTML = expression.replace(/\*/g, '×').replace(/\//g, '÷') || '&nbsp;';
            inputDiv.textContent = lastResult || '0';
        };

        const factorial = (n) => (n <= 1) ? 1 : n * factorial(n - 1);

        buttonsGrid.addEventListener('click', (e) => {
            if (!e.target.matches('.calc-btn')) return;
            const value = e.target.dataset.value;

            switch(value) {
                case 'AC':
                    expression = '';
                    lastResult = '';
                    break;
                case 'C':
                    expression = expression.slice(0, -1);
                    break;
                case '=':
                    try {
                        let evalExpr = expression
                            .replace(/×/g, '*')
                            .replace(/÷/g, '/')
                            .replace(/√/g, 'Math.sqrt')
                            .replace(/\^/g, '**')
                            .replace(/log/g, 'Math.log10')
                            .replace(/ln/g, 'Math.log')
                            .replace(/sin/g, 'Math.sin')
                            .replace(/cos/g, 'Math.cos')
                            .replace(/tan/g, 'Math.tan')
                            .replace(/π/g, 'Math.PI')
                            .replace(/(\d+)!/g, (_, n) => factorial(parseInt(n)));
                        
                        lastResult = new Function('return ' + evalExpr)();
                        expression = lastResult.toString();
                    } catch (err) {
                        lastResult = 'Error';
                        expression = '';
                    }
                    break;
                default:
                    if (lastResult === 'Error') {
                        lastResult = '';
                        expression = '';
                    }
                    expression += value;
                    break;
            }
            updateDisplay();
        });

        const allButtons = calcGrid.querySelectorAll('.calc-btn');
        const updateCalcFontSize = () => {
            const width = mainArea.clientWidth;
            const baseSize = width / 20;
            
            inputDiv.style.fontSize = `${Math.max(24, baseSize * 1.5)}px`;
            expressionDiv.style.fontSize = `${Math.max(14, baseSize * 0.675)}px`;
            allButtons.forEach(btn => {
                if (btn.classList.contains('function')) {
                    btn.style.fontSize = `${Math.max(12, baseSize * 0.675)}px`;
                } else {
                    btn.style.fontSize = `${Math.max(14, baseSize * 0.75)}px`;
                }
            });
        };

        const resizeObserver = new ResizeObserver(updateCalcFontSize);
        win.toolResizeObserver = resizeObserver;
        resizeObserver.observe(mainArea);
        updateCalcFontSize();
    }

    function createWin() {
        const win = document.createElement('div');
        win.className = 'floating';
        const i = document.querySelectorAll('.floating').length;
        const currentSidebarWidth = getSidebarWidth();
        win.style.left = `${30 * i}px`;
        win.style.top = `${30 * i}px`;
        win.style.width = `${(window.innerWidth - currentSidebarWidth) / 2}px`;
        win.style.height = `${window.innerHeight / 2}px`;

        win.annotationCurrentColor = '#FFFFFF';

        const bar = document.createElement('div');
        bar.className = 'drag-bar';
        win.appendChild(bar);

        const leftControls = document.createElement('div');
        leftControls.className = 'tool-controls';

        const penBtn = document.createElement('button');
        penBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        penBtn.title = 'Annotate';
        penBtn.classList.add('pen-btn');

        const colorBtn = document.createElement('button');
        colorBtn.innerHTML = '<i class="fas fa-palette"></i>';
        colorBtn.title = 'Change Color';

        const colorPalette = document.createElement('div');
        colorPalette.className = 'custom-color-palette hidden';
        leftControls.appendChild(colorPalette);

        const paletteColors = [
            '#FFFFFF', '#C1C1C1', '#888888', '#000000',
            '#FF3B30', '#D90429', '#FF9500', '#FFCC00',
            '#4CD964', '#34C759', '#30D5C8', '#5AC8FA',
            '#007AFF', '#5856D6', '#AF52DE', '#A2845E'
        ];

        paletteColors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'custom-color-swatch';
            swatch.style.backgroundColor = color;
            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                win.annotationCurrentColor = color;
                colorBtn.style.color = color;
                if (win.annotationContext) {
                    win.annotationContext.strokeStyle = color;
                }
                colorPalette.classList.add('hidden');
            });
            colorPalette.appendChild(swatch);
        });

        colorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-color-palette').forEach(p => {
                if (p !== colorPalette) p.classList.add('hidden');
            });
            colorPalette.classList.toggle('hidden');
        });

        const undoBtn = document.createElement('button');
        undoBtn.innerHTML = '<i class="fas fa-undo"></i>';
        undoBtn.title = 'Undo';

        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = '<i class="fas fa-trash"></i>';
        clearBtn.title = 'Clear Annotations';

        leftControls.append(penBtn, colorBtn, undoBtn, clearBtn);
        bar.appendChild(leftControls);

        penBtn.addEventListener('click', () => {
            penBtn.classList.toggle('active');
            const mainArea = win.querySelector('.win-main-area');
            if (!mainArea) return;

            if (penBtn.classList.contains('active')) {
                const canvas = document.createElement('canvas');
                canvas.className = 'annotation-canvas';
                mainArea.appendChild(canvas);

                win.annotationCanvas = canvas;
                win.drawingHistory = [];
                const ctx = canvas.getContext('2d');
                win.annotationContext = ctx;
                let drawing = false;

                const resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        canvas.width = entry.contentRect.width;
                        canvas.height = entry.contentRect.height;
                        ctx.putImageData(imageData, 0, 0);
                        ctx.strokeStyle = win.annotationCurrentColor;
                        ctx.lineWidth = 5;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                    }
                });
                resizeObserver.observe(mainArea);
                win.annotationResizeObserver = resizeObserver;

                canvas.width = mainArea.clientWidth;
                canvas.height = mainArea.clientHeight;
                ctx.strokeStyle = win.annotationCurrentColor;
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                colorBtn.style.color = win.annotationCurrentColor;

                const startDraw = (e) => {
                    saveDrawingState(canvas, ctx, win.drawingHistory);
                    drawing = true;
                    ctx.beginPath();
                    const rect = canvas.getBoundingClientRect();
                    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                };
                const draw = (e) => {
                    if (!drawing) return;
                    const rect = canvas.getBoundingClientRect();
                    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                    ctx.stroke();
                };
                const stopDraw = () => { drawing = false; };

                canvas.addEventListener('pointerdown', startDraw);
                canvas.addEventListener('pointermove', draw);
                canvas.addEventListener('pointerup', stopDraw);
                canvas.addEventListener('pointerleave', stopDraw);

            } else {
                if (win.annotationCanvas) {
                    win.annotationCanvas.remove();
                    win.annotationCanvas = null;
                    win.annotationContext = null;
                }
                if (win.annotationResizeObserver) {
                    win.annotationResizeObserver.disconnect();
                    win.annotationResizeObserver = null;
                }
            }
        });
        
        undoBtn.addEventListener('click', () => {
            if (!win.annotationContext || !win.drawingHistory || win.drawingHistory.length === 0) return;
            const lastState = win.drawingHistory.pop();
            win.annotationContext.putImageData(lastState, 0, 0);
        });

        clearBtn.addEventListener('click', () => {
            if (!win.annotationContext) return;
            const ctx = win.annotationContext;
            saveDrawingState(win.annotationCanvas, ctx, win.drawingHistory);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        });

        const rightControls = document.createElement('div');
        rightControls.className = 'window-management-controls';
        bar.appendChild(rightControls);

        win.addEventListener('pointerdown', () => setActiveWindow(win));

        let dx, dy;
        bar.onpointerdown = e => {
            if (e.target.closest('button, .tool-controls, input, .draw-controls-bar, .window-management-controls')) return;
            e.stopPropagation();
            
            win.classList.remove('snapped-window');
            win.style.opacity = '1';
            const opacitySlider = win.querySelector('.opacity-slider');
            if (opacitySlider) opacitySlider.value = 100;
            
            dx = e.clientX - win.offsetLeft;
            dy = e.clientY - win.offsetTop;
            
            function mv(ev) {
                let nx = ev.clientX - dx;
                let ny = ev.clientY - dy;
                nx = Math.round(nx / gridSizePx) * gridSizePx;
                ny = Math.round(ny / gridSizePx) * gridSizePx;
                const currentSidebarWidth = getSidebarWidth();
                nx = Math.max(0, Math.min(nx, window.innerWidth - currentSidebarWidth - win.offsetWidth));
                ny = Math.max(0, Math.min(ny, window.innerHeight - win.offsetHeight));
                win.style.left = `${nx}px`;
                win.style.top = `${ny}px`;
            }

            function up() {
                document.removeEventListener('pointermove', mv);
                document.removeEventListener('pointerup', up);
                checkForSnap(win);
            }
            document.addEventListener('pointermove', mv);
            document.addEventListener('pointerup', up);
        };
        
        const resizeHandleSize = 10;
        let isResizing = false;
        let resizeDirection = '';

        win.addEventListener('pointerdown', e => {
            const rect = win.getBoundingClientRect();
            const onTopEdge = e.clientY >= rect.top && e.clientY <= rect.top + resizeHandleSize;
            const onBottomEdge = e.clientY <= rect.bottom && e.clientY >= rect.bottom - resizeHandleSize;
            const onLeftEdge = e.clientX >= rect.left && e.clientX <= rect.left + resizeHandleSize;
            const onRightEdge = e.clientX <= rect.right && e.clientX >= rect.right - resizeHandleSize;

            if (!onTopEdge && !onBottomEdge && !onLeftEdge && !onRightEdge) return;

            isResizing = true;
            resizeDirection = '';
            if (onTopEdge) resizeDirection += 'n';
            if (onBottomEdge) resizeDirection += 's';
            if (onLeftEdge) resizeDirection += 'w';
            if (onRightEdge) resizeDirection += 'e';

            e.preventDefault();

            let lastX = e.clientX;
            let lastY = e.clientY;

            function doResize(ev) {
                const dx = ev.clientX - lastX;
                const dy = ev.clientY - lastY;
                let newWidth = win.offsetWidth;
                let newHeight = win.offsetHeight;
                let newLeft = win.offsetLeft;
                let newTop = win.offsetTop;
                
                if (resizeDirection.includes('e')) newWidth += dx;
                if (resizeDirection.includes('w')) { newWidth -= dx; newLeft += dx; }
                if (resizeDirection.includes('s')) newHeight += dy;
                if (resizeDirection.includes('n')) { newHeight -= dy; newTop += dy; }

                win.style.width = `${newWidth}px`;
                win.style.height = `${newHeight}px`;
                win.style.left = `${newLeft}px`;
                win.style.top = `${newTop}px`;

                lastX = ev.clientX;
                lastY = ev.clientY;
            }

            function stopResize() {
                isResizing = false;
                document.removeEventListener('pointermove', doResize);
                document.removeEventListener('pointerup', stopResize);
            }

            document.addEventListener('pointermove', doResize);
            document.addEventListener('pointerup', stopResize);
        });

        win.addEventListener('mousemove', e => {
            if (isResizing) return;
            const rect = win.getBoundingClientRect();
            const onTopEdge = e.clientY >= rect.top && e.clientY <= rect.top + resizeHandleSize;
            const onBottomEdge = e.clientY <= rect.bottom && e.clientY >= rect.bottom - resizeHandleSize;
            const onLeftEdge = e.clientX >= rect.left && e.clientX <= rect.left + resizeHandleSize;
            const onRightEdge = e.clientX <= rect.right && e.clientX >= rect.right - resizeHandleSize;
            
            if ((onTopEdge && onLeftEdge) || (onBottomEdge && onRightEdge)) win.style.cursor = 'nwse-resize';
            else if ((onTopEdge && onRightEdge) || (onBottomEdge && onLeftEdge)) win.style.cursor = 'nesw-resize';
            else if (onTopEdge || onBottomEdge) win.style.cursor = 'ns-resize';
            else if (onLeftEdge || onRightEdge) win.style.cursor = 'ew-resize';
            else win.style.cursor = 'default';
        });

        const opacitySlider = document.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.className = 'opacity-slider';
        opacitySlider.min = '10';
        opacitySlider.max = '100';
        opacitySlider.value = '100';
        opacitySlider.title = 'Window Opacity';
        opacitySlider.oninput = (e) => {
            win.style.opacity = e.target.value / 100;
        };
        rightControls.appendChild(opacitySlider);

        const buttonDefs = [
            { type: 'quadrant', content: '◱', title: 'Snap to Quadrant (Q)' },
            { type: 'v-half', content: '◧', title: 'Snap to Vertical Half (8)' },
            { type: 'h-half', content: `<svg width="0.85em" height="0.85em" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" style="display: block; stroke-width: 1.5; stroke: currentColor; margin: auto;"><rect x="0.5" y="0.5" width="9" height="9" fill="none" /><rect x="0.5" y="0.5" width="9" height="4.5" fill="currentColor" /></svg>`, title: 'Snap to Horizontal Half (9)' },
            { type: 'full', content: '◼', title: 'Snap to Fullscreen' },
            { type: 'send-back', content: '<i class="fas fa-level-down-alt"></i>', title: 'Send to Back (PageDown)' },
            { type: 'close', content: '×', title: 'Close Window (Backspace)' }
        ];
    
        buttonDefs.forEach(def => {
            const b = document.createElement('button');
            b.className = (def.type === 'close') ? 'close-btn' : 'resize-btn';
            b.innerHTML = def.content;
            b.title = def.title;

            b.onclick = () => {
                const sidebarW = getSidebarWidth();
                const usableWidth = window.innerWidth - sidebarW;
                const usableHeight = window.innerHeight;
                const halfW = usableWidth / 2;
                const halfH = usableHeight / 2;

                if (def.type === 'quadrant') {
                    const winCenterX = win.offsetLeft + win.offsetWidth / 2;
                    const winCenterY = win.offsetTop + win.offsetHeight / 2;
                    
                    win.style.left = (winCenterX < halfW) ? '0px' : `${halfW}px`;
                    win.style.top = (winCenterY < halfH) ? '0px' : `${halfH}px`;
                    win.style.width = `${halfW}px`;
                    win.style.height = `${halfH}px`;

                } else if (def.type === 'v-half') {
                    const winCenterX = win.offsetLeft + win.offsetWidth / 2;

                    win.style.left = (winCenterX < halfW) ? '0px' : `${halfW}px`;
                    win.style.top = '0px';
                    win.style.width = `${halfW}px`;
                    win.style.height = `${usableHeight}px`;

                } else if (def.type === 'h-half') {
                    const winCenterY = win.offsetTop + win.offsetHeight / 2;

                    win.style.top = (winCenterY < halfH) ? '0px' : `${halfH}px`;
                    win.style.left = '0px';
                    win.style.width = `${usableWidth}px`;
                    win.style.height = `${halfH}px`;

                } else if (def.type === 'full') {
                    win.style.left = '0';
                    win.style.top = '0';
                    win.style.width = `${usableWidth}px`;
                    win.style.height = `${usableHeight}px`;
                } else if (def.type === 'send-back') {
                    const allWindows = document.querySelectorAll('.floating');
                    if (allWindows.length < 2) return;

                    let minZ = Infinity;
                    allWindows.forEach(w => {
                        const z = parseInt(window.getComputedStyle(w).zIndex, 10);
                        if (!isNaN(z) && z < minZ) {
                            minZ = z;
                        }
                    });

                    win.style.zIndex = minZ - 1;
                    win.classList.remove('active-window');
                } else if (def.type === 'close') {
                    cleanupWindowTools(win);
                    win.remove(); 
                }
            };
            rightControls.appendChild(b);
        });

        win.addEventListener('dragover', e => e.preventDefault());
        win.addEventListener('drop', handleDrop);

        const winBody = document.createElement('div');
        winBody.className = 'win-body';
        const mainArea = document.createElement('div');
        mainArea.className = 'win-main-area';
        const winSidebar = document.createElement('div');
        winSidebar.className = 'win-sidebar';
        winBody.append(mainArea, winSidebar);
        win.appendChild(winBody);

        const tools = [
            { key: 'd', icon: 'fas fa-pencil-alt', func: activateDraw, title: 'Drawing Canvas (D)' },
            { key: 't', icon: 'fas fa-font', func: activateType, title: 'Text Editor (T)' },
            { key: '0', icon: 'fas fa-list-ol', func: activateNumberedList, title: 'Numbered List (0)' },
            { key: 'w', icon: 'fas fa-camera', func: activateCam, title: 'Webcam (W)', premium: true },
            { key: 'v', icon: 'fas fa-images', func: activateCarousel, title: 'Photo Carousel (V)', premium: true },
            { key: 'o', icon: 'fas fa-stopwatch', func: activateTimer, title: 'Countdown Timer (O)', premium: true },
            { key: 'h', icon: 'fas fa-hourglass-start', func: activateStopwatch, title: 'Stopwatch (H)', premium: true },
            { key: 'g', icon: 'fas fa-dice', func: activateDiceRoller, title: 'Dice Roller (G)', premium: true },
            { key: 'a', icon: 'fas fa-balance-scale', func: activateForAndAgainst, title: 'For/Against Counter (A)', premium: true },
            { key: 'u', icon: 'fas fa-calculator', func: activateCalculator, title: 'Calculator (U)', premium: true }
        ];

        tools.forEach(tool => {
            const btn = document.createElement('button');
            btn.className = 'icon-btn';
            if (tool.premium) {
                btn.classList.add('premium-feature');
            }
            btn.dataset.hotkey = tool.key;
            btn.innerHTML = `<i class="${tool.icon}"></i>`;
            btn.onclick = () => {
                if (tool.premium && !window.TT.isPremium) {
                    openUpgradePanel();
                    return;
                }
                cleanupWindowTools(win);
                tool.func(win);
            };

            const hotkeyLabel = document.createElement('span');
            hotkeyLabel.className = 'hotkey-label';
            hotkeyLabel.textContent = tool.key.toUpperCase();
            
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = tool.title;
            
            btn.append(hotkeyLabel, tooltip);
            winSidebar.appendChild(btn);
        });
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.accept = 'image/*,video/*,audio/*,.pdf';
        win.appendChild(fileInput);

        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'icon-btn upload-btn';
        uploadBtn.title = 'Import File (I)';
        uploadBtn.innerHTML = '<i class="fas fa-file-arrow-up"></i>';
        uploadBtn.onclick = () => fileInput.click();

        fileInput.onchange = () => {
            if (fileInput.files.length > 0) {
                displayFileInWindow(win, fileInput.files[0]);
            }
        };
        winSidebar.appendChild(uploadBtn);
        
        const resetBtn = document.createElement('button');
        resetBtn.className = 'icon-btn reset-content-btn';
        resetBtn.title = 'Erase Content (E)';
        resetBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        resetBtn.onclick = () => {
            const pos = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height, opacity: win.style.opacity };
            const wasActive = win.classList.contains('active-window');
            cleanupWindowTools(win);
            win.remove();
            const n = createWin();
            n.style.left = pos.left; n.style.top = pos.top; n.style.width = pos.width; n.style.height = pos.height; n.style.opacity = pos.opacity;
            if (wasActive) setActiveWindow(n);
        };
        winSidebar.appendChild(resetBtn);

        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.innerHTML = `
        <div class="drop-zone-inner">
            <i class="drop-zone-icon fas fa-upload"></i>
            <div class="drop-zone-file-types">
                <i class="fas fa-file-image"></i><i class="fas fa-file-video"></i><i class="fas fa-file-audio"></i><i class="fas fa-file-pdf"></i>
            </div>
        </div>`;
        mainArea.appendChild(dropZone);

        document.body.appendChild(win);
        return win;
    }

    // --- NEW SNAPPING FUNCTIONS ---
    function calculateIntersection(win1, win2) {
        const rect1 = win1.getBoundingClientRect();
        const rect2 = win2.getBoundingClientRect();

        const interLeft = Math.max(rect1.left, rect2.left);
        const interTop = Math.max(rect1.top, rect2.top);
        const interRight = Math.min(rect1.right, rect2.right);
        const interBottom = Math.min(rect1.bottom, rect2.bottom);

        const interWidth = interRight - interLeft;
        const interHeight = interBottom - interTop;

        if (interWidth <= 0 || interHeight <= 0) return 0;

        const intersectionArea = interWidth * interHeight;
        const win2Area = rect2.width * rect2.height;

        return intersectionArea / win2Area;
    }

    function checkForSnap(draggedWin) {
        const allWindows = document.querySelectorAll('.floating');

        for (const targetWin of allWindows) {
            if (draggedWin === targetWin) continue;
            
            const sameWidth = Math.abs(draggedWin.offsetWidth - targetWin.offsetWidth) < 5;
            const sameHeight = Math.abs(draggedWin.offsetHeight - targetWin.offsetHeight) < 5;

            if (sameWidth && sameHeight) {
                const overlap = calculateIntersection(draggedWin, targetWin);
                if (overlap >= 0.55) {
                    draggedWin.style.left = targetWin.style.left;
                    draggedWin.style.top = targetWin.style.top;
                    draggedWin.style.opacity = '0.3';

                    const opacitySlider = draggedWin.querySelector('.opacity-slider');
                    if (opacitySlider) opacitySlider.value = 30;
                    
                    draggedWin.classList.add('snapped-window');
                    return; 
                }
            }
        }
    }
    // --- END NEW SNAPPING FUNCTIONS ---

    function handleLayout(layoutId, layoutFunction) {
        if (layoutState.activeLayout === layoutId) {
            clearWins();
            layoutState.activeLayout = null;
            layoutState.isVisible = true;
            localStorage.removeItem('ttx_lastLayout');
        } else {
            layoutFunction();
            layoutState.activeLayout = layoutId;
            layoutState.isVisible = true;
            localStorage.setItem('ttx_lastLayout', layoutId);
        }
    }

    function buildAndShowLayout(layoutId, showAnim = true) {
        const sidebarW = getSidebarWidth();
        const w = window.innerWidth - sidebarW;
        const h = window.innerHeight;
        const hw = w / 2;
        const hh = h / 2;
        let configs = [];

        switch (layoutId) {
            case 1:
                configs.push({ left: '0', top: '0', width: `${w}px`, height: `${h}px` });
                break;
            case 2:
                configs.push({ left: '0px', top: '0px', width: `${hw}px`, height: `${h}px` }, { left: `${hw}px`, top: '0px', width: `${hw}px`, height: `${h}px` });
                break;
            case 3:
                configs.push({ left: '0px', top: '0px', width: `${hw}px`, height: `${h}px` }, { left: `${hw}px`, top: '0px', width: `${hw}px`, height: `${hh}px` }, { left: `${hw}px`, top: `${hh}px`, width: `${hw}px`, height: `${hh}px` });
                break;
            case 4:
                configs.push({ left: `${hw}px`, top: '0px', width: `${hw}px`, height: `${h}px` }, { left: '0px', top: '0px', width: `${hw}px`, height: `${hh}px` }, { left: '0px', top: `${hh}px`, width: `${hw}px`, height: `${hh}px` });
                break;
            case 5:
                configs.push({ left: '0px', top: '0px', width: `${hw}px`, height: `${hh}px` }, { left: `${hw}px`, top: '0px', width: `${hw}px`, height: `${hh}px` }, { left: '0px', top: `${hh}px`, width: `${hw}px`, height: `${hh}px` }, { left: `${hw}px`, top: `${hh}px`, width: `${hw}px`, height: `${hh}px` });
                break;
            case 6:
                const rightColWidth6 = w * 0.1573605;
                const leftColWidth6 = w * 0.429875;
                const middleColWidth6 = w * 0.4127645;
                const middleColStart6 = leftColWidth6;
                const rightColStart6 = leftColWidth6 + middleColWidth6;
    
                configs.push({ left: '0px', top: '0px', width: `${leftColWidth6}px`, height: `${h}px` });
                configs.push({ left: `${middleColStart6}px`, top: '0px', width: `${middleColWidth6}px`, height: `${h}px` });
                configs.push({ left: `${rightColStart6}px`, top: '0px', width: `${rightColWidth6}px`, height: `${hh}px` });
                configs.push({ left: `${rightColStart6}px`, top: `${hh}px`, width: `${rightColWidth6}px`, height: `${hh}px` });
                break;
            case 7:
                const rightColWidth7 = w * 0.1573605;
                const leftColWidth7 = w * 0.429875;
                const middleColWidth7 = w * 0.4127645;
                const middleColStart7 = leftColWidth7;
                const rightColStart7 = leftColWidth7 + middleColWidth7;

                configs.push({ left: '0px', top: '0px', width: `${leftColWidth7}px`, height: `${h}px` });
                configs.push({ left: `${middleColStart7}px`, top: '0px', width: `${middleColWidth7}px`, height: `${hh}px` });
                configs.push({ left: `${middleColStart7}px`, top: `${hh}px`, width: `${middleColWidth7}px`, height: `${hh}px` });
                configs.push({ left: `${rightColStart7}px`, top: '0px', width: `${rightColWidth7}px`, height: `${hh}px` });
                configs.push({ left: `${rightColStart7}px`, top: `${hh}px`, width: `${rightColWidth7}px`, height: `${hh}px` });
                break;
        }
        createWinArrangement(configs);
        if (showAnim) {
            showOverlay(String(layoutId));
        }
    }

    // These functions need to be accessible to buildInfoWindow and the new global update function.
    // We define them here, within the main DOMContentLoaded scope.
    let infoWindowElements = {}; // To hold references to the info window's DOM elements

    const renderInfoTextForWindow = (langCode) => {
        if (!infoWindowElements.wrapper) return;
        const t = infoTranslations[langCode] || infoTranslations['en'];
        let htmlContent = `<img src="ttlogo.png" alt="Teacher Toybox Logo" class="info-window-logo"><h2>${t.title}</h2><p>${t.subtitle}</p>`;
        for (let i = 1; i <= 4; i++) {
            if (t[`section${i}_title`]) {
                htmlContent += `<h3>${t[`section${i}_title`]}</h3><ul>`;
                t[`section${i}_points`].forEach(point => {
                    const parts = point.split(/:(.+)/s);
                    htmlContent += `<li><strong>${parts[0]}:</strong> ${parts.length > 1 ? parts[1].trim() : ''}</li>`;
                });
                htmlContent += `</ul>`;
            }
        }
        htmlContent += `<p><em>${t.conclusion}</em></p>`;
        infoWindowElements.wrapper.innerHTML = htmlContent;
    };

    const fitInfoWindowText = () => {
        if (!infoWindowElements.wrapper) return;
        infoWindowElements.wrapper.style.fontSize = '';
    
        let minSize = 8;
        let maxSize = parseFloat(window.getComputedStyle(infoWindowElements.wrapper).fontSize);
        let finalSize = minSize;
    
        for (let i = 0; i < 10; i++) {
            let midSize = (minSize + maxSize) / 2;
            infoWindowElements.wrapper.style.fontSize = `${midSize}px`;
    
            if (infoWindowElements.wrapper.scrollHeight > infoWindowElements.wrapper.clientHeight) {
                maxSize = midSize;
            } else {
                finalSize = midSize;
                minSize = midSize;
            }
        }
        infoWindowElements.wrapper.style.fontSize = `${finalSize}px`;
    };

    // This new global function allows the main translation script to update the info window
    window.TT.updateInfoWindowLanguage = (lang) => {
        const infoWindow = document.querySelector('.info-content-wrapper');
        if (infoWindow) { // Only run if the info window is open
            renderInfoTextForWindow(lang);
            fitInfoWindowText();
        }
    };

    function buildInfoWindow(showAnim = true) {
        clearWins();
        const w = createWin();
        const currentSidebarWidth = getSidebarWidth();
        w.style.left = '0px';
        w.style.top = '0px';
        w.style.width = `${window.innerWidth - currentSidebarWidth}px`;
        w.style.height = `${window.innerHeight}px`;
        w.style.resize = 'none';
        w.style.borderRadius = '0';
    
        const bar = w.querySelector('.drag-bar');
        if (bar) bar.style.display = 'none';

        const winSidebar = w.querySelector('.win-sidebar');
        if (winSidebar) winSidebar.style.display = 'none';
        
        const mainArea = w.querySelector('.win-main-area');
        if (mainArea) {
            mainArea.innerHTML = '';
            mainArea.style.padding = '0';
            mainArea.style.overflow = 'hidden';

            // *** NEW: Add a dedicated close button ***
            const closeBtn = document.createElement('button');
            closeBtn.className = 'info-window-close-btn';
            closeBtn.innerHTML = '&times;';
            closeBtn.title = 'Close';
            closeBtn.onclick = closeInfoIfOpen;
            mainArea.appendChild(closeBtn);
        }
    
        const v = document.createElement('div');
        v.className = 'content-fill';
        v.style.height = '100%';
        v.style.position = 'relative';
    
        const infoWrapper = document.createElement('div');
        infoWrapper.className = 'info-content-wrapper';
    
        // Store references to the new elements for the global update function
        infoWindowElements.wrapper = infoWrapper;
        
        // Render the initial text based on the currently selected language
        const initialLang = localStorage.getItem('ttx_lang') || 'en';
        renderInfoTextForWindow(initialLang);

        v.append(infoWrapper);
        if(mainArea) mainArea.appendChild(v);
    
        setTimeout(() => {
            infoWrapper.classList.add('info-fade-in');
        }, 10);
    
        if (mainArea) {
            const resizeObserver = new ResizeObserver(() => {
                requestAnimationFrame(fitInfoWindowText);
            });
            resizeObserver.observe(mainArea);
            w.toolResizeObserver = resizeObserver;
        }
    
        setTimeout(fitInfoWindowText, 50);
    
        w.onclick = (e) => {
            // Check if the click is on the background (not the content) to close it
            if (e.target === w || e.target === v || e.target === mainArea) {
                 closeInfoIfOpen();
            }
        };
    
        if (showAnim) {
            showOverlay('i');
        }
    }

    $('addButton').onclick = () => {
        const newWin = createWin();
        setActiveWindow(newWin);
        showOverlay('+');
        layoutState.activeLayout = null;
        localStorage.removeItem('ttx_lastLayout');
    };

    document.querySelectorAll('[id^="layout"][id$="Button"]').forEach(button => {
        button.onclick = () => {
            const layoutId = parseInt(button.id.match(/\d+/)[0]);
            handleLayout(layoutId, () => buildAndShowLayout(layoutId));
        };
    });

    $('colorButton').onclick = () => {
        if (closeInfoIfOpen()) return;
        $('colorPicker').click();
        layoutState.activeLayout = null;
        localStorage.removeItem('ttx_lastLayout');
    };
    
    const colorPalette = $('color-palette');
    const themePaletteButton = $('themePaletteButton');
    if (themePaletteButton) {
        themePaletteButton.onclick = (e) => {
            e.stopPropagation();
            if (closeInfoIfOpen()) return;
            colorPalette.classList.toggle('hidden');
        };
    }
    
    if (colorPalette) {
        colorPalette.addEventListener('click', (e) => {
            if (e.target.classList.contains('palette-swatch')) {
                const newColor = e.target.dataset.color;
                if (newColor) {
                    applyAccentColor(newColor);
                    localStorage.setItem('ttx_accentColor', newColor);
                    colorPalette.classList.add('hidden');
                }
            }
        });
    }

    $('colorPicker').oninput = e => {
        if (closeInfoIfOpen()) return;
        const newColor = e.target.value;
        applyAccentColor(newColor);
        localStorage.setItem('ttx_accentColor', newColor);
        layoutState.activeLayout = null;
    };

    function applyAccentColor(color) {
        document.documentElement.style.setProperty('--accent-color', color);
        document.body.classList.toggle('custom-color', color.toLowerCase() !== defaultAccentColor.toLowerCase());
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        document.documentElement.style.setProperty('--accent-color-rgb', `${r}, ${g}, ${b}`);
    }

    const originalColorButton = $('originalColorButton');
    if (originalColorButton) {
        originalColorButton.onclick = () => {
            if (closeInfoIfOpen()) return;
            applyAccentColor(defaultAccentColor);
            localStorage.setItem('ttx_accentColor', defaultAccentColor);
            showOverlay('↺');
            layoutState.activeLayout = null;
        };
    }

    let lastMagicClick = 0;
    $('magicColorButton').onclick = async() => {
        if (closeInfoIfOpen()) return;
        const now = Date.now();
        if (now - lastMagicClick < 300) {
            applyAccentColor(defaultAccentColor);
            localStorage.setItem('ttx_accentColor', defaultAccentColor);
            showOverlay('↺');
            lastMagicClick = 0;
            layoutState.activeLayout = null;
            return;
        }
        lastMagicClick = now;
        const colorCounts = new Map();
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        const sources = document.querySelectorAll('.floating:not(.hidden) img, .floating:not(.hidden) canvas');
        if (sources.length === 0) {
            showOverlay('?');
            return;
        }
        showOverlay('...');
        for (const el of sources) {
            try {
                if (el.tagName === 'IMG') {
                    if (!el.complete) await new Promise(resolve => { el.onload = resolve; });
                    tempCanvas.width = el.naturalWidth;
                    tempCanvas.height = el.naturalHeight;
                } else {
                    tempCanvas.width = el.width;
                    tempCanvas.height = el.height;
                }

                const isLightMode = document.body.classList.contains('light-mode');
                const bgColor = isLightMode ? '#FFFFFF' : '#333'; 
                tempCtx.fillStyle = bgColor;
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                tempCtx.drawImage(el, 0, 0);
                
                const data = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
                for (let i = 0; i < data.length; i += 20) {
                    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
                    if (a < 128 || (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) || (r < 20 && g < 20 && b < 20) || (r > 235 && g > 235 && b > 235)) {
                        continue;
                    }
                    const quantR = r >> 4,
                        quantG = g >> 4,
                        quantB = b >> 4;
                    const key = `${quantR},${quantG},${quantB}`;
                    colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
                }
            } catch (err) {
                console.error("Could not process element for color extraction:", err);
            }
        }
        if (colorCounts.size === 0) {
            showOverlay('?');
            return;
        }
        const prominentColorKey = [...colorCounts.entries()].reduce((a, e) => e[1] > a[1] ? e : a)[0];
        const [r, g, b] = prominentColorKey.split(',').map(c => (parseInt(c) << 4) | (parseInt(c)));
        const toHex = c => c.toString(16).padStart(2, '0');
        const finalColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

        applyAccentColor(finalColor);
        localStorage.setItem('ttx_accentColor', finalColor);
        showOverlay('🎨');
        layoutState.activeLayout = null;
    };

    $('bellButton').onclick = () => {
        if (closeInfoIfOpen()) return;
        const s = $('bellSound');
        s.currentTime = 0;
        s.play()
    };
    $('shhButton').onclick = () => {
        if (closeInfoIfOpen()) return;
        const s = $('shhSound');
        s.currentTime = 0;
        s.play().catch(() => {})
    };

    // --- Laser Pointer Module ---
    (function() {
        let isActive = false;
        let laserDotElement = null;

        const updatePosition = (e) => {
            if (!laserDotElement) return;
            // The offset (-10px) centers the 20px dot on the cursor's coordinates.
            const x = e.clientX - 10;
            const y = e.clientY - 10;
            laserDotElement.style.transform = `translate(${x}px, ${y}px)`;
        };

        const turnOn = () => {
            if (isActive) return;
            laserDotElement = document.createElement('div');
            laserDotElement.id = 'laserDot';
            document.body.appendChild(laserDotElement);
            document.addEventListener('pointermove', updatePosition);
            $('laserButton').classList.add('active');
            isActive = true;
        };

        const turnOff = () => {
            if (!isActive) return;
            document.removeEventListener('pointermove', updatePosition);
            if (laserDotElement) {
                laserDotElement.remove();
                laserDotElement = null;
            }
            $('laserButton').classList.remove('active');
            isActive = false;
        };

        const toggle = () => {
            if (closeInfoIfOpen()) return;
            isActive ? turnOff() : turnOn();
        };

        // Assign the toggle function to the button click event.
        const laserButton = $('laserButton');
        if (laserButton) {
            laserButton.onclick = toggle;
        }

        // Expose the turnOff function to the global scope
        global.TT.turnOffLaser = turnOff;
    })();

    $('infoButton').onclick = () => {
        handleLayout('info', () => buildInfoWindow(true));
    };

    function showShareModal() {
        const lang = localStorage.getItem('ttx_lang') || 'en';
        const dict = window.I18N[lang] || window.I18N.en;
        
        const url = "https://www.teachertoybox.com";
        const text = "Check out Teacher Toybox! A free interactive digital whiteboard for classrooms with fun and engaging tools.";
        const title = "Teacher Toybox";
    
        const backdrop = document.createElement('div');
        backdrop.className = 'share-backdrop';
    
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <button class="close-modal-btn">&times;</button>
            <h3 data-i18n="panel.share.title">${window.t(dict, 'panel.share.title')}</h3>
            <p class="share-intro-text">Like this free tool? Help other teachers discover it!</p>
            <div class="share-grid">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="share-grid-btn facebook"><i class="fab fa-facebook-f"></i> Facebook</a>
                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}" target="_blank" class="share-grid-btn twitter"><i class="fab fa-twitter"></i> Twitter</a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}" target="_blank" class="share-grid-btn linkedin"><i class="fab fa-linkedin-in"></i> LinkedIn</a>
                <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}" target="_blank" class="share-grid-btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                 <a href="https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}" target="_blank" class="share-grid-btn reddit"><i class="fab fa-reddit-alien"></i> Reddit</a>
                <a href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}%0A%0A${encodeURIComponent(url)}" class="share-grid-btn email"><i class="fas fa-envelope"></i> Email</a>
            </div>
            <p class="copy-link-heading">Or copy the link</p>
            <div class="copy-link-area">
                <input type="text" value="${url}" readonly>
                <button>Copy Link</button>
            </div>
        `;
        document.body.append(backdrop, modal);
    
        setTimeout(() => {
            backdrop.style.opacity = '1';
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    
        const closeModal = () => {
            backdrop.style.opacity = '0';
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                backdrop.remove();
                modal.remove();
            }, 300);
        };
        
        backdrop.onclick = closeModal;
        modal.querySelector('.close-modal-btn').onclick = closeModal;
        
        const copyBtn = modal.querySelector('.copy-link-area button');
        const urlInput = modal.querySelector('.copy-link-area input');
        
        copyBtn.onclick = () => {
            const showSuccess = () => {
                copyBtn.textContent = 'Copied!';
                copyBtn.style.backgroundColor = 'var(--success-color)';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Link';
                    copyBtn.style.backgroundColor = '';
                }, 2000);
            };
    
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(showSuccess);
            } else {
                urlInput.select();
                document.execCommand('copy');
                showSuccess();
            }
        };
    }

    $('shareButton').onclick = () => {
        if (closeInfoIfOpen()) return;
        showShareModal();
    };

    $('refreshButton').onclick = () => {
        if (global.TT.turnOffLaser) {
            global.TT.turnOffLaser();
        }
        clearWins();
        showOverlay('🗑️');
        layoutState.activeLayout = null;
        localStorage.removeItem('ttx_lastLayout');
    };

    $('extraToolsButton').onclick = (e) => {
        e.stopPropagation();
        if (closeInfoIfOpen()) return;
        $('layout-bar').classList.remove('open');
        $('management-bar').classList.remove('open');
        $('help-bar').classList.remove('open');
        if (upgradePanel) upgradePanel.classList.remove('open');
        $('extra-tools-bar').classList.toggle('open');
    };

    $('screenButton').onclick = (e) => {
        e.stopPropagation();
        if (closeInfoIfOpen()) return;
        $('extra-tools-bar').classList.remove('open');
        $('management-bar').classList.remove('open');
        $('help-bar').classList.remove('open');
        if (upgradePanel) upgradePanel.classList.remove('open');
        $('layout-bar').classList.toggle('open');
    };

    $('managementButton').onclick = (e) => {
        e.stopPropagation();
        if (closeInfoIfOpen()) return;
        $('extra-tools-bar').classList.remove('open');
        $('layout-bar').classList.remove('open');
        $('help-bar').classList.remove('open');
        if (upgradePanel) upgradePanel.classList.remove('open');
        $('management-bar').classList.toggle('open');
    };
    
    $('helpButton').onclick = (e) => {
        e.stopPropagation();
        if (closeInfoIfOpen()) return;
        $('extra-tools-bar').classList.remove('open');
        $('layout-bar').classList.remove('open');
        $('management-bar').classList.remove('open');
        if (upgradePanel) upgradePanel.classList.remove('open');
        $('help-bar').classList.toggle('open');
    };
    
    // --- Upgrade Panel Logic ---
    const upgradeButton = $('upgradeButton');

    if (upgradeButton) upgradeButton.onclick = openUpgradePanel;
    if (closeUpgradeBtn) closeUpgradeBtn.onclick = closeUpgradePanel;
    if (upgradeBackdrop) upgradeBackdrop.onclick = closeUpgradePanel;

    if (panelUpgradeBtn) {
        panelUpgradeBtn.onclick = async () => {
            if (!await auth0Client.isAuthenticated()) {
                login('upgrade'); // Redirects to login with upgrade intent
                return;
            }
            // If already logged in, go straight to checkout
            initiateCheckout();
        };
    }

    // Auto-retract for sliding toolbars
    let layoutTimeout, extraToolsTimeout, managementTimeout, helpTimeout;
    const setupToolbarAutoRetract = (buttonId, barId, timeoutVar) => {
        const button = $(buttonId);
        const bar = $(barId);
        if (!button || !bar) return;

        const startTimer = () => {
            clearTimeout(timeoutVar);
            timeoutVar = setTimeout(() => bar.classList.remove('open'), 2000);
        };
        const cancelTimer = () => clearTimeout(timeoutVar);

        button.addEventListener('mouseleave', startTimer);
        bar.addEventListener('mouseleave', startTimer);
        button.addEventListener('mouseenter', cancelTimer);
        bar.addEventListener('mouseenter', cancelTimer);
    };

    setupToolbarAutoRetract('screenButton', 'layout-bar', layoutTimeout);
    setupToolbarAutoRetract('extraToolsButton', 'extra-tools-bar', extraToolsTimeout);
    setupToolbarAutoRetract('managementButton', 'management-bar', managementTimeout);
    setupToolbarAutoRetract('helpButton', 'help-bar', helpTimeout);
    
    // Feedback Panel Logic
    const feedbackButton = $('feedbackButton');
    const feedbackPanel = $('feedback-panel');
    const feedbackBackdrop = $('feedback-backdrop');
    const closeFeedbackBtn = $('close-feedback-btn');
    const stars = document.querySelectorAll('.star-rating .fas');
    const submitFeedbackBtn = $('submit-feedback-btn');

    let currentRating = 0;

    function openFeedbackPanel() {
        if(feedbackBackdrop && feedbackPanel) {
            feedbackBackdrop.classList.remove('hidden');
            feedbackPanel.classList.add('open');
        }
    }

    function closeFeedbackPanel() {
        if(feedbackPanel && feedbackBackdrop) {
            const currentLang = localStorage.getItem('ttx_lang') || 'en';
            feedbackPanel.classList.remove('open');
            feedbackBackdrop.classList.add('hidden');
            setTimeout(() => {
                $('feedback-comment').value = '';
                currentRating = 0;
                updateStars();
                submitFeedbackBtn.disabled = false;
                submitFeedbackBtn.style.backgroundColor = '';
                submitFeedbackBtn.textContent = window.t(window.I18N[currentLang], 'panel.feedback.submitButton') || 'Submit';
            }, 400);
        }
    }

    function updateStars() {
        stars.forEach(star => {
            if (parseInt(star.dataset.value) <= currentRating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }

    if (feedbackButton) feedbackButton.onclick = openFeedbackPanel;
    if (closeFeedbackBtn) closeFeedbackBtn.onclick = closeFeedbackPanel;
    if (feedbackBackdrop) feedbackBackdrop.onclick = closeFeedbackPanel;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.value);
            updateStars();
        });
    });
    
    if (submitFeedbackBtn) {
        submitFeedbackBtn.onclick = async () => {
            const comment = $('feedback-comment').value;
            if (currentRating === 0 && !comment.trim()) {
                alert('Please provide a rating or a comment.');
                return;
            }
            const currentLang = localStorage.getItem('ttx_lang') || 'en';

            submitFeedbackBtn.disabled = true;
            submitFeedbackBtn.textContent = window.t(window.I18N[currentLang], 'panel.feedback.submitButtonSending') || 'Sending...';

            const formData = new FormData();
            formData.append('rating', currentRating);
            formData.append('comment', comment);
            try {
                const response = await fetch('https://formspree.io/f/xovloydp', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    submitFeedbackBtn.textContent = window.t(window.I18N[currentLang], 'panel.feedback.submitButtonSuccess') || 'Thank You!';
                    submitFeedbackBtn.style.backgroundColor = 'var(--success-color)';
                    setTimeout(closeFeedbackPanel, 1500);
                } else { throw new Error('Form submission failed'); }
            } catch (error) {
                console.error('Error submitting feedback:', error);
                alert('Sorry, there was an error sending your feedback.');
                submitFeedbackBtn.disabled = false;
                submitFeedbackBtn.textContent = window.t(window.I18N[currentLang], 'panel.feedback.submitButton') || 'Submit';
            }
        };
    }


    document.addEventListener('keydown', e => {
        const activeWin = document.querySelector('.floating.active-window');
        const focusedElement = document.activeElement;
        const isEditing = focusedElement && (focusedElement.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(focusedElement.tagName));

        if (e.key === 'Delete' && !isEditing) {
            e.preventDefault();
            clearWins();
            hotkeysEnabled = true;
            showOverlay('🗑️');
            layoutState.activeLayout = null;
            localStorage.removeItem('ttx_lastLayout');
            return;
        }
        
        if (e.key === 'Backspace' && !isEditing) {
            e.preventDefault();
            if (activeWin) {
                activeWin.querySelector('.close-btn')?.click();
            }
            return;
        }

        if (activeWin && activeWin.classList.contains('timer-is-running')) {
            if (e.key === 'Enter') {
                e.preventDefault();
                activeWin.querySelector('.timer-start-pause-btn')?.click();
            } else if (e.code === 'Space' && !isEditing) {
                e.preventDefault();
                activeWin.querySelector('.timer-reset-btn')?.click();
            }
        }
        
        if (!hotkeysEnabled || isEditing) return;

        if (e.key === '`') {
            document.querySelectorAll('.hotkey-label').forEach(l => l.style.display = (l.style.display === 'block' ? 'none' : 'block'));
            return;
        }
        
        const toolKeys = ['d', 't', '0', 'w', 'v', 'o', 'h', 'g', 'a', 'u'];
        if (toolKeys.includes(e.key.toLowerCase())) {
            if (activeWin) {
                activeWin.querySelector(`.win-sidebar [data-hotkey="${e.key.toLowerCase()}"]`)?.click();
                return;
            }
        }
        if (e.key.toLowerCase() === 'i' && activeWin) {
            activeWin.querySelector('.upload-btn')?.click();
            return;
        }
        if (e.key.toLowerCase() === 'e' && activeWin) {
            activeWin.querySelector('.reset-content-btn')?.click();
            return;
        }

        const resizeKeyMap = { 'q': 0, '8': 1, '9': 2 };
        if (resizeKeyMap.hasOwnProperty(e.key.toLowerCase())) {
            if (activeWin) {
                const resizeButtons = activeWin.querySelectorAll('.resize-btn');
                const buttonIndex = resizeKeyMap[e.key.toLowerCase()];
                if (resizeButtons[buttonIndex]) {
                    resizeButtons[buttonIndex].click();
                }
            }
            return;
        }
        
        if (e.key === 'PageDown' && activeWin) {
            const sendBackButton = activeWin.querySelector('.resize-btn[title*="Send to Back"]');
            sendBackButton?.click();
            return;
        }

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            if (!activeWin) return;

            const sidebarW = getSidebarWidth();
            const winW = window.innerWidth - sidebarW;
            const winH = window.innerHeight;
            const halfW = winW / 2;
            const halfH = winH / 2;

            const tolerance = 10;
            const isQuarter = Math.abs(activeWin.offsetWidth - halfW) < tolerance && Math.abs(activeWin.offsetHeight - halfH) < tolerance;
            const isHalfV = Math.abs(activeWin.offsetWidth - halfW) < tolerance && Math.abs(activeWin.offsetHeight - winH) < tolerance;
            const isHalfH = Math.abs(activeWin.offsetWidth - winW) < tolerance && Math.abs(activeWin.offsetHeight - halfH) < tolerance;
            
            if (!isQuarter && !isHalfV && !isHalfH) return;

            const currentX = activeWin.offsetLeft;
            const currentY = activeWin.offsetTop;
            
            const onLeftHalf = currentX < tolerance;
            const onRightHalf = Math.abs(currentX - halfW) < tolerance;
            const onTopHalf = currentY < tolerance;
            const onBottomHalf = Math.abs(currentY - halfH) < tolerance;

            if (isHalfV) {
                if (e.key === 'ArrowRight' && onLeftHalf) {
                    activeWin.style.left = `${halfW}px`;
                } else if (e.key === 'ArrowLeft' && onRightHalf) {
                    activeWin.style.left = '0px';
                }
            } else if (isHalfH) {
                if (e.key === 'ArrowDown' && onTopHalf) {
                    activeWin.style.top = `${halfH}px`;
                } else if (e.key === 'ArrowUp' && onBottomHalf) {
                    activeWin.style.top = '0px';
                }
            } else if (isQuarter) {
                if (e.key === 'ArrowRight' && onLeftHalf) {
                    activeWin.style.left = `${halfW}px`;
                } else if (e.key === 'ArrowLeft' && onRightHalf) {
                    activeWin.style.left = '0px';
                } else if (e.key === 'ArrowDown' && onTopHalf) {
                    activeWin.style.top = `${halfH}px`;
                } else if (e.key === 'ArrowUp' && onBottomHalf) {
                    activeWin.style.top = '0px';
                }
            }
            return;
        }

        const mainKeyMap = { 
            'n': 'addButton', 
            '1': 'layout1Button', '2': 'layout2Button', '3': 'layout3Button', '4': 'layout4Button', '5': 'layout5Button', '6': 'layout6Button', '7': 'layout7Button',
            'c': 'colorButton', 'm': 'magicColorButton', 'b': 'bellButton', 's': 'shhButton', 
            'p': 'laserButton', '/': 'managementButton', 'r': 'refreshButton', 'x': 'extraToolsButton', 
            'l': 'screenButton', 'k': 'clockButton', 'j': 'shareButton', 'f': 'feedbackButton',
            'z': 'themePaletteButton', '?': 'helpButton', 'u': 'upgradeButton'
        };

        const key = e.key.toLowerCase();
        if (mainKeyMap[key]) {
            if (key === 'r' && (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)) {
                return;
            }
    
            e.preventDefault();
            $(mainKeyMap[key])?.click();
        } else if (key === 'y') {
            e.preventDefault();
            const coffeeLink = document.querySelector('.buyme-button');
            if (coffeeLink) coffeeLink.click();
        }
    });

    let resizeDebounceTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeDebounceTimeout);
        resizeDebounceTimeout = setTimeout(() => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            const sidebarW = getSidebarWidth();
            const oldUsableWidth = lastWindowWidth - sidebarW;
            const newUsableWidth = newWidth - sidebarW;

            document.querySelectorAll('.floating').forEach(win => {
                if (win.querySelector('.info-content-wrapper')) {
                    win.style.width = `${newUsableWidth}px`;
                    win.style.height = `${newHeight}px`;
                    return;
                }
                
                const oldRelX = win.offsetLeft / oldUsableWidth;
                const oldRelY = win.offsetTop / lastWindowHeight;
                const oldRelW = win.offsetWidth / oldUsableWidth;
                const oldRelH = win.offsetHeight / lastWindowHeight;

                win.style.left = `${oldRelX * newUsableWidth}px`;
                win.style.top = `${oldRelY * newHeight}px`;
                win.style.width = `${oldRelW * newUsableWidth}px`;
                win.style.height = `${oldRelH * newHeight}px`;
            });

            lastWindowWidth = newWidth;
            lastWindowHeight = newHeight;
        }, 100);
    });

    function loadSettings() {
        const savedColor = localStorage.getItem('ttx_accentColor');
        if (savedColor) {
            applyAccentColor(savedColor);
            $('colorPicker').value = savedColor;
        }
        
        const savedTheme = localStorage.getItem('ttx_theme');
        const themeToggleInput = document.getElementById('theme-toggle');
        if (themeToggleInput) {
            if (savedTheme === 'light') {
                themeToggleInput.checked = true;
                document.body.classList.add('light-mode');
            }
        }

        const savedLayout = localStorage.getItem('ttx_lastLayout');
        if (savedLayout) {
            const layoutButton = $(`layout${savedLayout}Button`);
            if (layoutButton) {
                layoutButton.click();
            }
        }
    }

    loadSettings();

    document.body.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('.floating[data-disables-hotkeys="true"]')) {
            hotkeysEnabled = true;
        }
    
        // Check if the click is on the background or title, but NOT on the language picker.
        const isClickOnLangPicker = e.target.closest('#lang-picker-wrap');
        if (isClickOnLangPicker) {
            return; // Exit the function early if the language picker was clicked.
        }

        if (e.target === document.body || e.target.closest('#site-title')) {
            document.body.classList.toggle('no-grid');
    
            if (e.target.closest('#site-title')) {
                applyAccentColor(defaultAccentColor);
                localStorage.setItem('ttx_accentColor', defaultAccentColor);
                showOverlay('↺');
            }
        }
    });
    
    document.addEventListener('click', (e) => {
        // Close all slide-out panels if the click is outside of the interactive areas
        const isClickInsideSidebar = e.target.closest('#sidebar-main-controls');
        const isClickInsideFeedbackPanel = e.target.closest('#feedback-panel');
        const isClickInsideUpgradePanel = e.target.closest('#upgrade-panel');

        if (!isClickInsideSidebar && !isClickInsideFeedbackPanel && !isClickInsideUpgradePanel) {
            // Close simple toolbars
            if($('layout-bar')) $('layout-bar').classList.remove('open');
            if($('management-bar')) $('management-bar').classList.remove('open');
            if($('extra-tools-bar')) $('extra-tools-bar').classList.remove('open');
            if($('help-bar')) $('help-bar').classList.remove('open');

            // Use the dedicated close functions to also hide the backdrops
            closeUpgradePanel();
            closeFeedbackPanel();
            
            // Close color palettes
            document.querySelectorAll('.custom-color-palette, #color-palette').forEach(p => {
                if (p) p.classList.add('hidden');
            });
        }
    });
        
    (function() {
      let demoOpen = false;
      let demoJustClosedAt = 0;
      let backdrop, modal, video;
    
      function closeDemoModal() {
        demoJustClosedAt = Date.now();
        if (!demoOpen) return;
        demoOpen = false;
        try { modal && modal.remove(); } catch(e) {}
        try { backdrop && backdrop.remove(); } catch(e) {}
        const btn = document.getElementById('demoButton');
        if (btn) btn.classList.remove('active');
      }
    
      function openDemoModal() {
        if (demoOpen) return;
        demoOpen = true;
    
        backdrop = document.createElement('div');
        backdrop.className = 'demo-backdrop';
        backdrop.style.cssText = 'position:fixed;inset:0;background:transparent;z-index:9998;'
    
        modal = document.createElement('div');
        modal.className = 'demo-modal';
        modal.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:75vw;height:75vh;display:flex;align-items:center;justify-content:center;z-index:9999;'
    
        video = document.createElement('video');
        const source = document.createElement('source');
        source.src = 'demo.mp4';
        source.type = 'video/mp4';
        video.appendChild(source);
        video.controls = true;
        video.playsInline = true;
        video.style.cssText = 'width:100%;height:100%;object-fit:contain;border-radius:12px;';
    
        modal.appendChild(video);
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);
    
        const tryPlay = async () => {
          try { await video.play(); }
          catch (err) { try { video.muted = true; await video.play(); } catch (e2) {} }
        };
        video.addEventListener('loadedmetadata', tryPlay);
        tryPlay();
    
        const passThrough = (ev) => {
          const x = ev.clientX, y = ev.clientY;
          ev.preventDefault();
          ev.stopPropagation();
          closeDemoModal();
          setTimeout(() => {
            const el = document.elementFromPoint(x, y);
            if (!el) return;
            try { el.dispatchEvent(new PointerEvent('pointerdown', { bubbles:true, cancelable:true, clientX:x, clientY:y, pointerType:'mouse' })); } catch(e) {}
            try { el.dispatchEvent(new MouseEvent('mousedown', { bubbles:true, cancelable:true, clientX:x, clientY:y })); } catch(e) {}
            try { el.dispatchEvent(new MouseEvent('mouseup', { bubbles:true, cancelable:true, clientX:x, clientY:y })); } catch(e) {}
            el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, clientX:x, clientY:y }));
          }, 0);
        };
    
        backdrop.addEventListener('pointerdown', passThrough, { capture:true });
        backdrop.addEventListener('mousedown', passThrough, { capture:true });
        backdrop.addEventListener('click', passThrough, { capture:true });
    
        modal.addEventListener('click', closeDemoModal);
      }
    
      const demoBtn = document.getElementById('demoButton');
      if (demoBtn) {
          const replacement = demoBtn.cloneNode(true);
          demoBtn.parentNode.replaceChild(replacement, demoBtn);
          replacement.addEventListener('click', (e) => {
              e.stopPropagation();
              if (!demoOpen) {
                  if (Date.now() - demoJustClosedAt < 200) return;
                  replacement.classList.add('active');
                  openDemoModal();
              } else {
                  closeDemoModal();
              }
          });
      }
    })();
    
    // Original premium logic was here, moved to auth.js and a new upgrade button in index.html
    // Old premiumSidebarButtons array removed.
    
    // Listen for the custom event from auth.js
    document.addEventListener('postLoginAction', (e) => {
        if (e.detail === 'upgrade') {
            // The user just logged in with the intent to upgrade.
            // Instead of showing the panel again, proceed directly to checkout.
            setTimeout(() => {
                initiateCheckout();
            }, 500); // 500ms delay to ensure UI is ready
        }
    });
});
=======
const _0x83527d=_0x22b5;(function(_0x121532,_0x37defb){const _0x3f30da=_0x22b5,_0x473547=_0x121532();while(!![]){try{const _0x55e6df=-parseInt(_0x3f30da(0x311))/0x1*(parseInt(_0x3f30da(0x239))/0x2)+parseInt(_0x3f30da(0x1ec))/0x3+parseInt(_0x3f30da(0x274))/0x4*(parseInt(_0x3f30da(0x292))/0x5)+parseInt(_0x3f30da(0x29a))/0x6+-parseInt(_0x3f30da(0x37c))/0x7*(parseInt(_0x3f30da(0x24b))/0x8)+-parseInt(_0x3f30da(0x252))/0x9+-parseInt(_0x3f30da(0x260))/0xa*(parseInt(_0x3f30da(0x3b3))/0xb);if(_0x55e6df===_0x37defb)break;else _0x473547['push'](_0x473547['shift']());}catch(_0x3910a4){_0x473547['push'](_0x473547['shift']());}}}(_0x5c3e,0xc9621));const global=window;function _0x22b5(_0x368a84,_0x530545){const _0x5c3eb9=_0x5c3e();return _0x22b5=function(_0x22b571,_0x497e28){_0x22b571=_0x22b571-0x1df;let _0x3cf346=_0x5c3eb9[_0x22b571];return _0x3cf346;},_0x22b5(_0x368a84,_0x530545);}function _0x5c3e(){const _0x1be06c=['observe','gap','px,\x20','Choose\x20Timer\x20Duration','close','src','center','icon-btn\x20timer-reset-btn','createObjectURL','dataset','.custom-color-palette,\x20#color-palette','top','from','fill','source','Error\x20redirecting\x20to\x20checkout:','.minute-hand','min','isPremium','layout','</h3><ul>','premium-feature','.drag-bar','layout4Button','change','deg)','.ppt','onpointerdown','translate(-50%,\x20-50%)\x20scale(1.5)','display','writeText','panel-upgrade-btn','removeEventListener','Snap\x20to\x20Quadrant\x20(Q)','Erase\x20Content\x20(E)','getUserMedia','80px','nwse-resize','date-enlarged','innerWidth','getItem','translate(-50%,\x20-50%)\x20scale(1)','transform','closest','clockButton','open','background','#007AFF','color-swatch','\x22\x20target=\x22_blank\x22\x20class=\x22share-grid-btn\x20linkedin\x22><i\x20class=\x22fab\x20fa-linkedin-in\x22></i>\x20LinkedIn</a>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<a\x20href=\x22https://api.whatsapp.com/send?text=','transition','stopwatch-controls','anonymous','window-management-controls','#000000','#5AC8FA','POST','rotate(','position','createElement','seconds','layout-bar','.floating.active-window','draw','<li><strong>','endsWith','objectFit','.star-rating\x20.fas','none','71821AqMISQ','fillStyle','type','content-fill','#FF3B30','flex','.win-sidebar','split','extraToolsButton','addEventListener','demo-backdrop','offsetWidth','For','date-backdrop','<i\x20class=\x22fas\x20fa-undo\x22></i>','...','hidden','magicColorButton','setProperty','originalColorButton','left','90%','Check\x20out\x20Teacher\x20Toybox!\x20A\x20free\x20interactive\x20digital\x20whiteboard\x20for\x20classrooms\x20with\x20fun\x20and\x20engaging\x20tools.','.close-modal-btn','bellButton','#AF52DE','padding','className','createElementNS','shareButton','overflow','toolResizeObserver','video','<i\x20class=\x22fas\x20fa-arrow-right\x22></i>','play','button','pen-btn','Backspace','get','pop','\x22\x20target=\x22_blank\x22\x20class=\x22share-grid-btn\x20twitter\x22><i\x20class=\x22fab\x20fa-twitter\x22></i>\x20Twitter</a>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<a\x20href=\x22https://www.linkedin.com/shareArticle?mini=true&url=','var(--danger-color)','.draw-controls-bar','Send\x20to\x20Back\x20(PageDown)','span','.die','full','tool-controls','16px','video/mp4','absolute','innerText','laserButton','fillRect','layout3Button','_points','colorButton','px)','disablesHotkeys','toString','palette-swatch','stopPropagation','refreshButton','flex-grow:\x201;\x20position:\x20relative;\x20width:\x20100%;\x20display:\x20flex;\x20align-items:\x20center;\x20justify-content:\x20center;',':</strong>\x20','share-modal','postLoginAction','padStart','offsetLeft','circle','40px','setAttribute','tan','scrollHeight','Numbered\x20List\x20(0)','15\x20min','clientWidth','ArrowRight','info-fade-in','<i\x20class=\x22fas\x20fa-pencil-alt\x22></i>','querySelectorAll','input','<i\x20class=\x22fas\x20fa-sync-alt\x22></i>','backgroundColor','\x22\x20target=\x22_blank\x22\x20class=\x22share-grid-btn\x20reddit\x22><i\x20class=\x22fab\x20fa-reddit-alien\x22></i>\x20Reddit</a>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<a\x20href=\x22mailto:?subject=','1\x20min','preventDefault','checked','isAuthenticated','map','application/json','fas\x20fa-camera','match','ew-resize','naturalWidth','Delete','PageDown','calc-input','\x22></i>','carousel-controls','disconnect','premium','pointerup','width','appendChild','Space','demoButton','7fqfCRY','getComputedStyle','Reset\x20Timer\x20(Spacebar)','stroke-dashoffset\x201s\x20linear','contentEditable','100%','canvas','<i\x20class=\x22fas\x20fa-minus\x22></i>','trim','[id^=\x22layout\x22][id$=\x22Button\x22]','Calculator\x20(U)','.win-main-area','mousedown','abs','win-main-area','svg','target','die-container','helpButton','Math.sqrt','#FFFFFF','ns-resize','active-window','.floating:not(.hidden)\x20img,\x20.floating:not(.hidden)\x20canvas','annotation-canvas','price_1RyXtBFCA6YfGQJz7BUMxTQo','layout5Button','resize','hotkey-label','Files','INPUT','</ul>','</h3>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20class=\x22share-intro-text\x22>Like\x20this\x20free\x20tool?\x20Help\x20other\x20teachers\x20discover\x20it!</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22share-grid\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<a\x20href=\x22https://www.facebook.com/sharer/sharer.php?u=','block','icon-btn','carousel-btn','position:fixed;inset:0;background:transparent;z-index:9998;','Import\x20File\x20(I)','ttx_lastLayout','true','borderRadius','calc-expression','</h2><p>','h-half','🗑️','append','countdown-selection-grid','content','shhSound','Against','50%','image/*','playsInline','carousel-placeholder','\x22\x20class=\x22share-grid-btn\x20email\x22><i\x20class=\x22fas\x20fa-envelope\x22></i>\x20Email</a>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20class=\x22copy-link-heading\x22>Or\x20copy\x20the\x20link</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22copy-link-area\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22text\x22\x20value=\x22','10075681XrEGYj','tooltip','%0A%0A','--accent-color-rgb','cloneNode','classList','disabled','Snap\x20to\x20Fullscreen','countdown-btn','</p>','active','size','redirectToCheckout','<i\x20class=\x22fas\x20fa-pause\x22></i>','icon-btn\x20text-editor-control-btn','date-display','draw-controls-bar','For/Against\x20Counter\x20(A)','splash-screen','no-grid','boxSizing','I18N','fas\x20fa-plus','Math.PI','data-tool','feedback-comment','stopwatch-display','dragover','tool','rotate(-90deg)','\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22drop-zone-inner\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<i\x20class=\x22drop-zone-icon\x20fas\x20fa-upload\x22></i>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22drop-zone-file-types\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<i\x20class=\x22fas\x20fa-file-image\x22></i><i\x20class=\x22fas\x20fa-file-video\x22></i><i\x20class=\x22fas\x20fa-file-audio\x22></i><i\x20class=\x22fas\x20fa-file-pdf\x22></i>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>','send-back','rolling','#D90429','controls','.copy-link-area\x20button','\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20Dice\x20Roller\x20Styles\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20.die-container\x20{\x20display:\x20flex;\x20flex-wrap:\x20wrap;\x20gap:\x202rem;\x20justify-content:\x20center;\x20align-items:\x20center;\x20flex-grow:\x201;\x20padding:\x2010px;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.die\x20{\x20width:\x2010rem;\x20height:\x2010rem;\x20background-color:\x20white;\x20border-radius:\x208px;\x20padding:\x206px;\x20display:\x20grid;\x20grid-template-columns:\x20repeat(3,\x201fr);\x20grid-template-rows:\x20repeat(3,\x201fr);\x20gap:\x204px;\x20box-shadow:\x20inset\x200\x202px\x204px\x20rgba(0,0,0,0.2);\x20border:\x202px\x20solid\x20black;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.die\x20.die-dot\x20{\x20visibility:\x20hidden;\x20width:\x20100%;\x20height:\x20100%;\x20background-color:\x20black;\x20border-radius:\x2050%;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.die[data-value=\x221\x22]\x20.dot-5,\x0a\x20\x20\x20\x20\x20\x20\x20\x20.die[data-value=\x222\x22]\x20.dot-1,\x20.die[data-value=\x222\x22]\x20.dot-9,\x0a\x20\x20\x20\x20\x20\x20\x20\x20.die[data-value=\x223\x22]\x20.dot-1,\x20.die[data-value=\x223\x22]\x20.dot-5,\x20.die[data-value=\x223\x22]\x20.dot-9,\x0a\x20\x20\x20\x20\x20\x20\x20\x20.die[data-value=\x224\x22]\x20.dot-1,\x20.die[data-value=\x224\x22]\x20.dot-3,\x20.die[data-value=\x224\x22]\x20.dot-7,\x20.die[data-value=\x224\x22]\x20.dot-9,\x0a\x20\x20\x20\x20\x20\x20\x20\x20.die[data-value=\x225\x22]\x20.dot-1,\x20.die[data-value=\x225\x22]\x20.dot-3,\x20.die[data-value=\x225\x22]\x20.dot-5,\x20.die[data-value=\x225\x22]\x20.dot-7,\x20.die[data-value=\x225\x22]\x20.dot-9,\x0a\x20\x20\x20\x20\x20\x20\x20\x20.die[data-value=\x226\x22]\x20.dot-1,\x20.die[data-value=\x226\x22]\x20.dot-3,\x20.die[data-value=\x226\x22]\x20.dot-4,\x20.die[data-value=\x226\x22]\x20.dot-6,\x20.die[data-value=\x226\x22]\x20.dot-7,\x20.die[data-value=\x226\x22]\x20.dot-9\x20{\x20visibility:\x20visible;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.dice-controls\x20{\x20display:\x20flex;\x20justify-content:\x20center;\x20align-items:\x20center;\x20gap:\x2012px;\x20padding:\x2012px;\x20background:\x20rgba(0,0,0,0.2);\x20flex-shrink:\x200;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.dice-controls\x20.icon-btn\x20{\x20width:\x2040px;\x20height:\x2040px;\x20font-size:\x2016px;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.dice-total\x20{\x20font-size:\x2018px;\x20font-weight:\x20bold;\x20color:\x20white;\x20min-width:\x2080px;\x20text-align:\x20center;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.die.rolling\x20{\x20animation:\x20roll\x200.5s\x20ease-in-out;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20@keyframes\x20roll\x20{\x200%\x20{\x20transform:\x20rotate(0deg)\x20scale(1);\x20}\x2025%\x20{\x20transform:\x20rotate(15deg)\x20scale(1.1);\x20}\x2075%\x20{\x20transform:\x20rotate(-15deg)\x20scale(1.1);\x20}\x20100%\x20{\x20transform:\x20rotate(0deg)\x20scale(1);\x20}\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20Stopwatch\x20Styles\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20.stopwatch-display\x20{\x20font-size:\x20clamp(3rem,\x2014vw,\x2010rem);\x20font-weight:\x20700;\x20color:\x20white;\x20text-align:\x20center;\x20flex-grow:\x201;\x20display:\x20flex;\x20justify-content:\x20center;\x20align-items:\x20center;\x20font-family:\x20\x27monospace\x27;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.stopwatch-controls\x20{\x20display:\x20flex;\x20justify-content:\x20center;\x20align-items:\x20center;\x20gap:\x2012px;\x20padding:\x2012px;\x20background:\x20rgba(0,0,0,0.2);\x20flex-shrink:\x200;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.stopwatch-controls\x20.icon-btn\x20{\x20width:\x2050px;\x20height:\x2050px;\x20font-size:\x2020px;\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20Countdown\x20Timer\x20Styles\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20.countdown-title\x20{\x20color:\x20var(--text-secondary);\x20font-size:\x201.5rem;\x20font-weight:\x20500;\x20text-align:\x20center;\x20margin-bottom:\x201rem;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.countdown-selection-grid\x20{\x20display:\x20grid;\x20grid-template-columns:\x20repeat(auto-fit,\x20minmax(100px,\x201fr));\x20gap:\x2012px;\x20width:\x20100%;\x20max-width:\x20500px;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.countdown-btn\x20{\x20background-color:\x20var(--sidebar-bg);\x20border:\x201px\x20solid\x20var(--border-color);\x20color:\x20var(--text-primary);\x20padding:\x2020px\x2010px;\x20border-radius:\x208px;\x20font-size:\x201.1rem;\x20font-weight:\x20500;\x20cursor:\x20pointer;\x20transition:\x20background-color\x200.2s\x20ease,\x20border-color\x200.2s\x20ease;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.countdown-btn:hover\x20{\x20background-color:\x20var(--window-bg);\x20border-color:\x20var(--accent-color);\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.countdown-running-controls\x20{\x20display:\x20flex;\x20justify-content:\x20center;\x20align-items:\x20center;\x20gap:\x2012px;\x20padding:\x2012px;\x20flex-shrink:\x200;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.countdown-running-controls\x20.icon-btn\x20{\x20width:\x2050px;\x20height:\x2050px;\x20font-size:\x2020px;\x20}\x0a\x20\x20\x20\x20','activeInterval','panel.share.title','var(','quadrant','dragleave','fas\x20fa-images','slice','number','getContext','beginPath','countdown-title','border-box','now','hasOwnProperty','Math.log10','clientY','transparent','translate(','floating','100','\x22\x20readonly>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button>Copy\x20Link</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20','fas\x20fa-pencil-alt','mouse','entries','rating','sub','parentNode','_title','fas\x20fa-font','keydown','click','oninput','extra-tools-bar','.upload-btn','Clear\x20Annotations','relative','#888888','toggle','custom-color-swatch','column','drop','fas\x20fa-minus','ttx_lang','add','getImageData','paddingRight','zIndex','--accent-color','json','documentElement','Form\x20submission\x20failed','fas\x20fa-stopwatch','clearRect','transformOrigin','onload','management-bar','position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:75vw;height:75vh;display:flex;align-items:center;justify-content:center;z-index:9999;','then','isContentEditable','timer-is-running','<h3>','Sorry,\x20there\x20was\x20an\x20error\x20sending\x20your\x20feedback.','drawingHistory','close-feedback-btn','row','round','dice-controls','icon-btn\x20timer-start-pause-btn','1\x20Hour','execCommand','code','bellSound','random','\x22\x20target=\x22_blank\x22\x20class=\x22share-grid-btn\x20facebook\x22><i\x20class=\x22fab\x20fa-facebook-f\x22></i>\x20Facebook</a>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<a\x20href=\x22https://twitter.com/intent/tweet?url=','types','calc-btn\x20','icon','.for-against-panel','setItem','&title=','shift','toLowerCase','<i\x20class=\x22fas\x20fa-palette\x22></i>','operator','color-palette','srcObject','offsetY','.resize-btn[title*=\x22Send\x20to\x20Back\x22]','is-dragging','floor','.hotkey-label','text','span\x202','/api/create-checkout-session','moveTo','lineTo','cursor','range','onchange','startsWith','annotationCurrentColor','push','getElementById','feedback-panel','equals','theme-toggle','div','feedbackButton','2399949JSsFCt','managementButton','img','00:00.00','Countdown\x20Timer\x20(O)','snapped-window','catch','isVisible','elementFromPoint','win-body','viewBox','#34C759','mousemove','.custom-color-palette','getPropertyValue','accept','submit-feedback-btn','lineWidth','<i\x20class=\x22fas\x20fa-file-arrow-up\x22></i>','fas\x20fa-list-ol','default','contentRect','#FF9500','Drawing\x20Canvas\x20(D)','<i\x20class=\x22fas\x20fa-dice-d6\x22></i>','https://www.teachertoybox.com','feedback-backdrop','flexDirection','lineCap','2\x20min','includes','upgradeButton','style','body','right','naturalHeight','.calc-btn','stroke-dashoffset','#333','width:100%;height:100%;object-fit:contain;border-radius:12px;','onclick','removeAttribute','reduce','lineJoin','name','fas\x20fa-hourglass-start','0px','application/pdf','files','ceil','annotationContext','drop-zone','</li>','.for-against-panel\x20h2','opacity','Error\x20submitting\x20feedback:','resize-btn','set','nesw-resize','long','data','pk_live_51RyVoHFCA6YfGQJzhJ8SlyEuCayZQXmmbpI0AGeJoLGsNIxz1W8qICgjAqrjkJdSnStHH9U9XvFW49x0PnX2Gxyg000uNaxUaF','Snap\x20to\x20Horizontal\x20Half\x20(9)','<i\x20class=\x22','demo-modal','remove','Click\x20the\x20folder\x20icon\x20to\x20select\x20images','<i\x20class=\x22fas\x20fa-plus\x22></i>','ttx_theme','#C1C1C1','<i\x20class=\x22fas\x20fa-play\x22></i>','#site-title','shhButton','blur','v-half','cover','fas\x20fa-calculator','6EvBJOK','Change\x20Color','label','die-dot\x20dot-','&summary=','button,\x20.tool-controls,\x20input,\x20.draw-controls-bar,\x20.window-management-controls','offsetHeight','paddingBottom','--success-color','innerHTML','help-bar','getMinutes','.info-content-wrapper','.date-backdrop','Error','Button','title','#sidebar-main-controls','11042968SXxZMj','carousel-container','textContent','mediaDevices','stroke','annotationResizeObserver','section','3993651PtapYy','image/*,video/*,audio/*,.pdf','Dice\x20Roller\x20(G)','.reset-content-btn','.floating','removeItem','height','colorPicker','IMG','<i\x20class=\x22fas\x20fa-folder-open\x22></i>','.timer-reset-btn','stroke-width','30\x20min','Snap\x20to\x20Vertical\x20Half\x20(8)','10aGByFM','mouseup','activeLayout','toUpperCase','.for-against-controls\x20button','&text=','#lang-picker-wrap','head','mouseenter','pointerleave','key','Math.sin','wrapper','putImageData','light','Thank\x20You!','forEach','altKey','.hour-hand','<i\x20class=\x22fas\x20fa-arrow-left\x22></i>','6323588AAzNZW','video/','contain','image/','ArrowLeft','stringify','Math.tan','tagName','color','dataTransfer','turnOffLaser','complete','pointerdown','innerHeight','var(--success-color)','dispatchEvent','length','metaKey','ArrowUp','.win-sidebar\x20[data-hotkey=\x22','ArrowDown','#4CD964','focus','<p><em>','Text\x20Editor\x20(T)','Close\x20Window\x20(Backspace)','Copy\x20Link','clientHeight','mouseleave','layout6Button','5IvtFkJ','format','error','.color-swatch.active','value','Math.cos','carousel','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22unsupported-file-message\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<i\x20class=\x22fas\x20fa-file-powerpoint\x22></i>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<h3>PowerPoint\x20File</h3>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>To\x20display\x20this\x20file,\x20please\x20convert\x20it\x20to\x20a\x20PDF\x20first\x20and\x20then\x20drop\x20it\x20here.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20','8397174eCoBXX','rgba(255,\x20255,\x20255,\x200.2)','func','.for-against-display','file','10\x20min','pointermove','cos','&nbsp;','muted','contains','annotationCanvas','offsetTop','sin','max','panel.feedback.submitButton','fontSize','function','subtitle','numeric','multiple','replaceChild','cssText','ttx_accentColor','Window\x20Opacity','info','strokeStyle','querySelector','replace','Carousel\x20Image','matches','Annotate','drag-bar','#FFCC00','light-mode','.for-against-controls','Sending...','clipboard','.drag-bar\x20.tool-controls','getBoundingClientRect','upgrade','DOMContentLoaded','carousel-image','Total:\x20','screenButton','bottom','fas\x20fa-balance-scale','clientX','iframe','.floating[data-disables-hotkeys=\x22true\x22]'];_0x5c3e=function(){return _0x1be06c;};return _0x5c3e();}global['TT']=global['TT']||{},global['TT'][_0x83527d(0x2de)]=![],global['TT']['updateDateDisplay']=function(_0xe2224c){const _0x5a7e54=_0x83527d,_0x212ee6=document[_0x5a7e54(0x1e6)](_0x5a7e54(0x3c2));if(!_0x212ee6)return;const _0xc1c6d8=new Date(),_0x224fe0={'weekday':_0x5a7e54(0x227),'year':'numeric','month':'long','day':_0x5a7e54(0x2ad)},_0xdae3e=new Intl['DateTimeFormat'](_0xe2224c,_0x224fe0);_0x212ee6[_0x5a7e54(0x24d)]=_0xdae3e[_0x5a7e54(0x293)](_0xc1c6d8);},document[_0x83527d(0x31a)](_0x83527d(0x2c3),()=>{const _0x5477b5=_0x83527d,_0x5dfa7d=document[_0x5477b5(0x1e6)](_0x5477b5(0x3c5));_0x5dfa7d&&setTimeout(()=>{const _0x1ac7ce=_0x5477b5;_0x5dfa7d['style'][_0x1ac7ce(0x222)]='0',setTimeout(()=>_0x5dfa7d[_0x1ac7ce(0x22d)](),0x1f4);},0x3e8);const _0x40de68=_0x4d0fc5=>document[_0x5477b5(0x1e6)](_0x4d0fc5),_0x3e55ac=_0x40de68('upgrade-panel'),_0x2ac0e7=_0x40de68('upgrade-backdrop'),_0x38a48c=_0x40de68('close-upgrade-btn'),_0x51344f=_0x40de68(_0x5477b5(0x2eb)),_0x48c220=()=>{const _0x5406f0=_0x5477b5;_0x2ac0e7&&_0x3e55ac&&(_0x2ac0e7[_0x5406f0(0x3b8)][_0x5406f0(0x22d)](_0x5406f0(0x321)),_0x3e55ac['classList'][_0x5406f0(0x403)](_0x5406f0(0x2f9)));},_0x100766=()=>{const _0x38d382=_0x5477b5;_0x2ac0e7&&_0x3e55ac&&(_0x2ac0e7[_0x38d382(0x3b8)][_0x38d382(0x403)](_0x38d382(0x321)),_0x3e55ac[_0x38d382(0x3b8)][_0x38d382(0x22d)]('open'));},_0x474cea=async()=>{const _0x525530=_0x5477b5;try{const _0x4e1279=await auth0Client['getUser']();if(!_0x4e1279)throw new Error('User\x20not\x20found\x20after\x20authentication.');const _0x27e118=Stripe(_0x525530(0x229)),_0x3661b3=_0x525530(0x395),_0x42bd2b=await fetch(_0x525530(0x435),{'method':_0x525530(0x304),'headers':{'Content-Type':_0x525530(0x36b)},'body':JSON[_0x525530(0x279)]({'userId':_0x4e1279[_0x525530(0x3f1)],'priceId':_0x3661b3})});if(!_0x42bd2b['ok'])throw new Error('Failed\x20to\x20create\x20checkout\x20session.');const {sessionId:_0x456d68}=await _0x42bd2b[_0x525530(0x408)]();await _0x27e118[_0x525530(0x3bf)]({'sessionId':_0x456d68});}catch(_0x637e3a){console[_0x525530(0x294)](_0x525530(0x2db),_0x637e3a),alert('Could\x20not\x20connect\x20to\x20the\x20payment\x20service.\x20Please\x20try\x20again\x20later.');}};if(_0x38a48c)_0x38a48c['onclick']=_0x100766;if(_0x2ac0e7)_0x2ac0e7[_0x5477b5(0x214)]=_0x100766;_0x51344f&&(_0x51344f[_0x5477b5(0x214)]=async()=>{const _0x5b63f9=_0x5477b5;if(!await auth0Client['isAuthenticated']()){login(_0x5b63f9(0x2c2));return;}_0x474cea();});const _0x110d1b=document['getElementById']('theme-toggle');_0x110d1b&&_0x110d1b['addEventListener'](_0x5477b5(0x2e4),()=>{const _0x3c8332=_0x5477b5;document[_0x3c8332(0x20d)][_0x3c8332(0x3b8)][_0x3c8332(0x3fd)](_0x3c8332(0x2bc),_0x110d1b[_0x3c8332(0x368)]),localStorage[_0x3c8332(0x426)](_0x3c8332(0x230),_0x110d1b[_0x3c8332(0x368)]?_0x3c8332(0x26e):'dark');});const _0x2ecbd2=()=>_0x40de68('sidebar')[_0x5477b5(0x31c)];let _0x4f870c=window[_0x5477b5(0x2f3)],_0x460df6=window[_0x5477b5(0x281)];const _0x529ca4=_0x40de68(_0x5477b5(0x2f8)),_0x436049=_0x40de68('digital-clock-bar'),_0x198efa=document[_0x5477b5(0x2b5)](_0x5477b5(0x272)),_0x84f81b=document[_0x5477b5(0x2b5)](_0x5477b5(0x2dc)),_0x4bb4b9=document[_0x5477b5(0x2b5)]('.second-hand');function _0x47bd4f(){const _0x21b608=_0x5477b5,_0x5ebb84=new Date(),_0x34fc41=_0x5ebb84['getSeconds'](),_0x2fa718=_0x5ebb84[_0x21b608(0x244)](),_0x4843b5=_0x5ebb84['getHours'](),_0x35ce1b=_0x34fc41/0x3c*0x168,_0x3482eb=_0x2fa718/0x3c*0x168+_0x34fc41/0x3c*0x6,_0x726daa=_0x4843b5/0xc*0x168+_0x2fa718/0x3c*0x1e;_0x198efa&&_0x84f81b&&_0x4bb4b9&&(_0x35ce1b<0x1?_0x4bb4b9[_0x21b608(0x20c)][_0x21b608(0x2fe)]=_0x21b608(0x310):_0x4bb4b9[_0x21b608(0x20c)][_0x21b608(0x2fe)]='',_0x4bb4b9['style'][_0x21b608(0x2f6)]='rotate('+_0x35ce1b+_0x21b608(0x2e5),_0x84f81b[_0x21b608(0x20c)][_0x21b608(0x2f6)]='rotate('+_0x3482eb+_0x21b608(0x2e5),_0x198efa[_0x21b608(0x20c)]['transform']=_0x21b608(0x305)+_0x726daa+_0x21b608(0x2e5));if(_0x436049){const _0x103cf6=String(_0x4843b5)[_0x21b608(0x354)](0x2,'0'),_0x4b5f37=String(_0x2fa718)[_0x21b608(0x354)](0x2,'0'),_0x6efd4c=String(_0x34fc41)['padStart'](0x2,'0');_0x436049[_0x21b608(0x24d)]=_0x103cf6+':'+_0x4b5f37+':'+_0x6efd4c;}}_0x529ca4&&(_0x529ca4['addEventListener'](_0x5477b5(0x3f6),()=>{const _0x37de9f=_0x5477b5;_0x529ca4[_0x37de9f(0x3b8)][_0x37de9f(0x3fd)]('active'),_0x436049[_0x37de9f(0x3b8)]['toggle'](_0x37de9f(0x2f9));}),_0x436049&&_0x436049[_0x5477b5(0x31a)]('mouseenter',()=>{const _0x9b850e=_0x5477b5;_0x529ca4['classList'][_0x9b850e(0x22d)](_0x9b850e(0x3bd)),_0x436049[_0x9b850e(0x3b8)][_0x9b850e(0x22d)](_0x9b850e(0x2f9));}),_0x47bd4f(),setInterval(_0x47bd4f,0x3e8));const _0x4aced4=_0x40de68(_0x5477b5(0x3c2));if(_0x4aced4){const _0x2896ab=()=>{const _0x3151d2=_0x5477b5,_0x458180=document[_0x3151d2(0x2b5)](_0x3151d2(0x246));_0x4aced4[_0x3151d2(0x3b8)]['contains']('date-enlarged')&&_0x4aced4[_0x3151d2(0x3b8)][_0x3151d2(0x22d)]('date-enlarged'),_0x458180&&(_0x458180['style'][_0x3151d2(0x222)]='0',setTimeout(()=>_0x458180['remove'](),0x190));},_0x2ed94a=()=>{const _0x560aa5=_0x5477b5;if(!_0x4aced4[_0x560aa5(0x3b8)][_0x560aa5(0x2a4)](_0x560aa5(0x2f2))){_0x4aced4[_0x560aa5(0x3b8)][_0x560aa5(0x403)](_0x560aa5(0x2f2));const _0x25dbd0=document[_0x560aa5(0x307)](_0x560aa5(0x1ea));_0x25dbd0[_0x560aa5(0x32c)]=_0x560aa5(0x31e),_0x25dbd0[_0x560aa5(0x31a)](_0x560aa5(0x3f6),_0x2896ab),document[_0x560aa5(0x20d)]['appendChild'](_0x25dbd0),setTimeout(()=>_0x25dbd0[_0x560aa5(0x20c)][_0x560aa5(0x222)]='1',0xa);}};_0x4aced4[_0x5477b5(0x31a)](_0x5477b5(0x3f6),()=>{const _0x5677bb=_0x5477b5;_0x4aced4['classList'][_0x5677bb(0x2a4)](_0x5677bb(0x2f2))?_0x2896ab():_0x2ed94a();});}const _0xe204c9=_0x5477b5(0x3d7),_0xc570e6=document[_0x5477b5(0x307)](_0x5477b5(0x20c));_0xc570e6[_0x5477b5(0x344)]=_0xe204c9,document[_0x5477b5(0x267)][_0x5477b5(0x379)](_0xc570e6);let _0x2bc035=!![],_0x120960={'activeLayout':null,'isVisible':!![]};const _0x58c277=0x14,_0x32e743=getComputedStyle(document[_0x5477b5(0x409)])[_0x5477b5(0x1fa)]('--accent-color')[_0x5477b5(0x384)]();let _0x432c4a=0x0;window['addEventListener']('dragenter',_0x159b07=>{const _0x787a24=_0x5477b5;_0x159b07[_0x787a24(0x27d)][_0x787a24(0x422)]['includes'](_0x787a24(0x399))&&(_0x159b07[_0x787a24(0x367)](),_0x432c4a++,document['body'][_0x787a24(0x3b8)]['add']('is-dragging'));}),window[_0x5477b5(0x31a)](_0x5477b5(0x3dc),_0x4afc62=>{const _0x527d43=_0x5477b5;_0x4afc62['dataTransfer']['types'][_0x527d43(0x20a)](_0x527d43(0x399))&&(_0x4afc62[_0x527d43(0x367)](),_0x432c4a--,_0x432c4a===0x0&&document[_0x527d43(0x20d)][_0x527d43(0x3b8)][_0x527d43(0x22d)](_0x527d43(0x430)));}),window['addEventListener']('drop',_0x3dc0c4=>{const _0x45aefd=_0x5477b5;_0x3dc0c4['preventDefault'](),_0x432c4a=0x0,document[_0x45aefd(0x20d)][_0x45aefd(0x3b8)]['remove'](_0x45aefd(0x430));});function _0x3cf5d4(){const _0x906b42=_0x5477b5;if(_0x120960[_0x906b42(0x262)]===_0x906b42(0x2b3))return _0xa57f86(),_0x120960[_0x906b42(0x262)]=null,!![];return![];}function _0xe80319(_0x4589a1){const _0x2c9496=_0x5477b5,_0x429548=document[_0x2c9496(0x307)]('div');_0x429548['className']='overlay-number',_0x429548[_0x2c9496(0x24d)]=_0x4589a1,document['body'][_0x2c9496(0x379)](_0x429548),setTimeout(()=>{const _0x201cff=_0x2c9496;_0x429548[_0x201cff(0x20c)][_0x201cff(0x222)]=0x0,_0x429548['style'][_0x201cff(0x2f6)]=_0x201cff(0x2e8);},0xa),setTimeout(()=>_0x429548[_0x2c9496(0x22d)](),0x7d0);}function _0xa57f86(){const _0x3b584d=_0x5477b5;document['querySelectorAll']('.floating')[_0x3b584d(0x270)](_0x2fcba1=>{_0x486bb6(_0x2fcba1),_0x2fcba1['remove']();});}function _0x14d756(_0x409271){const _0x57e6ff=_0x5477b5;document[_0x57e6ff(0x361)](_0x57e6ff(0x30a))[_0x57e6ff(0x270)](_0x50dfa0=>{const _0x37cab7=_0x57e6ff;_0x50dfa0[_0x37cab7(0x3b8)]['remove'](_0x37cab7(0x392)),_0x50dfa0[_0x37cab7(0x20c)][_0x37cab7(0x406)]=0x3e8;}),_0x409271&&(_0x409271[_0x57e6ff(0x3b8)]['add'](_0x57e6ff(0x392)),_0x409271['style'][_0x57e6ff(0x406)]=0x3e9);}function _0x486bb6(_0x2d0a3b){const _0x325f14=_0x5477b5;if(!_0x2d0a3b)return;const _0x1d3e40=_0x2d0a3b['querySelector'](_0x325f14(0x33b));_0x1d3e40&&_0x1d3e40['remove']();const _0x164310=_0x2d0a3b['querySelector'](_0x325f14(0x2c0));_0x164310&&(_0x164310['style']['display']=_0x325f14(0x316)),_0x2d0a3b[_0x325f14(0x215)](_0x325f14(0x3cb)),_0x2d0a3b[_0x325f14(0x3d8)]&&(clearInterval(_0x2d0a3b[_0x325f14(0x3d8)]),_0x2d0a3b[_0x325f14(0x3d8)]=null),_0x2d0a3b[_0x325f14(0x330)]&&(_0x2d0a3b[_0x325f14(0x330)]['disconnect'](),_0x2d0a3b[_0x325f14(0x330)]=null),_0x2d0a3b['annotationResizeObserver']&&(_0x2d0a3b[_0x325f14(0x250)][_0x325f14(0x375)](),_0x2d0a3b['annotationResizeObserver']=null);}function _0x3ded38(_0x5c9bcc,_0x1de75c,_0x3ab46f){const _0x3b4ead=_0x5477b5;if(!_0x5c9bcc||!_0x1de75c||!_0x3ab46f)return;_0x3ab46f[_0x3b4ead(0x284)]>0x14&&_0x3ab46f['shift'](),_0x3ab46f[_0x3b4ead(0x1e5)](_0x1de75c[_0x3b4ead(0x404)](0x0,0x0,_0x5c9bcc['width'],_0x5c9bcc[_0x3b4ead(0x258)]));}function _0x521dc2(_0x5657c1,_0x5a7ce9){const _0x303374=_0x5477b5;if(!_0x5a7ce9)return;_0x486bb6(_0x5657c1);const _0x149358=_0x5657c1[_0x303374(0x2b5)](_0x303374(0x387));if(!_0x149358)return;_0x149358[_0x303374(0x242)]='';const _0x18b2cc=URL[_0x303374(0x2d4)](_0x5a7ce9),_0x120a9a=document[_0x303374(0x307)](_0x303374(0x1ea));_0x120a9a[_0x303374(0x32c)]='content-fill';if(_0x5a7ce9[_0x303374(0x313)]===_0x303374(0x21b)){const _0x738f0e=document[_0x303374(0x307)](_0x303374(0x2ca));_0x738f0e[_0x303374(0x2d1)]=_0x18b2cc,_0x120a9a['appendChild'](_0x738f0e);}else{if(_0x5a7ce9['type'][_0x303374(0x1e3)](_0x303374(0x277))){const _0x3c1c20=document[_0x303374(0x307)](_0x303374(0x1ee));_0x3c1c20[_0x303374(0x2d1)]=_0x18b2cc,_0x3c1c20['style'][_0x303374(0x30e)]=_0x303374(0x276),_0x3c1c20['crossOrigin']=_0x303374(0x300),_0x120a9a[_0x303374(0x379)](_0x3c1c20);}else{if(_0x5a7ce9[_0x303374(0x313)][_0x303374(0x1e3)](_0x303374(0x275))){const _0x8d4d8f=document['createElement'](_0x303374(0x331));_0x8d4d8f[_0x303374(0x2d1)]=_0x18b2cc,_0x8d4d8f[_0x303374(0x3d5)]=!![],_0x8d4d8f['autoplay']=!![],_0x120a9a['appendChild'](_0x8d4d8f);}else _0x5a7ce9['name'][_0x303374(0x429)]()[_0x303374(0x30d)]('.pptx')||_0x5a7ce9[_0x303374(0x218)][_0x303374(0x429)]()[_0x303374(0x30d)](_0x303374(0x2e6))?_0x120a9a[_0x303374(0x242)]=_0x303374(0x299):(_0x120a9a[_0x303374(0x24d)]='Unsupported\x20file',_0x120a9a['style']['color']='white');}}_0x149358[_0x303374(0x379)](_0x120a9a);}function _0x3fbd35(_0x122e7e){const _0x286947=_0x5477b5;_0x122e7e[_0x286947(0x367)](),_0x521dc2(this,_0x122e7e[_0x286947(0x27d)]['files'][0x0]);}function _0x59a66b(_0x38f23c){const _0x309eb8=_0x5477b5;_0xa57f86(),_0x38f23c[_0x309eb8(0x270)](_0x4922f2=>{const _0x1bb1ca=_0x309eb8,_0x21d539=_0xba4866();_0x21d539[_0x1bb1ca(0x20c)]['left']=_0x4922f2[_0x1bb1ca(0x325)],_0x21d539[_0x1bb1ca(0x20c)][_0x1bb1ca(0x2d7)]=_0x4922f2[_0x1bb1ca(0x2d7)],_0x21d539[_0x1bb1ca(0x20c)]['width']=_0x4922f2[_0x1bb1ca(0x378)],_0x21d539[_0x1bb1ca(0x20c)][_0x1bb1ca(0x258)]=_0x4922f2['height'];});}function _0x419558(_0x47f589){const _0x20f9b3=_0x5477b5;if(_0x47f589['querySelector'](_0x20f9b3(0x33b)))return;const _0xa0497c=_0x47f589[_0x20f9b3(0x2b5)](_0x20f9b3(0x387));if(!_0xa0497c)return;_0x486bb6(_0x47f589),_0xa0497c[_0x20f9b3(0x242)]='',_0xa0497c[_0x20f9b3(0x20c)][_0x20f9b3(0x32b)]='0',_0xa0497c[_0x20f9b3(0x20c)][_0x20f9b3(0x2e9)]=_0x20f9b3(0x316),_0xa0497c[_0x20f9b3(0x20c)][_0x20f9b3(0x207)]=_0x20f9b3(0x3ff),_0x47f589[_0x20f9b3(0x2d5)][_0x20f9b3(0x3cf)]=_0x20f9b3(0x30b);const _0x22e6b6=_0x47f589['querySelector'](_0x20f9b3(0x2c0));_0x22e6b6&&(_0x22e6b6[_0x20f9b3(0x20c)][_0x20f9b3(0x2e9)]=_0x20f9b3(0x310));const _0x4587fc=document['createElement'](_0x20f9b3(0x382)),_0x57f4f4=document[_0x20f9b3(0x307)]('div');_0x57f4f4[_0x20f9b3(0x32c)]=_0x20f9b3(0x314),_0x57f4f4[_0x20f9b3(0x20c)][_0x20f9b3(0x306)]=_0x20f9b3(0x3fb),_0x57f4f4[_0x20f9b3(0x379)](_0x4587fc);const _0x3e7ad6=_0x4587fc[_0x20f9b3(0x3e0)]('2d');let _0x5e70a6=![];const _0x58fcd5=[];function _0xc68283(){const _0x39e24c=_0x20f9b3;if(_0x58fcd5['length']>0x1e)_0x58fcd5[_0x39e24c(0x428)]();_0x58fcd5['push'](_0x3e7ad6['getImageData'](0x0,0x0,_0x4587fc[_0x39e24c(0x378)],_0x4587fc[_0x39e24c(0x258)]));}const _0x361a38=new ResizeObserver(()=>{const _0xffb175=_0x20f9b3,_0x239a60=_0x58fcd5[_0xffb175(0x284)]>0x0?_0x58fcd5[_0x58fcd5[_0xffb175(0x284)]-0x1]:null;_0x4587fc[_0xffb175(0x378)]=_0x57f4f4[_0xffb175(0x35d)],_0x4587fc[_0xffb175(0x258)]=_0x57f4f4[_0xffb175(0x28f)];if(_0x239a60)_0x3e7ad6[_0xffb175(0x26d)](_0x239a60,0x0,0x0);_0x3e7ad6[_0xffb175(0x208)]=_0xffb175(0x419),_0x3e7ad6[_0xffb175(0x2b4)]=_0x37f818[_0xffb175(0x2b5)](_0xffb175(0x295))?.[_0xffb175(0x20c)]['backgroundColor']||_0xffb175(0x390),_0x3e7ad6[_0xffb175(0x1fd)]=_0x3f9623['value'];});_0x47f589['toolResizeObserver']=_0x361a38,_0x361a38[_0x20f9b3(0x2cc)](_0x57f4f4),_0x4587fc['style'][_0x20f9b3(0x2fa)]=_0x20f9b3(0x212),_0x4587fc[_0x20f9b3(0x20c)]['width']=_0x20f9b3(0x381),_0x4587fc[_0x20f9b3(0x20c)][_0x20f9b3(0x258)]=_0x20f9b3(0x381),_0x4587fc[_0x20f9b3(0x31a)](_0x20f9b3(0x280),_0x38397c=>{const _0x524035=_0x20f9b3;_0x5e70a6=!![],_0xc68283(),_0x3e7ad6[_0x524035(0x3e1)](),_0x3e7ad6['moveTo'](_0x38397c['offsetX'],_0x38397c['offsetY']);}),_0x4587fc[_0x20f9b3(0x31a)]('pointermove',_0x125a61=>{const _0x315871=_0x20f9b3;_0x5e70a6&&(_0x3e7ad6[_0x315871(0x1df)](_0x125a61['offsetX'],_0x125a61[_0x315871(0x42e)]),_0x3e7ad6[_0x315871(0x24f)]());}),_0x4587fc[_0x20f9b3(0x31a)](_0x20f9b3(0x377),()=>_0x5e70a6=![]);const _0x37f818=document[_0x20f9b3(0x307)]('div');_0x37f818['className']=_0x20f9b3(0x3c3);const _0x2eeaa9=[];[_0x20f9b3(0x390),_0x20f9b3(0x315),_0x20f9b3(0x202),_0x20f9b3(0x2bb),_0x20f9b3(0x1f7),_0x20f9b3(0x2fb),_0x20f9b3(0x32a)][_0x20f9b3(0x270)](_0x1626b9=>{const _0x2f3b08=_0x20f9b3,_0x395f61=document[_0x2f3b08(0x307)](_0x2f3b08(0x1ea));_0x395f61[_0x2f3b08(0x32c)]=_0x2f3b08(0x2fc),_0x395f61['style']['backgroundColor']=_0x1626b9,_0x395f61[_0x2f3b08(0x214)]=()=>{const _0x554c34=_0x2f3b08;_0x3e7ad6[_0x554c34(0x2b4)]=_0x1626b9,_0x37f818['querySelector'](_0x554c34(0x295))?.[_0x554c34(0x3b8)]['remove']('active'),_0x395f61[_0x554c34(0x3b8)][_0x554c34(0x403)]('active');},_0x2eeaa9[_0x2f3b08(0x1e5)](_0x395f61);});const _0x3f9623=document[_0x20f9b3(0x307)](_0x20f9b3(0x362));_0x3f9623[_0x20f9b3(0x313)]=_0x20f9b3(0x1e1),_0x3f9623[_0x20f9b3(0x2dd)]=0x1,_0x3f9623['max']=0x32,_0x3f9623[_0x20f9b3(0x296)]=0x5,_0x3f9623[_0x20f9b3(0x20c)][_0x20f9b3(0x378)]=_0x20f9b3(0x2f0),_0x3f9623[_0x20f9b3(0x3f7)]=_0x22fa4c=>{const _0x48ffee=_0x20f9b3;_0x3e7ad6[_0x48ffee(0x1fd)]=_0x22fa4c[_0x48ffee(0x38c)][_0x48ffee(0x296)];};const _0x39d930=document[_0x20f9b3(0x307)](_0x20f9b3(0x334));_0x39d930['innerHTML']=_0x20f9b3(0x31f),_0x39d930[_0x20f9b3(0x214)]=()=>{const _0x3d944f=_0x20f9b3;if(_0x58fcd5[_0x3d944f(0x284)]>0x0)_0x3e7ad6['putImageData'](_0x58fcd5[_0x3d944f(0x338)](),0x0,0x0);};const _0x13f9ca=document[_0x20f9b3(0x307)](_0x20f9b3(0x334));_0x13f9ca[_0x20f9b3(0x242)]='<i\x20class=\x22fas\x20fa-trash\x22></i>',_0x13f9ca[_0x20f9b3(0x214)]=()=>{const _0x23084f=_0x20f9b3;_0x3e7ad6['clearRect'](0x0,0x0,_0x4587fc[_0x23084f(0x378)],_0x4587fc[_0x23084f(0x258)]),_0x58fcd5[_0x23084f(0x284)]=0x0;},_0x37f818['append'](_0x3f9623,..._0x2eeaa9,_0x39d930,_0x13f9ca),_0xa0497c['append'](_0x37f818,_0x57f4f4),_0x3e7ad6[_0x20f9b3(0x2b4)]=_0x20f9b3(0x390),_0x2eeaa9[0x0][_0x20f9b3(0x3b8)]['add'](_0x20f9b3(0x3bd));}function _0x384c23(_0x499fdc){const _0x3a4477=_0x5477b5,_0x4ccbb8=_0x499fdc[_0x3a4477(0x2b5)]('.win-main-area');if(!_0x4ccbb8)return;_0x4ccbb8[_0x3a4477(0x242)]='',_0x4ccbb8[_0x3a4477(0x20c)][_0x3a4477(0x32b)]='0',navigator[_0x3a4477(0x24e)][_0x3a4477(0x2ef)]({'video':!![]})[_0x3a4477(0x411)](_0x50a98f=>{const _0x1b10d7=_0x3a4477,_0x410524=document[_0x1b10d7(0x307)]('video');_0x410524[_0x1b10d7(0x42d)]=_0x50a98f,_0x410524['autoplay']=!![],_0x410524[_0x1b10d7(0x2a3)]=!![],_0x410524[_0x1b10d7(0x20c)][_0x1b10d7(0x378)]='100%',_0x410524[_0x1b10d7(0x20c)][_0x1b10d7(0x258)]='100%',_0x410524[_0x1b10d7(0x20c)]['objectFit']=_0x1b10d7(0x237),_0x4ccbb8[_0x1b10d7(0x379)](_0x410524);})[_0x3a4477(0x1f2)](_0x1d0458=>{const _0x2d359d=_0x3a4477;_0x4ccbb8[_0x2d359d(0x24d)]='Could\x20not\x20access\x20camera.',console['error'](_0x1d0458);});}function _0xd3760a(_0xeedf80){const _0xef9de1=_0x5477b5,_0x41de3e=_0xeedf80[_0xef9de1(0x2b5)]('.win-main-area');if(!_0x41de3e)return;function _0x20711e(_0x136db7){const _0x3498df=_0xef9de1;_0x41de3e[_0x3498df(0x242)]='',_0x41de3e[_0x3498df(0x20c)]['padding']='0',_0x41de3e[_0x3498df(0x20c)]['display']=_0x3498df(0x316),_0x41de3e[_0x3498df(0x20c)][_0x3498df(0x207)]=_0x3498df(0x3ff),_0xeedf80[_0x3498df(0x3b8)][_0x3498df(0x403)](_0x3498df(0x413));let _0x294c02=_0x136db7,_0x4c4d77=![],_0x25f5cd;const _0x1c9699=document['createElement']('div');_0x1c9699[_0x3498df(0x20c)][_0x3498df(0x2b0)]=_0x3498df(0x350);const _0x29f379='http://www.w3.org/2000/svg',_0x3ffc6a=document[_0x3498df(0x32d)](_0x29f379,_0x3498df(0x38b));_0x3ffc6a[_0x3498df(0x20c)][_0x3498df(0x306)]=_0x3498df(0x343),_0x3ffc6a['style']['width']=_0x3498df(0x326),_0x3ffc6a[_0x3498df(0x20c)][_0x3498df(0x258)]=_0x3498df(0x326),_0x3ffc6a[_0x3498df(0x358)](_0x3498df(0x1f6),'0\x200\x20100\x20100');const _0x6d8553=document[_0x3498df(0x32d)](_0x29f379,_0x3498df(0x356));_0x6d8553[_0x3498df(0x358)]('cx','50'),_0x6d8553['setAttribute']('cy','50'),_0x6d8553['setAttribute']('r','45'),_0x6d8553[_0x3498df(0x358)]('stroke',_0x3498df(0x29b)),_0x6d8553['setAttribute']('stroke-width','5'),_0x6d8553[_0x3498df(0x358)](_0x3498df(0x2d9),_0x3498df(0x3e8));const _0x5244a6=document[_0x3498df(0x32d)](_0x29f379,_0x3498df(0x356));_0x5244a6['setAttribute']('cx','50'),_0x5244a6[_0x3498df(0x358)]('cy','50'),_0x5244a6[_0x3498df(0x358)]('r','45'),_0x5244a6[_0x3498df(0x358)](_0x3498df(0x24f),getComputedStyle(document[_0x3498df(0x409)])[_0x3498df(0x1fa)](_0x3498df(0x407))[_0x3498df(0x384)]()),_0x5244a6[_0x3498df(0x358)](_0x3498df(0x25d),'5'),_0x5244a6[_0x3498df(0x358)](_0x3498df(0x2d9),_0x3498df(0x3e8)),_0x5244a6[_0x3498df(0x20c)][_0x3498df(0x40d)]=_0x3498df(0x2d2),_0x5244a6['style'][_0x3498df(0x2f6)]=_0x3498df(0x3d0);const _0x2424e1=0x2d,_0x4fe272=0x2*Math['PI']*_0x2424e1;_0x5244a6[_0x3498df(0x358)]('stroke-dasharray',_0x4fe272),_0x5244a6[_0x3498df(0x358)](_0x3498df(0x211),0x0),_0x5244a6[_0x3498df(0x20c)][_0x3498df(0x2fe)]=_0x3498df(0x37f),_0x3ffc6a[_0x3498df(0x3a9)](_0x6d8553,_0x5244a6),_0x1c9699['appendChild'](_0x3ffc6a);const _0x29266e=document[_0x3498df(0x307)](_0x3498df(0x1ea));_0x29266e['style'][_0x3498df(0x2b0)]='color:\x20white;\x20font-weight:\x20700;\x20line-height:\x201;\x20position:\x20relative;\x20z-index:\x201;',_0x1c9699[_0x3498df(0x379)](_0x29266e),_0x41de3e[_0x3498df(0x379)](_0x1c9699);const _0x4692df=_0x525e2c=>{const _0x36f85a=_0x3498df,_0x5e98ac=_0x525e2c/_0x136db7,_0x259a8a=_0x4fe272*(0x1-_0x5e98ac);_0x5244a6[_0x36f85a(0x358)](_0x36f85a(0x211),_0x259a8a);if(_0x525e2c<0x0)_0x525e2c=0x0;if(_0x525e2c<0x3c)_0x29266e['textContent']=String(_0x525e2c)[_0x36f85a(0x354)](0x2,'0');else{const _0x67f833=Math[_0x36f85a(0x431)](_0x525e2c/0x3c),_0x310a6a=String(_0x525e2c%0x3c)['padStart'](0x2,'0'),_0x40d3df=_0x67f833>0x0&&_0x67f833<0xa?String(_0x67f833):String(_0x67f833)[_0x36f85a(0x354)](0x2,'0');_0x29266e[_0x36f85a(0x24d)]=_0x40d3df+':'+_0x310a6a;}_0x4f14bd();},_0x4f14bd=()=>{const _0x42e8bd=_0x3498df,_0x1aea8c=_0x29266e[_0x42e8bd(0x24d)][_0x42e8bd(0x284)]>0x2?4.4:2.2,_0x27e1cd=_0x1c9699[_0x42e8bd(0x35d)]/_0x1aea8c;_0x29266e[_0x42e8bd(0x20c)]['fontSize']=_0x27e1cd+'px';},_0x1a99d5=new ResizeObserver(_0x4f14bd);_0xeedf80[_0x3498df(0x330)]=_0x1a99d5,_0x1a99d5[_0x3498df(0x2cc)](_0x1c9699);function _0x32839e(){const _0x22a41b=_0x3498df,_0x24719a=Math['round']((_0x25f5cd-Date[_0x22a41b(0x3e4)]())/0x3e8);_0x294c02=_0x24719a,_0x4692df(_0x24719a),_0x24719a<=0x0&&(_0x40de68(_0x22a41b(0x41f))[_0x22a41b(0x333)](),_0x486bb6(_0xeedf80),_0xd3760a(_0xeedf80));}const _0x491f02=document[_0x3498df(0x307)](_0x3498df(0x1ea));_0x491f02[_0x3498df(0x32c)]='countdown-running-controls';const _0x188b37=document[_0x3498df(0x307)]('button');_0x188b37[_0x3498df(0x32c)]=_0x3498df(0x41b),_0x188b37[_0x3498df(0x249)]='Start/Pause\x20Timer\x20(Enter)',_0x188b37['innerHTML']='<i\x20class=\x22fas\x20fa-play\x22></i>',_0x188b37['style'][_0x3498df(0x364)]='var(--success-color)',_0x188b37[_0x3498df(0x214)]=()=>{const _0x5aa635=_0x3498df;_0x4c4d77=!_0x4c4d77,_0x4c4d77?(_0x25f5cd=Date[_0x5aa635(0x3e4)]()+_0x294c02*0x3e8,_0xeedf80[_0x5aa635(0x3d8)]=setInterval(_0x32839e,0x3e8),_0x32839e(),_0x188b37[_0x5aa635(0x242)]=_0x5aa635(0x3c0)):(clearInterval(_0xeedf80[_0x5aa635(0x3d8)]),_0xeedf80['activeInterval']=null,_0x188b37['innerHTML']=_0x5aa635(0x232));};const _0x655943=document[_0x3498df(0x307)](_0x3498df(0x334));_0x655943['className']=_0x3498df(0x2d3),_0x655943['title']=_0x3498df(0x37e),_0x655943['innerHTML']=_0x3498df(0x363),_0x655943[_0x3498df(0x20c)][_0x3498df(0x364)]=_0x3498df(0x33a),_0x655943['onclick']=()=>{_0x486bb6(_0xeedf80),_0xd3760a(_0xeedf80);},_0x491f02[_0x3498df(0x3a9)](_0x188b37,_0x655943),_0x41de3e['appendChild'](_0x491f02),_0x4692df(_0x136db7);}_0x41de3e[_0xef9de1(0x242)]='',_0x41de3e['style'][_0xef9de1(0x32b)]='16px',_0x41de3e[_0xef9de1(0x20c)][_0xef9de1(0x2e9)]=_0xef9de1(0x316),_0x41de3e['style'][_0xef9de1(0x207)]='column',_0xeedf80['classList'][_0xef9de1(0x22d)](_0xef9de1(0x413));const _0x590e34=document[_0xef9de1(0x307)]('h2');_0x590e34[_0xef9de1(0x32c)]=_0xef9de1(0x3e2),_0x590e34[_0xef9de1(0x24d)]=_0xef9de1(0x2cf),_0x41de3e['appendChild'](_0x590e34);const _0x37483c=document[_0xef9de1(0x307)](_0xef9de1(0x1ea));_0x37483c[_0xef9de1(0x32c)]=_0xef9de1(0x3aa);const _0x593423=[{'label':'30\x20sec','seconds':0x1e},{'label':_0xef9de1(0x366),'seconds':0x3c},{'label':_0xef9de1(0x209),'seconds':0x78},{'label':'5\x20min','seconds':0x12c},{'label':_0xef9de1(0x29f),'seconds':0x258},{'label':_0xef9de1(0x35c),'seconds':0x384},{'label':_0xef9de1(0x25e),'seconds':0x708},{'label':_0xef9de1(0x41c),'seconds':0xe10}];_0x593423[_0xef9de1(0x270)](_0x1d6fa8=>{const _0x358fed=_0xef9de1,_0x22892f=document[_0x358fed(0x307)](_0x358fed(0x334));_0x22892f[_0x358fed(0x32c)]=_0x358fed(0x3bb),_0x22892f[_0x358fed(0x24d)]=_0x1d6fa8[_0x358fed(0x23b)],_0x22892f['onclick']=()=>_0x20711e(_0x1d6fa8[_0x358fed(0x308)]),_0x37483c['appendChild'](_0x22892f);}),_0x41de3e[_0xef9de1(0x379)](_0x37483c);}function _0xc55558(_0x21e851){const _0x1dd48e=_0x5477b5,_0x30176b=_0x21e851['querySelector']('.win-main-area');if(!_0x30176b)return;_0x30176b[_0x1dd48e(0x242)]='',_0x30176b[_0x1dd48e(0x20c)][_0x1dd48e(0x32b)]='0',_0x30176b[_0x1dd48e(0x20c)]['display']=_0x1dd48e(0x316),_0x30176b[_0x1dd48e(0x20c)][_0x1dd48e(0x207)]=_0x1dd48e(0x3ff);const _0xcb95e6=document[_0x1dd48e(0x307)](_0x1dd48e(0x1ea));_0xcb95e6[_0x1dd48e(0x380)]=!![],_0xcb95e6['style'][_0x1dd48e(0x316)]='1',_0xcb95e6['style'][_0x1dd48e(0x32b)]=_0x1dd48e(0x341),_0xcb95e6['addEventListener']('focus',()=>{_0x2bc035=![];}),_0xcb95e6[_0x1dd48e(0x31a)](_0x1dd48e(0x235),()=>{_0x2bc035=!![];});const _0x1e8831=document[_0x1dd48e(0x307)]('div');_0x1e8831[_0x1dd48e(0x20c)]['cssText']='display:flex;justify-content:center;gap:12px;padding:8px;',[_0x1dd48e(0x3c9),_0x1dd48e(0x401)][_0x1dd48e(0x270)](_0x973657=>{const _0x219847=_0x1dd48e,_0x202c37=document['createElement']('button');_0x202c37['className']=_0x219847(0x3c1),_0x202c37[_0x219847(0x242)]='<i\x20class=\x22'+_0x973657+_0x219847(0x373),_0x202c37[_0x219847(0x20c)][_0x219847(0x378)]=_0x219847(0x357),_0x202c37[_0x219847(0x20c)][_0x219847(0x258)]=_0x219847(0x357),_0x202c37['style'][_0x219847(0x2aa)]=_0x219847(0x341),_0x202c37[_0x219847(0x214)]=()=>{const _0x17ede4=_0x219847,_0x58ab51=parseInt(getComputedStyle(_0xcb95e6)['fontSize'],0xa);_0xcb95e6[_0x17ede4(0x20c)]['fontSize']=_0x58ab51+(_0x973657['includes']('plus')?0x6:-0x6)+'px';},_0x1e8831[_0x219847(0x379)](_0x202c37);}),_0x30176b[_0x1dd48e(0x3a9)](_0xcb95e6,_0x1e8831),_0xcb95e6[_0x1dd48e(0x28a)]();}function _0x28c8ad(_0x4744f0){const _0x14bdea=_0x5477b5,_0x56ab7e=_0x4744f0['querySelector'](_0x14bdea(0x387));if(!_0x56ab7e)return;_0x56ab7e[_0x14bdea(0x242)]='',_0x56ab7e[_0x14bdea(0x20c)]['padding']='0',_0x56ab7e[_0x14bdea(0x20c)]['display']='flex',_0x56ab7e['style']['flexDirection']=_0x14bdea(0x3ff);const _0x50742e=document[_0x14bdea(0x307)]('div');_0x50742e['className']=_0x14bdea(0x38d);const _0x5da97f=document[_0x14bdea(0x307)]('div');_0x5da97f[_0x14bdea(0x32c)]=_0x14bdea(0x41a),_0x56ab7e[_0x14bdea(0x3a9)](_0x50742e,_0x5da97f);let _0x3c56a2=0x1;const _0x4f2cda=(_0x1dd0d8=0x1)=>{const _0x40def6=_0x14bdea,_0x1b11fa=document[_0x40def6(0x307)](_0x40def6(0x1ea));_0x1b11fa[_0x40def6(0x32c)]='die',_0x1b11fa[_0x40def6(0x2d5)]['value']=_0x1dd0d8;for(let _0x16cb15=0x1;_0x16cb15<=0x9;_0x16cb15++){const _0x51506d=document[_0x40def6(0x307)]('div');_0x51506d[_0x40def6(0x32c)]=_0x40def6(0x23c)+_0x16cb15,_0x1b11fa[_0x40def6(0x379)](_0x51506d);}return _0x1b11fa;},_0x2a6764=document[_0x14bdea(0x307)]('div');_0x2a6764['className']='dice-total';const _0x2fa6f2=(_0x1a31ab=!![])=>{const _0x710732=_0x14bdea;let _0x505858=0x0;const _0x5a39fa=_0x50742e[_0x710732(0x361)](_0x710732(0x33e));_0x5a39fa[_0x710732(0x270)](_0x5b7893=>{const _0x12d00b=_0x710732,_0x36cfa6=Math[_0x12d00b(0x431)](Math[_0x12d00b(0x420)]()*0x6)+0x1;_0x505858+=_0x36cfa6,_0x5b7893[_0x12d00b(0x2d5)][_0x12d00b(0x296)]=_0x36cfa6,_0x1a31ab&&(_0x5b7893['classList'][_0x12d00b(0x403)]('rolling'),_0x5b7893[_0x12d00b(0x31a)]('animationend',()=>_0x5b7893[_0x12d00b(0x3b8)][_0x12d00b(0x22d)](_0x12d00b(0x3d3)),{'once':!![]}));}),_0x2a6764['textContent']=_0x710732(0x2c5)+_0x505858;},_0x555905=()=>{requestAnimationFrame(()=>{const _0x22b8af=_0x22b5,_0x3a11d9=getComputedStyle(_0x50742e),_0x3e1cbb=parseFloat(_0x3a11d9[_0x22b8af(0x2cd)])||0x20,_0x558566=_0x50742e[_0x22b8af(0x35d)]-(parseFloat(_0x3a11d9['paddingLeft'])+parseFloat(_0x3a11d9[_0x22b8af(0x405)])),_0x468368=_0x50742e['clientHeight']-(parseFloat(_0x3a11d9['paddingTop'])+parseFloat(_0x3a11d9[_0x22b8af(0x240)]));if(_0x558566<=0x0||_0x468368<=0x0)return;const _0x2a0d7d=Math[_0x22b8af(0x21d)](Math['sqrt'](_0x3c56a2)),_0x265c50=Math[_0x22b8af(0x21d)](_0x3c56a2/_0x2a0d7d),_0x183f05=(_0x558566-(_0x2a0d7d-0x1)*_0x3e1cbb)/_0x2a0d7d,_0x3389e3=(_0x468368-(_0x265c50-0x1)*_0x3e1cbb)/_0x265c50,_0x448794=Math['max'](0x30,Math[_0x22b8af(0x431)](Math['min'](_0x183f05,_0x3389e3)));_0x50742e[_0x22b8af(0x361)](_0x22b8af(0x33e))[_0x22b8af(0x270)](_0x430ccf=>{const _0xcdbae8=_0x22b8af;_0x430ccf[_0xcdbae8(0x20c)][_0xcdbae8(0x378)]=_0x448794+'px',_0x430ccf[_0xcdbae8(0x20c)][_0xcdbae8(0x258)]=_0x448794+'px';});});},_0x5e8360=()=>{const _0x42e758=_0x14bdea;_0x50742e[_0x42e758(0x242)]='';for(let _0x58e839=0x0;_0x58e839<_0x3c56a2;_0x58e839++){_0x50742e[_0x42e758(0x379)](_0x4f2cda(0x1));}_0x2fa6f2(![]),_0x555905();},_0x132f33=document[_0x14bdea(0x307)](_0x14bdea(0x334));_0x132f33[_0x14bdea(0x32c)]='icon-btn',_0x132f33[_0x14bdea(0x242)]=_0x14bdea(0x22f),_0x132f33[_0x14bdea(0x214)]=()=>{_0x3c56a2<0x6&&(_0x3c56a2++,_0x5e8360());};const _0x3485ea=document[_0x14bdea(0x307)](_0x14bdea(0x334));_0x3485ea['className']=_0x14bdea(0x39e),_0x3485ea[_0x14bdea(0x242)]=_0x14bdea(0x383),_0x3485ea[_0x14bdea(0x214)]=()=>{_0x3c56a2>0x1&&(_0x3c56a2--,_0x5e8360());};const _0x200325=document[_0x14bdea(0x307)](_0x14bdea(0x334));_0x200325[_0x14bdea(0x32c)]=_0x14bdea(0x39e),_0x200325['innerHTML']=_0x14bdea(0x204),_0x200325[_0x14bdea(0x20c)]['backgroundColor']=_0x14bdea(0x282),_0x200325[_0x14bdea(0x214)]=()=>_0x2fa6f2(!![]),_0x5da97f['append'](_0x132f33,_0x3485ea,_0x200325,_0x2a6764);const _0x33897a=new ResizeObserver(_0x555905);_0x4744f0[_0x14bdea(0x330)]=_0x33897a,_0x33897a[_0x14bdea(0x2cc)](_0x56ab7e),_0x5e8360();}function _0x34217a(_0xc939a4){const _0x2ee15d=_0x5477b5,_0x35f1a0=_0xc939a4[_0x2ee15d(0x2b5)](_0x2ee15d(0x387));if(!_0x35f1a0)return;_0x35f1a0[_0x2ee15d(0x242)]='',_0x35f1a0[_0x2ee15d(0x20c)]['padding']='0',_0x35f1a0[_0x2ee15d(0x20c)]['display']=_0x2ee15d(0x316),_0x35f1a0[_0x2ee15d(0x20c)][_0x2ee15d(0x207)]='column';const _0x339dac=document[_0x2ee15d(0x307)](_0x2ee15d(0x1ea));_0x339dac[_0x2ee15d(0x32c)]=_0x2ee15d(0x3cd),_0x339dac[_0x2ee15d(0x24d)]=_0x2ee15d(0x1ef);const _0x5377e1=document[_0x2ee15d(0x307)]('div');_0x5377e1['className']=_0x2ee15d(0x2ff),_0x35f1a0[_0x2ee15d(0x3a9)](_0x339dac,_0x5377e1);let _0x4083d4=0x0,_0x10b316=0x0,_0x5c53ea=![];const _0x412eb2=()=>{const _0x3ced62=_0x2ee15d,_0x165fba=_0x4083d4,_0x5744a0=String(Math[_0x3ced62(0x431)](_0x165fba/0xea60))[_0x3ced62(0x354)](0x2,'0'),_0x5e6a4f=String(Math[_0x3ced62(0x431)](_0x165fba%0xea60/0x3e8))[_0x3ced62(0x354)](0x2,'0'),_0x223fe5=String(Math['floor'](_0x165fba%0x3e8/0xa))[_0x3ced62(0x354)](0x2,'0');_0x339dac['textContent']=_0x5744a0+':'+_0x5e6a4f+'.'+_0x223fe5;},_0x1d5060=document[_0x2ee15d(0x307)](_0x2ee15d(0x334));_0x1d5060['className']=_0x2ee15d(0x39e),_0x1d5060[_0x2ee15d(0x242)]=_0x2ee15d(0x232),_0x1d5060[_0x2ee15d(0x20c)][_0x2ee15d(0x364)]=_0x2ee15d(0x282),_0x1d5060[_0x2ee15d(0x214)]=()=>{const _0x4b0d43=_0x2ee15d;_0x5c53ea?(clearInterval(_0xc939a4[_0x4b0d43(0x3d8)]),_0xc939a4[_0x4b0d43(0x3d8)]=null,_0x4083d4=Date['now']()-_0x10b316,_0x1d5060[_0x4b0d43(0x242)]=_0x4b0d43(0x3c0)):(_0x10b316=Date[_0x4b0d43(0x3e4)]()-_0x4083d4,_0xc939a4[_0x4b0d43(0x3d8)]=setInterval(()=>{_0x4083d4=Date['now']()-_0x10b316,_0x412eb2();},0xa),_0x1d5060['innerHTML']='<i\x20class=\x22fas\x20fa-play\x22></i>'),_0x5c53ea=!_0x5c53ea;};const _0xa07023=document[_0x2ee15d(0x307)](_0x2ee15d(0x334));_0xa07023[_0x2ee15d(0x32c)]=_0x2ee15d(0x39e),_0xa07023[_0x2ee15d(0x242)]=_0x2ee15d(0x363),_0xa07023[_0x2ee15d(0x20c)][_0x2ee15d(0x364)]=_0x2ee15d(0x33a),_0xa07023['onclick']=()=>{const _0x996051=_0x2ee15d;clearInterval(_0xc939a4['activeInterval']),_0xc939a4['activeInterval']=null,_0x5c53ea=![],_0x4083d4=0x0,_0x1d5060[_0x996051(0x242)]=_0x996051(0x232),_0x412eb2();},_0x5377e1[_0x2ee15d(0x3a9)](_0x1d5060,_0xa07023);const _0x3fe735=_0x32677e=>{const _0xf9af72=_0x2ee15d,_0x4eff5a=_0x32677e[_0xf9af72(0x35d)]/4.6;_0x339dac[_0xf9af72(0x20c)]['fontSize']=_0x4eff5a+'px';},_0x58205b=new ResizeObserver(_0x496fdc=>{const _0x24816f=_0x2ee15d;for(let _0x8a5819 of _0x496fdc){_0x3fe735(_0x8a5819[_0x24816f(0x38c)]);}});_0xc939a4[_0x2ee15d(0x330)]=_0x58205b,_0x58205b[_0x2ee15d(0x2cc)](_0x35f1a0),_0x3fe735(_0x35f1a0);}function _0x20f5ed(_0x644df8){const _0x4e7c8c=_0x5477b5,_0x227689=_0x644df8[_0x4e7c8c(0x2b5)]('.win-main-area');if(!_0x227689)return;_0x227689['innerHTML']='',_0x227689[_0x4e7c8c(0x20c)]['padding']='0',_0x227689['style']['display']=_0x4e7c8c(0x316),_0x227689[_0x4e7c8c(0x20c)]['gap']='0',_0x227689[_0x4e7c8c(0x20c)][_0x4e7c8c(0x32f)]='hidden',_0x644df8['dataset'][_0x4e7c8c(0x34b)]=_0x4e7c8c(0x3a3),_0x227689[_0x4e7c8c(0x31a)](_0x4e7c8c(0x280),_0x466e2f=>{const _0x3c96c9=_0x4e7c8c;_0x2bc035=![],_0x466e2f[_0x3c96c9(0x34e)]();});const _0x13802b=(_0x3e9d51,_0x2ec851)=>{const _0x23b382=_0x4e7c8c;let _0x4b506d=0x0;const _0x5f29a0=document['createElement'](_0x23b382(0x1ea));_0x5f29a0[_0x23b382(0x32c)]='for-against-panel',_0x5f29a0['style'][_0x23b382(0x364)]=_0x23b382(0x3da)+_0x2ec851+')',_0x5f29a0[_0x23b382(0x20c)][_0x23b382(0x3c7)]=_0x23b382(0x3e3);const _0x50171c=document[_0x23b382(0x307)]('h2');_0x50171c[_0x23b382(0x24d)]=_0x3e9d51;const _0x9ee2dd=document[_0x23b382(0x307)](_0x23b382(0x1ea));_0x9ee2dd[_0x23b382(0x32c)]='for-against-display',_0x9ee2dd[_0x23b382(0x24d)]=_0x4b506d;const _0x50d13d=document[_0x23b382(0x307)](_0x23b382(0x1ea));_0x50d13d[_0x23b382(0x32c)]='for-against-controls';const _0x2976dd=document[_0x23b382(0x307)](_0x23b382(0x334));_0x2976dd[_0x23b382(0x242)]='<i\x20class=\x22fas\x20fa-minus\x22></i>',_0x2976dd[_0x23b382(0x214)]=()=>{const _0x414fd9=_0x23b382;_0x4b506d>0x0&&(_0x4b506d--,_0x9ee2dd[_0x414fd9(0x24d)]=_0x4b506d);};const _0x3bc888=document[_0x23b382(0x307)]('button');return _0x3bc888['innerHTML']='<i\x20class=\x22fas\x20fa-plus\x22></i>',_0x3bc888[_0x23b382(0x214)]=()=>{const _0x593d28=_0x23b382;_0x4b506d++,_0x9ee2dd[_0x593d28(0x24d)]=_0x4b506d;},_0x50d13d[_0x23b382(0x3a9)](_0x2976dd,_0x3bc888),_0x5f29a0[_0x23b382(0x3a9)](_0x50171c,_0x9ee2dd,_0x50d13d),_0x5f29a0;},_0x27a95b=_0x13802b(_0x4e7c8c(0x3ad),'--danger-color'),_0x4248fa=_0x13802b(_0x4e7c8c(0x31d),_0x4e7c8c(0x241));_0x227689[_0x4e7c8c(0x3a9)](_0x4248fa,_0x27a95b);const _0x59433b=_0x5821f1=>{const _0x1dc0a8=_0x4e7c8c,_0x3a3d88=_0x5821f1*0.1,_0x895aad=_0x5821f1*0.3,_0x14ac73=_0x5821f1*0.2,_0xada8aa=_0x14ac73*0.5,_0x482ad6=_0x5821f1*0.05;_0x227689['querySelectorAll'](_0x1dc0a8(0x425))[_0x1dc0a8(0x270)](_0x53390c=>_0x53390c[_0x1dc0a8(0x20c)][_0x1dc0a8(0x32b)]=Math[_0x1dc0a8(0x2a8)](0xa,_0x482ad6)+'px'),_0x227689[_0x1dc0a8(0x361)](_0x1dc0a8(0x221))['forEach'](_0x1da8e7=>_0x1da8e7[_0x1dc0a8(0x20c)][_0x1dc0a8(0x2aa)]=Math['max'](0xe,_0x3a3d88)+'px'),_0x227689['querySelectorAll'](_0x1dc0a8(0x29d))[_0x1dc0a8(0x270)](_0x5769ed=>_0x5769ed[_0x1dc0a8(0x20c)][_0x1dc0a8(0x2aa)]=Math[_0x1dc0a8(0x2a8)](0x1e,_0x895aad)+'px'),_0x227689[_0x1dc0a8(0x361)](_0x1dc0a8(0x2bd))['forEach'](_0x3eb56f=>_0x3eb56f['style'][_0x1dc0a8(0x2cd)]=Math[_0x1dc0a8(0x2a8)](0xa,_0x482ad6)+'px'),_0x227689['querySelectorAll'](_0x1dc0a8(0x264))['forEach'](_0x4c54e9=>{const _0xf7189d=_0x1dc0a8;_0x4c54e9[_0xf7189d(0x20c)]['width']=Math[_0xf7189d(0x2a8)](0x23,_0x14ac73)+'px',_0x4c54e9['style'][_0xf7189d(0x258)]=Math['max'](0x23,_0x14ac73)+'px',_0x4c54e9[_0xf7189d(0x20c)][_0xf7189d(0x2aa)]=Math[_0xf7189d(0x2a8)](0x10,_0xada8aa)+'px';});},_0x15aaf1=new ResizeObserver(_0x500072=>{const _0x249d43=_0x4e7c8c;for(let _0x3acc4c of _0x500072){const {width:_0x4462f5,height:_0x479e12}=_0x3acc4c[_0x249d43(0x201)],_0x1b651b=_0x479e12>_0x4462f5*0.95;_0x1b651b?(_0x227689['style'][_0x249d43(0x207)]='column',[_0x27a95b,_0x4248fa]['forEach'](_0x5029e7=>{const _0x161601=_0x249d43;_0x5029e7[_0x161601(0x20c)][_0x161601(0x258)]=_0x161601(0x3ae),_0x5029e7['style'][_0x161601(0x378)]=_0x161601(0x381);}),_0x59433b(_0x479e12/0x2)):(_0x227689[_0x249d43(0x20c)][_0x249d43(0x207)]=_0x249d43(0x418),[_0x27a95b,_0x4248fa]['forEach'](_0x2a99ec=>{const _0x16b347=_0x249d43;_0x2a99ec['style'][_0x16b347(0x258)]=_0x16b347(0x381),_0x2a99ec[_0x16b347(0x20c)][_0x16b347(0x378)]=_0x16b347(0x3ae);}),_0x59433b(_0x4462f5/0x2));}});_0x644df8[_0x4e7c8c(0x330)]=_0x15aaf1,_0x15aaf1[_0x4e7c8c(0x2cc)](_0x227689);}function _0x18640a(_0x596e80){const _0x5c1292=_0x5477b5,_0x45c6d2=_0x596e80[_0x5c1292(0x2b5)](_0x5c1292(0x387));if(!_0x45c6d2)return;_0x486bb6(_0x596e80),_0x596e80[_0x5c1292(0x2d5)][_0x5c1292(0x3cf)]=_0x5c1292(0x298),_0x45c6d2[_0x5c1292(0x242)]='',_0x45c6d2[_0x5c1292(0x20c)][_0x5c1292(0x32b)]='0',_0x45c6d2[_0x5c1292(0x20c)][_0x5c1292(0x2e9)]=_0x5c1292(0x316),_0x45c6d2['style'][_0x5c1292(0x207)]=_0x5c1292(0x3ff);let _0x10dc86=[],_0x208423=0x0;const _0x4896c2=document[_0x5c1292(0x307)](_0x5c1292(0x1ea));_0x4896c2[_0x5c1292(0x32c)]=_0x5c1292(0x24c);const _0x393dcb=document[_0x5c1292(0x307)](_0x5c1292(0x1ee));_0x393dcb[_0x5c1292(0x32c)]=_0x5c1292(0x2c4),_0x393dcb['alt']=_0x5c1292(0x2b7);const _0x435af9=document[_0x5c1292(0x307)]('p');_0x435af9['className']=_0x5c1292(0x3b1),_0x435af9['textContent']=_0x5c1292(0x22e),_0x4896c2['append'](_0x393dcb,_0x435af9);const _0xfc27ba=document[_0x5c1292(0x307)]('div');_0xfc27ba[_0x5c1292(0x32c)]=_0x5c1292(0x374);const _0x3f1194=document['createElement'](_0x5c1292(0x334));_0x3f1194['className']=_0x5c1292(0x39f),_0x3f1194[_0x5c1292(0x242)]=_0x5c1292(0x273),_0x3f1194['disabled']=!![];const _0x25b92b=document[_0x5c1292(0x307)]('button');_0x25b92b[_0x5c1292(0x32c)]=_0x5c1292(0x39f),_0x25b92b[_0x5c1292(0x242)]=_0x5c1292(0x25b);const _0x1101a9=document['createElement'](_0x5c1292(0x334));_0x1101a9['className']=_0x5c1292(0x39f),_0x1101a9[_0x5c1292(0x242)]=_0x5c1292(0x332),_0x1101a9['disabled']=!![];const _0x24738e=document[_0x5c1292(0x307)](_0x5c1292(0x362));_0x24738e[_0x5c1292(0x313)]=_0x5c1292(0x29e),_0x24738e[_0x5c1292(0x2ae)]=!![],_0x24738e[_0x5c1292(0x1fb)]=_0x5c1292(0x3af),_0x24738e[_0x5c1292(0x20c)]['display']=_0x5c1292(0x310),_0xfc27ba[_0x5c1292(0x3a9)](_0x3f1194,_0x25b92b,_0x1101a9,_0x24738e),_0x45c6d2[_0x5c1292(0x3a9)](_0x4896c2,_0xfc27ba);const _0x2a2224=()=>{const _0x2a353b=_0x5c1292;_0x10dc86[_0x2a353b(0x284)]>0x0?(_0x393dcb[_0x2a353b(0x2d1)]=_0x10dc86[_0x208423],_0x393dcb['style'][_0x2a353b(0x2e9)]='block',_0x435af9[_0x2a353b(0x20c)]['display']=_0x2a353b(0x310),_0x3f1194[_0x2a353b(0x3b9)]=![],_0x1101a9['disabled']=![]):(_0x393dcb[_0x2a353b(0x20c)][_0x2a353b(0x2e9)]=_0x2a353b(0x310),_0x435af9['style'][_0x2a353b(0x2e9)]=_0x2a353b(0x39d),_0x3f1194[_0x2a353b(0x3b9)]=!![],_0x1101a9[_0x2a353b(0x3b9)]=!![]);};_0x25b92b[_0x5c1292(0x214)]=()=>{const _0x201655=_0x5c1292;_0x24738e[_0x201655(0x3f6)]();},_0x24738e['onchange']=_0x2b9144=>{const _0x51dc8b=_0x5c1292,_0xa49269=_0x2b9144['target']['files'];if(!_0xa49269||_0xa49269[_0x51dc8b(0x284)]===0x0)return;_0x10dc86=Array[_0x51dc8b(0x2d8)](_0xa49269)[_0x51dc8b(0x36a)](_0xf60a5f=>URL[_0x51dc8b(0x2d4)](_0xf60a5f)),_0x208423=0x0,_0x2a2224();},_0x3f1194[_0x5c1292(0x214)]=()=>{const _0x59185e=_0x5c1292;if(_0x10dc86[_0x59185e(0x284)]===0x0)return;_0x208423=(_0x208423-0x1+_0x10dc86[_0x59185e(0x284)])%_0x10dc86[_0x59185e(0x284)],_0x2a2224();},_0x1101a9['onclick']=()=>{const _0x6535d8=_0x5c1292;if(_0x10dc86['length']===0x0)return;_0x208423=(_0x208423+0x1)%_0x10dc86[_0x6535d8(0x284)],_0x2a2224();};}function _0x56de78(_0x50483f){const _0x3a3efc=_0x5477b5,_0x295677=_0x50483f['querySelector'](_0x3a3efc(0x387));if(!_0x295677)return;_0x295677['innerHTML']='',_0x295677['style'][_0x3a3efc(0x32b)]='0',_0x295677[_0x3a3efc(0x20c)][_0x3a3efc(0x32f)]=_0x3a3efc(0x321);const _0x5c03a9=document[_0x3a3efc(0x307)](_0x3a3efc(0x1ea));_0x5c03a9['className']='calculator-grid';const _0x1e60dc=document['createElement'](_0x3a3efc(0x1ea));_0x1e60dc[_0x3a3efc(0x32c)]='calculator-display';const _0x5a5e49=document[_0x3a3efc(0x307)](_0x3a3efc(0x1ea));_0x5a5e49['id']=_0x3a3efc(0x3a5),_0x5a5e49[_0x3a3efc(0x242)]=_0x3a3efc(0x2a2);const _0x78f113=document[_0x3a3efc(0x307)](_0x3a3efc(0x1ea));_0x78f113['id']=_0x3a3efc(0x372),_0x78f113['textContent']='0',_0x1e60dc[_0x3a3efc(0x3a9)](_0x5a5e49,_0x78f113);const _0x25d5a5=document[_0x3a3efc(0x307)](_0x3a3efc(0x1ea));_0x25d5a5[_0x3a3efc(0x32c)]='calculator-buttons';const _0x34ffe4=[{'text':_0x3a3efc(0x2a7),'class':_0x3a3efc(0x2ab)},{'text':_0x3a3efc(0x2a1),'class':_0x3a3efc(0x2ab)},{'text':_0x3a3efc(0x359),'class':_0x3a3efc(0x2ab)},{'text':'log','class':'function'},{'text':'ln','class':_0x3a3efc(0x2ab)},{'text':'(','class':_0x3a3efc(0x2ab)},{'text':')','class':_0x3a3efc(0x2ab)},{'text':'√','class':_0x3a3efc(0x2ab)},{'text':'^','class':_0x3a3efc(0x2ab)},{'text':'!','class':_0x3a3efc(0x2ab)},{'text':'7','class':_0x3a3efc(0x3df)},{'text':'8','class':_0x3a3efc(0x3df)},{'text':'9','class':_0x3a3efc(0x3df)},{'text':'÷','class':_0x3a3efc(0x42b)},{'text':'AC','class':'ac'},{'text':'4','class':_0x3a3efc(0x3df)},{'text':'5','class':_0x3a3efc(0x3df)},{'text':'6','class':_0x3a3efc(0x3df)},{'text':'×','class':_0x3a3efc(0x42b)},{'text':'C','class':_0x3a3efc(0x42b)},{'text':'1','class':_0x3a3efc(0x3df)},{'text':'2','class':_0x3a3efc(0x3df)},{'text':'3','class':_0x3a3efc(0x3df)},{'text':'-','class':'operator'},{'text':'=','class':_0x3a3efc(0x1e8)},{'text':'0','class':_0x3a3efc(0x3df)},{'text':'.','class':_0x3a3efc(0x3df)},{'text':'π','class':'number'},{'text':'+','class':'operator'}];_0x34ffe4[_0x3a3efc(0x270)](_0x133890=>{const _0x1f8df2=_0x3a3efc,_0x3206eb=document[_0x1f8df2(0x307)](_0x1f8df2(0x334));_0x3206eb[_0x1f8df2(0x24d)]=_0x133890['text'],_0x3206eb[_0x1f8df2(0x32c)]=_0x1f8df2(0x423)+_0x133890['class'],_0x3206eb['dataset'][_0x1f8df2(0x296)]=_0x133890[_0x1f8df2(0x433)];if(_0x133890[_0x1f8df2(0x433)]==='=')_0x3206eb[_0x1f8df2(0x20c)]['gridRow']=_0x1f8df2(0x434);_0x25d5a5[_0x1f8df2(0x379)](_0x3206eb);}),_0x5c03a9[_0x3a3efc(0x3a9)](_0x1e60dc,_0x25d5a5),_0x295677[_0x3a3efc(0x379)](_0x5c03a9);let _0x391751='',_0x28b619='';const _0x5d070a=()=>{const _0x3580c4=_0x3a3efc;_0x5a5e49[_0x3580c4(0x242)]=_0x391751['replace'](/\*/g,'×')[_0x3580c4(0x2b6)](/\//g,'÷')||_0x3580c4(0x2a2),_0x78f113['textContent']=_0x28b619||'0';},_0x2d17c4=_0x272d5f=>_0x272d5f<=0x1?0x1:_0x272d5f*_0x2d17c4(_0x272d5f-0x1);_0x25d5a5[_0x3a3efc(0x31a)](_0x3a3efc(0x3f6),_0x354c20=>{const _0x5e85cb=_0x3a3efc;if(!_0x354c20[_0x5e85cb(0x38c)][_0x5e85cb(0x2b8)](_0x5e85cb(0x210)))return;const _0x2ec5e7=_0x354c20[_0x5e85cb(0x38c)][_0x5e85cb(0x2d5)]['value'];switch(_0x2ec5e7){case'AC':_0x391751='',_0x28b619='';break;case'C':_0x391751=_0x391751['slice'](0x0,-0x1);break;case'=':try{let _0x1fd389=_0x391751[_0x5e85cb(0x2b6)](/×/g,'*')['replace'](/÷/g,'/')[_0x5e85cb(0x2b6)](/√/g,_0x5e85cb(0x38f))[_0x5e85cb(0x2b6)](/\^/g,'**')[_0x5e85cb(0x2b6)](/log/g,_0x5e85cb(0x3e6))['replace'](/ln/g,'Math.log')['replace'](/sin/g,_0x5e85cb(0x26b))[_0x5e85cb(0x2b6)](/cos/g,_0x5e85cb(0x297))[_0x5e85cb(0x2b6)](/tan/g,_0x5e85cb(0x27a))[_0x5e85cb(0x2b6)](/π/g,_0x5e85cb(0x3ca))[_0x5e85cb(0x2b6)](/(\d+)!/g,(_0x53358f,_0x2fdd2c)=>_0x2d17c4(parseInt(_0x2fdd2c)));_0x28b619=new Function('return\x20'+_0x1fd389)(),_0x391751=_0x28b619[_0x5e85cb(0x34c)]();}catch(_0xa8fceb){_0x28b619='Error',_0x391751='';}break;default:_0x28b619===_0x5e85cb(0x247)&&(_0x28b619='',_0x391751='');_0x391751+=_0x2ec5e7;break;}_0x5d070a();});const _0x1928d4=_0x5c03a9['querySelectorAll'](_0x3a3efc(0x210)),_0x69f902=()=>{const _0x3ed001=_0x3a3efc,_0x5253d0=_0x295677[_0x3ed001(0x35d)],_0x42d534=_0x5253d0/0x14;_0x78f113[_0x3ed001(0x20c)][_0x3ed001(0x2aa)]=Math[_0x3ed001(0x2a8)](0x18,_0x42d534*1.5)+'px',_0x5a5e49[_0x3ed001(0x20c)][_0x3ed001(0x2aa)]=Math['max'](0xe,_0x42d534*0.675)+'px',_0x1928d4[_0x3ed001(0x270)](_0x1c09f2=>{const _0x2681ba=_0x3ed001;_0x1c09f2[_0x2681ba(0x3b8)][_0x2681ba(0x2a4)]('function')?_0x1c09f2[_0x2681ba(0x20c)]['fontSize']=Math[_0x2681ba(0x2a8)](0xc,_0x42d534*0.675)+'px':_0x1c09f2[_0x2681ba(0x20c)][_0x2681ba(0x2aa)]=Math[_0x2681ba(0x2a8)](0xe,_0x42d534*0.75)+'px';});},_0x136b3e=new ResizeObserver(_0x69f902);_0x50483f[_0x3a3efc(0x330)]=_0x136b3e,_0x136b3e[_0x3a3efc(0x2cc)](_0x295677),_0x69f902();}function _0xba4866(){const _0x50563a=_0x5477b5,_0x11f248=document['createElement'](_0x50563a(0x1ea));_0x11f248[_0x50563a(0x32c)]=_0x50563a(0x3ea);const _0x12e85d=document['querySelectorAll'](_0x50563a(0x256))[_0x50563a(0x284)],_0x5ab242=_0x2ecbd2();_0x11f248[_0x50563a(0x20c)][_0x50563a(0x325)]=0x1e*_0x12e85d+'px',_0x11f248[_0x50563a(0x20c)][_0x50563a(0x2d7)]=0x1e*_0x12e85d+'px',_0x11f248[_0x50563a(0x20c)]['width']=(window[_0x50563a(0x2f3)]-_0x5ab242)/0x2+'px',_0x11f248[_0x50563a(0x20c)]['height']=window[_0x50563a(0x281)]/0x2+'px',_0x11f248['annotationCurrentColor']=_0x50563a(0x390);const _0x1435ea=document[_0x50563a(0x307)](_0x50563a(0x1ea));_0x1435ea['className']=_0x50563a(0x2ba),_0x11f248[_0x50563a(0x379)](_0x1435ea);const _0x41f996=document[_0x50563a(0x307)]('div');_0x41f996[_0x50563a(0x32c)]=_0x50563a(0x340);const _0x258417=document[_0x50563a(0x307)](_0x50563a(0x334));_0x258417[_0x50563a(0x242)]=_0x50563a(0x360),_0x258417[_0x50563a(0x249)]=_0x50563a(0x2b9),_0x258417[_0x50563a(0x3b8)][_0x50563a(0x403)](_0x50563a(0x335));const _0x18e480=document[_0x50563a(0x307)](_0x50563a(0x334));_0x18e480[_0x50563a(0x242)]=_0x50563a(0x42a),_0x18e480['title']=_0x50563a(0x23a);const _0x624eed=document[_0x50563a(0x307)]('div');_0x624eed[_0x50563a(0x32c)]='custom-color-palette\x20hidden',_0x41f996[_0x50563a(0x379)](_0x624eed);const _0x2d4463=[_0x50563a(0x390),_0x50563a(0x231),_0x50563a(0x3fc),_0x50563a(0x302),_0x50563a(0x315),_0x50563a(0x3d4),_0x50563a(0x202),_0x50563a(0x2bb),_0x50563a(0x289),'#34C759','#30D5C8',_0x50563a(0x303),_0x50563a(0x2fb),'#5856D6',_0x50563a(0x32a),'#A2845E'];_0x2d4463[_0x50563a(0x270)](_0x24a6d2=>{const _0x529b6c=_0x50563a,_0x422219=document['createElement'](_0x529b6c(0x1ea));_0x422219[_0x529b6c(0x32c)]=_0x529b6c(0x3fe),_0x422219[_0x529b6c(0x20c)]['backgroundColor']=_0x24a6d2,_0x422219[_0x529b6c(0x31a)](_0x529b6c(0x3f6),_0x1401c0=>{const _0x373bc0=_0x529b6c;_0x1401c0[_0x373bc0(0x34e)](),_0x11f248['annotationCurrentColor']=_0x24a6d2,_0x18e480[_0x373bc0(0x20c)][_0x373bc0(0x27c)]=_0x24a6d2,_0x11f248[_0x373bc0(0x21e)]&&(_0x11f248['annotationContext'][_0x373bc0(0x2b4)]=_0x24a6d2),_0x624eed['classList'][_0x373bc0(0x403)](_0x373bc0(0x321));}),_0x624eed[_0x529b6c(0x379)](_0x422219);}),_0x18e480[_0x50563a(0x31a)](_0x50563a(0x3f6),_0x4fe13e=>{const _0x116a7a=_0x50563a;_0x4fe13e[_0x116a7a(0x34e)](),document[_0x116a7a(0x361)](_0x116a7a(0x1f9))[_0x116a7a(0x270)](_0x5079b0=>{const _0x27e479=_0x116a7a;if(_0x5079b0!==_0x624eed)_0x5079b0[_0x27e479(0x3b8)][_0x27e479(0x403)](_0x27e479(0x321));}),_0x624eed[_0x116a7a(0x3b8)][_0x116a7a(0x3fd)](_0x116a7a(0x321));});const _0x1d43a7=document[_0x50563a(0x307)]('button');_0x1d43a7[_0x50563a(0x242)]=_0x50563a(0x31f),_0x1d43a7[_0x50563a(0x249)]='Undo';const _0x19442d=document[_0x50563a(0x307)]('button');_0x19442d[_0x50563a(0x242)]='<i\x20class=\x22fas\x20fa-trash\x22></i>',_0x19442d['title']=_0x50563a(0x3fa),_0x41f996[_0x50563a(0x3a9)](_0x258417,_0x18e480,_0x1d43a7,_0x19442d),_0x1435ea[_0x50563a(0x379)](_0x41f996),_0x258417['addEventListener'](_0x50563a(0x3f6),()=>{const _0x5846d3=_0x50563a;_0x258417[_0x5846d3(0x3b8)]['toggle'](_0x5846d3(0x3bd));const _0x1088f5=_0x11f248['querySelector'](_0x5846d3(0x387));if(!_0x1088f5)return;if(_0x258417[_0x5846d3(0x3b8)][_0x5846d3(0x2a4)](_0x5846d3(0x3bd))){const _0x546cef=document[_0x5846d3(0x307)](_0x5846d3(0x382));_0x546cef[_0x5846d3(0x32c)]=_0x5846d3(0x394),_0x1088f5['appendChild'](_0x546cef),_0x11f248[_0x5846d3(0x2a5)]=_0x546cef,_0x11f248[_0x5846d3(0x416)]=[];const _0x176d48=_0x546cef[_0x5846d3(0x3e0)]('2d');_0x11f248[_0x5846d3(0x21e)]=_0x176d48;let _0x1f4d54=![];const _0x27e112=new ResizeObserver(_0xe09411=>{const _0x333b67=_0x5846d3;for(let _0x2846c5 of _0xe09411){const _0x472dc2=_0x176d48['getImageData'](0x0,0x0,_0x546cef[_0x333b67(0x378)],_0x546cef[_0x333b67(0x258)]);_0x546cef[_0x333b67(0x378)]=_0x2846c5[_0x333b67(0x201)][_0x333b67(0x378)],_0x546cef[_0x333b67(0x258)]=_0x2846c5[_0x333b67(0x201)][_0x333b67(0x258)],_0x176d48[_0x333b67(0x26d)](_0x472dc2,0x0,0x0),_0x176d48[_0x333b67(0x2b4)]=_0x11f248[_0x333b67(0x1e4)],_0x176d48['lineWidth']=0x5,_0x176d48[_0x333b67(0x208)]='round',_0x176d48[_0x333b67(0x217)]=_0x333b67(0x419);}});_0x27e112['observe'](_0x1088f5),_0x11f248[_0x5846d3(0x250)]=_0x27e112,_0x546cef[_0x5846d3(0x378)]=_0x1088f5[_0x5846d3(0x35d)],_0x546cef[_0x5846d3(0x258)]=_0x1088f5['clientHeight'],_0x176d48[_0x5846d3(0x2b4)]=_0x11f248[_0x5846d3(0x1e4)],_0x176d48[_0x5846d3(0x1fd)]=0x5,_0x176d48[_0x5846d3(0x208)]=_0x5846d3(0x419),_0x176d48[_0x5846d3(0x217)]=_0x5846d3(0x419),_0x18e480[_0x5846d3(0x20c)][_0x5846d3(0x27c)]=_0x11f248[_0x5846d3(0x1e4)];const _0x12433a=_0x4b3a8d=>{const _0x3243ef=_0x5846d3;_0x3ded38(_0x546cef,_0x176d48,_0x11f248[_0x3243ef(0x416)]),_0x1f4d54=!![],_0x176d48[_0x3243ef(0x3e1)]();const _0x5d3dda=_0x546cef[_0x3243ef(0x2c1)]();_0x176d48[_0x3243ef(0x436)](_0x4b3a8d['clientX']-_0x5d3dda[_0x3243ef(0x325)],_0x4b3a8d[_0x3243ef(0x3e7)]-_0x5d3dda['top']);},_0x1de672=_0x54c6ca=>{const _0x4ccebf=_0x5846d3;if(!_0x1f4d54)return;const _0x31e4fa=_0x546cef[_0x4ccebf(0x2c1)]();_0x176d48['lineTo'](_0x54c6ca[_0x4ccebf(0x2c9)]-_0x31e4fa[_0x4ccebf(0x325)],_0x54c6ca[_0x4ccebf(0x3e7)]-_0x31e4fa['top']),_0x176d48[_0x4ccebf(0x24f)]();},_0x6348b0=()=>{_0x1f4d54=![];};_0x546cef[_0x5846d3(0x31a)](_0x5846d3(0x280),_0x12433a),_0x546cef[_0x5846d3(0x31a)]('pointermove',_0x1de672),_0x546cef[_0x5846d3(0x31a)](_0x5846d3(0x377),_0x6348b0),_0x546cef[_0x5846d3(0x31a)](_0x5846d3(0x269),_0x6348b0);}else _0x11f248[_0x5846d3(0x2a5)]&&(_0x11f248[_0x5846d3(0x2a5)][_0x5846d3(0x22d)](),_0x11f248['annotationCanvas']=null,_0x11f248[_0x5846d3(0x21e)]=null),_0x11f248[_0x5846d3(0x250)]&&(_0x11f248[_0x5846d3(0x250)][_0x5846d3(0x375)](),_0x11f248[_0x5846d3(0x250)]=null);}),_0x1d43a7[_0x50563a(0x31a)]('click',()=>{const _0x556c65=_0x50563a;if(!_0x11f248[_0x556c65(0x21e)]||!_0x11f248['drawingHistory']||_0x11f248[_0x556c65(0x416)]['length']===0x0)return;const _0x2c5a0b=_0x11f248['drawingHistory'][_0x556c65(0x338)]();_0x11f248[_0x556c65(0x21e)]['putImageData'](_0x2c5a0b,0x0,0x0);}),_0x19442d['addEventListener'](_0x50563a(0x3f6),()=>{const _0x52d1b3=_0x50563a;if(!_0x11f248[_0x52d1b3(0x21e)])return;const _0x3140ed=_0x11f248[_0x52d1b3(0x21e)];_0x3ded38(_0x11f248[_0x52d1b3(0x2a5)],_0x3140ed,_0x11f248['drawingHistory']),_0x3140ed[_0x52d1b3(0x40c)](0x0,0x0,_0x3140ed[_0x52d1b3(0x382)]['width'],_0x3140ed['canvas'][_0x52d1b3(0x258)]);});const _0xfe93bc=document[_0x50563a(0x307)](_0x50563a(0x1ea));_0xfe93bc['className']=_0x50563a(0x301),_0x1435ea[_0x50563a(0x379)](_0xfe93bc),_0x11f248[_0x50563a(0x31a)](_0x50563a(0x280),()=>_0x14d756(_0x11f248));let _0x17457c,_0x2ed4cc;_0x1435ea[_0x50563a(0x2e7)]=_0x4659fc=>{const _0x589ab4=_0x50563a;if(_0x4659fc[_0x589ab4(0x38c)]['closest'](_0x589ab4(0x23e)))return;_0x4659fc[_0x589ab4(0x34e)](),_0x11f248[_0x589ab4(0x3b8)][_0x589ab4(0x22d)](_0x589ab4(0x1f1)),_0x11f248[_0x589ab4(0x20c)][_0x589ab4(0x222)]='1';const _0x394055=_0x11f248[_0x589ab4(0x2b5)]('.opacity-slider');if(_0x394055)_0x394055['value']=0x64;_0x17457c=_0x4659fc['clientX']-_0x11f248[_0x589ab4(0x355)],_0x2ed4cc=_0x4659fc[_0x589ab4(0x3e7)]-_0x11f248['offsetTop'];function _0x332c38(_0x4afad1){const _0x2c5244=_0x589ab4;let _0x36c510=_0x4afad1[_0x2c5244(0x2c9)]-_0x17457c,_0x11a8d0=_0x4afad1[_0x2c5244(0x3e7)]-_0x2ed4cc;_0x36c510=Math[_0x2c5244(0x419)](_0x36c510/_0x58c277)*_0x58c277,_0x11a8d0=Math[_0x2c5244(0x419)](_0x11a8d0/_0x58c277)*_0x58c277;const _0x5eeb7c=_0x2ecbd2();_0x36c510=Math[_0x2c5244(0x2a8)](0x0,Math['min'](_0x36c510,window[_0x2c5244(0x2f3)]-_0x5eeb7c-_0x11f248[_0x2c5244(0x31c)])),_0x11a8d0=Math[_0x2c5244(0x2a8)](0x0,Math[_0x2c5244(0x2dd)](_0x11a8d0,window['innerHeight']-_0x11f248['offsetHeight'])),_0x11f248[_0x2c5244(0x20c)][_0x2c5244(0x325)]=_0x36c510+'px',_0x11f248[_0x2c5244(0x20c)]['top']=_0x11a8d0+'px';}function _0x2052a6(){const _0x4f16f2=_0x589ab4;document['removeEventListener']('pointermove',_0x332c38),document[_0x4f16f2(0x2ec)]('pointerup',_0x2052a6),_0x5f290e(_0x11f248);}document[_0x589ab4(0x31a)]('pointermove',_0x332c38),document[_0x589ab4(0x31a)](_0x589ab4(0x377),_0x2052a6);};const _0x3050ce=0xa;let _0x10fbb1=![],_0x2ffb47='';_0x11f248[_0x50563a(0x31a)](_0x50563a(0x280),_0x4b3bc2=>{const _0xea847=_0x50563a,_0x22ad28=_0x11f248[_0xea847(0x2c1)](),_0x16e06b=_0x4b3bc2[_0xea847(0x3e7)]>=_0x22ad28[_0xea847(0x2d7)]&&_0x4b3bc2['clientY']<=_0x22ad28['top']+_0x3050ce,_0x192533=_0x4b3bc2['clientY']<=_0x22ad28[_0xea847(0x2c7)]&&_0x4b3bc2[_0xea847(0x3e7)]>=_0x22ad28['bottom']-_0x3050ce,_0x402196=_0x4b3bc2[_0xea847(0x2c9)]>=_0x22ad28[_0xea847(0x325)]&&_0x4b3bc2[_0xea847(0x2c9)]<=_0x22ad28[_0xea847(0x325)]+_0x3050ce,_0x111811=_0x4b3bc2[_0xea847(0x2c9)]<=_0x22ad28['right']&&_0x4b3bc2['clientX']>=_0x22ad28['right']-_0x3050ce;if(!_0x16e06b&&!_0x192533&&!_0x402196&&!_0x111811)return;_0x10fbb1=!![],_0x2ffb47='';if(_0x16e06b)_0x2ffb47+='n';if(_0x192533)_0x2ffb47+='s';if(_0x402196)_0x2ffb47+='w';if(_0x111811)_0x2ffb47+='e';_0x4b3bc2[_0xea847(0x367)]();let _0x2d664f=_0x4b3bc2[_0xea847(0x2c9)],_0x872848=_0x4b3bc2['clientY'];function _0x2bf0cb(_0x3e9308){const _0x3cef27=_0xea847,_0x179c59=_0x3e9308[_0x3cef27(0x2c9)]-_0x2d664f,_0x5d69d3=_0x3e9308[_0x3cef27(0x3e7)]-_0x872848;let _0x473c42=_0x11f248[_0x3cef27(0x31c)],_0x34b5d0=_0x11f248[_0x3cef27(0x23f)],_0x1c0da5=_0x11f248[_0x3cef27(0x355)],_0x50bf6d=_0x11f248[_0x3cef27(0x2a6)];if(_0x2ffb47[_0x3cef27(0x20a)]('e'))_0x473c42+=_0x179c59;_0x2ffb47[_0x3cef27(0x20a)]('w')&&(_0x473c42-=_0x179c59,_0x1c0da5+=_0x179c59);if(_0x2ffb47[_0x3cef27(0x20a)]('s'))_0x34b5d0+=_0x5d69d3;_0x2ffb47[_0x3cef27(0x20a)]('n')&&(_0x34b5d0-=_0x5d69d3,_0x50bf6d+=_0x5d69d3),_0x11f248[_0x3cef27(0x20c)][_0x3cef27(0x378)]=_0x473c42+'px',_0x11f248[_0x3cef27(0x20c)][_0x3cef27(0x258)]=_0x34b5d0+'px',_0x11f248[_0x3cef27(0x20c)][_0x3cef27(0x325)]=_0x1c0da5+'px',_0x11f248[_0x3cef27(0x20c)]['top']=_0x50bf6d+'px',_0x2d664f=_0x3e9308[_0x3cef27(0x2c9)],_0x872848=_0x3e9308['clientY'];}function _0x4d83bf(){const _0x3ebdd0=_0xea847;_0x10fbb1=![],document[_0x3ebdd0(0x2ec)](_0x3ebdd0(0x2a0),_0x2bf0cb),document[_0x3ebdd0(0x2ec)]('pointerup',_0x4d83bf);}document[_0xea847(0x31a)](_0xea847(0x2a0),_0x2bf0cb),document[_0xea847(0x31a)](_0xea847(0x377),_0x4d83bf);}),_0x11f248[_0x50563a(0x31a)](_0x50563a(0x1f8),_0x1c6201=>{const _0x2788d1=_0x50563a;if(_0x10fbb1)return;const _0x5eede9=_0x11f248[_0x2788d1(0x2c1)](),_0x302f35=_0x1c6201[_0x2788d1(0x3e7)]>=_0x5eede9[_0x2788d1(0x2d7)]&&_0x1c6201['clientY']<=_0x5eede9['top']+_0x3050ce,_0x1e8125=_0x1c6201['clientY']<=_0x5eede9[_0x2788d1(0x2c7)]&&_0x1c6201[_0x2788d1(0x3e7)]>=_0x5eede9['bottom']-_0x3050ce,_0x13c6d5=_0x1c6201[_0x2788d1(0x2c9)]>=_0x5eede9[_0x2788d1(0x325)]&&_0x1c6201[_0x2788d1(0x2c9)]<=_0x5eede9[_0x2788d1(0x325)]+_0x3050ce,_0x464d50=_0x1c6201[_0x2788d1(0x2c9)]<=_0x5eede9[_0x2788d1(0x20e)]&&_0x1c6201[_0x2788d1(0x2c9)]>=_0x5eede9[_0x2788d1(0x20e)]-_0x3050ce;if(_0x302f35&&_0x13c6d5||_0x1e8125&&_0x464d50)_0x11f248[_0x2788d1(0x20c)]['cursor']=_0x2788d1(0x2f1);else{if(_0x302f35&&_0x464d50||_0x1e8125&&_0x13c6d5)_0x11f248[_0x2788d1(0x20c)][_0x2788d1(0x1e0)]=_0x2788d1(0x226);else{if(_0x302f35||_0x1e8125)_0x11f248['style'][_0x2788d1(0x1e0)]=_0x2788d1(0x391);else{if(_0x13c6d5||_0x464d50)_0x11f248[_0x2788d1(0x20c)]['cursor']=_0x2788d1(0x36e);else _0x11f248[_0x2788d1(0x20c)][_0x2788d1(0x1e0)]=_0x2788d1(0x200);}}}});const _0x94c2b6=document[_0x50563a(0x307)]('input');_0x94c2b6[_0x50563a(0x313)]=_0x50563a(0x1e1),_0x94c2b6['className']='opacity-slider',_0x94c2b6[_0x50563a(0x2dd)]='10',_0x94c2b6[_0x50563a(0x2a8)]=_0x50563a(0x3eb),_0x94c2b6[_0x50563a(0x296)]=_0x50563a(0x3eb),_0x94c2b6[_0x50563a(0x249)]=_0x50563a(0x2b2),_0x94c2b6[_0x50563a(0x3f7)]=_0x3dd234=>{const _0xb2d303=_0x50563a;_0x11f248[_0xb2d303(0x20c)][_0xb2d303(0x222)]=_0x3dd234[_0xb2d303(0x38c)][_0xb2d303(0x296)]/0x64;},_0xfe93bc[_0x50563a(0x379)](_0x94c2b6);const _0x486eea=[{'type':_0x50563a(0x3db),'content':'◱','title':_0x50563a(0x2ed)},{'type':_0x50563a(0x236),'content':'◧','title':_0x50563a(0x25f)},{'type':_0x50563a(0x3a7),'content':'<svg\x20width=\x220.85em\x22\x20height=\x220.85em\x22\x20viewBox=\x220\x200\x2010\x2010\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20style=\x22display:\x20block;\x20stroke-width:\x201.5;\x20stroke:\x20currentColor;\x20margin:\x20auto;\x22><rect\x20x=\x220.5\x22\x20y=\x220.5\x22\x20width=\x229\x22\x20height=\x229\x22\x20fill=\x22none\x22\x20/><rect\x20x=\x220.5\x22\x20y=\x220.5\x22\x20width=\x229\x22\x20height=\x224.5\x22\x20fill=\x22currentColor\x22\x20/></svg>','title':_0x50563a(0x22a)},{'type':_0x50563a(0x33f),'content':'◼','title':_0x50563a(0x3ba)},{'type':'send-back','content':'<i\x20class=\x22fas\x20fa-level-down-alt\x22></i>','title':_0x50563a(0x33c)},{'type':_0x50563a(0x2d0),'content':'×','title':_0x50563a(0x28d)}];_0x486eea[_0x50563a(0x270)](_0x3b9956=>{const _0xaef46a=_0x50563a,_0x26e12c=document['createElement'](_0xaef46a(0x334));_0x26e12c[_0xaef46a(0x32c)]=_0x3b9956[_0xaef46a(0x313)]===_0xaef46a(0x2d0)?'close-btn':_0xaef46a(0x224),_0x26e12c[_0xaef46a(0x242)]=_0x3b9956[_0xaef46a(0x3ab)],_0x26e12c[_0xaef46a(0x249)]=_0x3b9956[_0xaef46a(0x249)],_0x26e12c[_0xaef46a(0x214)]=()=>{const _0xc3246d=_0xaef46a,_0x2c0c61=_0x2ecbd2(),_0x43ae14=window['innerWidth']-_0x2c0c61,_0x59b44d=window[_0xc3246d(0x281)],_0x3377b9=_0x43ae14/0x2,_0x4997ae=_0x59b44d/0x2;if(_0x3b9956[_0xc3246d(0x313)]===_0xc3246d(0x3db)){const _0x21f593=_0x11f248['offsetLeft']+_0x11f248[_0xc3246d(0x31c)]/0x2,_0x1e8e85=_0x11f248[_0xc3246d(0x2a6)]+_0x11f248[_0xc3246d(0x23f)]/0x2;_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x325)]=_0x21f593<_0x3377b9?_0xc3246d(0x21a):_0x3377b9+'px',_0x11f248[_0xc3246d(0x20c)]['top']=_0x1e8e85<_0x4997ae?_0xc3246d(0x21a):_0x4997ae+'px',_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x378)]=_0x3377b9+'px',_0x11f248['style'][_0xc3246d(0x258)]=_0x4997ae+'px';}else{if(_0x3b9956[_0xc3246d(0x313)]===_0xc3246d(0x236)){const _0x31cd56=_0x11f248[_0xc3246d(0x355)]+_0x11f248[_0xc3246d(0x31c)]/0x2;_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x325)]=_0x31cd56<_0x3377b9?_0xc3246d(0x21a):_0x3377b9+'px',_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x2d7)]=_0xc3246d(0x21a),_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x378)]=_0x3377b9+'px',_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x258)]=_0x59b44d+'px';}else{if(_0x3b9956[_0xc3246d(0x313)]===_0xc3246d(0x3a7)){const _0xe49ddd=_0x11f248[_0xc3246d(0x2a6)]+_0x11f248['offsetHeight']/0x2;_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x2d7)]=_0xe49ddd<_0x4997ae?_0xc3246d(0x21a):_0x4997ae+'px',_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x325)]=_0xc3246d(0x21a),_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x378)]=_0x43ae14+'px',_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x258)]=_0x4997ae+'px';}else{if(_0x3b9956[_0xc3246d(0x313)]===_0xc3246d(0x33f))_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x325)]='0',_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x2d7)]='0',_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x378)]=_0x43ae14+'px',_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x258)]=_0x59b44d+'px';else{if(_0x3b9956[_0xc3246d(0x313)]===_0xc3246d(0x3d2)){const _0x4400a2=document[_0xc3246d(0x361)](_0xc3246d(0x256));if(_0x4400a2[_0xc3246d(0x284)]<0x2)return;let _0x3282e0=Infinity;_0x4400a2[_0xc3246d(0x270)](_0x38219d=>{const _0x394734=_0xc3246d,_0x49bd58=parseInt(window[_0x394734(0x37d)](_0x38219d)[_0x394734(0x406)],0xa);!isNaN(_0x49bd58)&&_0x49bd58<_0x3282e0&&(_0x3282e0=_0x49bd58);}),_0x11f248[_0xc3246d(0x20c)][_0xc3246d(0x406)]=_0x3282e0-0x1,_0x11f248[_0xc3246d(0x3b8)][_0xc3246d(0x22d)](_0xc3246d(0x392));}else _0x3b9956[_0xc3246d(0x313)]==='close'&&(_0x486bb6(_0x11f248),_0x11f248[_0xc3246d(0x22d)]());}}}}},_0xfe93bc[_0xaef46a(0x379)](_0x26e12c);}),_0x11f248[_0x50563a(0x31a)](_0x50563a(0x3ce),_0x2b1e57=>_0x2b1e57['preventDefault']()),_0x11f248[_0x50563a(0x31a)](_0x50563a(0x400),_0x3fbd35);const _0x3ab3a3=document['createElement'](_0x50563a(0x1ea));_0x3ab3a3[_0x50563a(0x32c)]=_0x50563a(0x1f5);const _0x4a2ea7=document['createElement'](_0x50563a(0x1ea));_0x4a2ea7[_0x50563a(0x32c)]=_0x50563a(0x38a);const _0x1f0540=document[_0x50563a(0x307)](_0x50563a(0x1ea));_0x1f0540[_0x50563a(0x32c)]='win-sidebar',_0x3ab3a3[_0x50563a(0x3a9)](_0x4a2ea7,_0x1f0540),_0x11f248[_0x50563a(0x379)](_0x3ab3a3);const _0x48fbcf=[{'key':'d','icon':_0x50563a(0x3ed),'func':_0x419558,'title':_0x50563a(0x203)},{'key':'t','icon':_0x50563a(0x3f4),'func':_0xc55558,'title':_0x50563a(0x28c)},{'key':'0','icon':_0x50563a(0x1ff),'func':activateNumberedList,'title':_0x50563a(0x35b)},{'key':'w','icon':_0x50563a(0x36c),'func':_0x384c23,'title':'Webcam\x20(W)','premium':!![]},{'key':'v','icon':_0x50563a(0x3dd),'func':_0x18640a,'title':'Photo\x20Carousel\x20(V)','premium':!![]},{'key':'o','icon':_0x50563a(0x40b),'func':_0xd3760a,'title':_0x50563a(0x1f0),'premium':!![]},{'key':'h','icon':_0x50563a(0x219),'func':_0x34217a,'title':'Stopwatch\x20(H)','premium':!![]},{'key':'g','icon':'fas\x20fa-dice','func':_0x28c8ad,'title':_0x50563a(0x254),'premium':!![]},{'key':'a','icon':_0x50563a(0x2c8),'func':_0x20f5ed,'title':_0x50563a(0x3c4),'premium':!![]},{'key':'u','icon':_0x50563a(0x238),'func':_0x56de78,'title':_0x50563a(0x386),'premium':!![]}];_0x48fbcf[_0x50563a(0x270)](_0x4334a2=>{const _0x5763f7=_0x50563a,_0x35af0a=document[_0x5763f7(0x307)](_0x5763f7(0x334));_0x35af0a['className']=_0x5763f7(0x39e);_0x4334a2[_0x5763f7(0x376)]&&_0x35af0a[_0x5763f7(0x3b8)][_0x5763f7(0x403)](_0x5763f7(0x2e1));_0x35af0a[_0x5763f7(0x2d5)]['hotkey']=_0x4334a2[_0x5763f7(0x26a)],_0x35af0a[_0x5763f7(0x242)]=_0x5763f7(0x22b)+_0x4334a2[_0x5763f7(0x424)]+_0x5763f7(0x373),_0x35af0a[_0x5763f7(0x214)]=()=>{const _0x34e7e8=_0x5763f7;if(_0x4334a2[_0x34e7e8(0x376)]&&!window['TT'][_0x34e7e8(0x2de)]){_0x48c220();return;}_0x486bb6(_0x11f248),_0x4334a2[_0x34e7e8(0x29c)](_0x11f248);};const _0xd26780=document[_0x5763f7(0x307)](_0x5763f7(0x33d));_0xd26780['className']=_0x5763f7(0x398),_0xd26780[_0x5763f7(0x24d)]=_0x4334a2[_0x5763f7(0x26a)][_0x5763f7(0x263)]();const _0x2cd079=document[_0x5763f7(0x307)](_0x5763f7(0x33d));_0x2cd079[_0x5763f7(0x32c)]=_0x5763f7(0x3b4),_0x2cd079[_0x5763f7(0x24d)]=_0x4334a2[_0x5763f7(0x249)],_0x35af0a[_0x5763f7(0x3a9)](_0xd26780,_0x2cd079),_0x1f0540[_0x5763f7(0x379)](_0x35af0a);});const _0x227a69=document['createElement']('input');_0x227a69[_0x50563a(0x313)]=_0x50563a(0x29e),_0x227a69[_0x50563a(0x20c)][_0x50563a(0x2e9)]=_0x50563a(0x310),_0x227a69[_0x50563a(0x1fb)]=_0x50563a(0x253),_0x11f248[_0x50563a(0x379)](_0x227a69);const _0x2a083a=document['createElement']('button');_0x2a083a[_0x50563a(0x32c)]='icon-btn\x20upload-btn',_0x2a083a[_0x50563a(0x249)]=_0x50563a(0x3a1),_0x2a083a['innerHTML']=_0x50563a(0x1fe),_0x2a083a[_0x50563a(0x214)]=()=>_0x227a69['click'](),_0x227a69[_0x50563a(0x1e2)]=()=>{const _0x5a99b7=_0x50563a;_0x227a69[_0x5a99b7(0x21c)][_0x5a99b7(0x284)]>0x0&&_0x521dc2(_0x11f248,_0x227a69[_0x5a99b7(0x21c)][0x0]);},_0x1f0540[_0x50563a(0x379)](_0x2a083a);const _0xc36f70=document[_0x50563a(0x307)](_0x50563a(0x334));_0xc36f70[_0x50563a(0x32c)]='icon-btn\x20reset-content-btn',_0xc36f70[_0x50563a(0x249)]=_0x50563a(0x2ee),_0xc36f70['innerHTML']=_0x50563a(0x363),_0xc36f70[_0x50563a(0x214)]=()=>{const _0x1abee5=_0x50563a,_0xb841cd={'left':_0x11f248['style'][_0x1abee5(0x325)],'top':_0x11f248[_0x1abee5(0x20c)][_0x1abee5(0x2d7)],'width':_0x11f248['style'][_0x1abee5(0x378)],'height':_0x11f248[_0x1abee5(0x20c)][_0x1abee5(0x258)],'opacity':_0x11f248[_0x1abee5(0x20c)][_0x1abee5(0x222)]},_0x143db2=_0x11f248[_0x1abee5(0x3b8)][_0x1abee5(0x2a4)]('active-window');_0x486bb6(_0x11f248),_0x11f248[_0x1abee5(0x22d)]();const _0x56f896=_0xba4866();_0x56f896[_0x1abee5(0x20c)][_0x1abee5(0x325)]=_0xb841cd['left'],_0x56f896[_0x1abee5(0x20c)][_0x1abee5(0x2d7)]=_0xb841cd['top'],_0x56f896['style'][_0x1abee5(0x378)]=_0xb841cd['width'],_0x56f896[_0x1abee5(0x20c)][_0x1abee5(0x258)]=_0xb841cd['height'],_0x56f896['style'][_0x1abee5(0x222)]=_0xb841cd[_0x1abee5(0x222)];if(_0x143db2)_0x14d756(_0x56f896);},_0x1f0540[_0x50563a(0x379)](_0xc36f70);const _0x36749e=document[_0x50563a(0x307)](_0x50563a(0x1ea));return _0x36749e['className']=_0x50563a(0x21f),_0x36749e[_0x50563a(0x242)]=_0x50563a(0x3d1),_0x4a2ea7['appendChild'](_0x36749e),document[_0x50563a(0x20d)][_0x50563a(0x379)](_0x11f248),_0x11f248;}function _0x17685e(_0x1d8c19,_0x4c811d){const _0x3e8872=_0x5477b5,_0x4d9957=_0x1d8c19[_0x3e8872(0x2c1)](),_0x4bf8a8=_0x4c811d[_0x3e8872(0x2c1)](),_0x4d75e6=Math[_0x3e8872(0x2a8)](_0x4d9957['left'],_0x4bf8a8[_0x3e8872(0x325)]),_0x3df6c1=Math['max'](_0x4d9957[_0x3e8872(0x2d7)],_0x4bf8a8['top']),_0x23a0af=Math[_0x3e8872(0x2dd)](_0x4d9957['right'],_0x4bf8a8[_0x3e8872(0x20e)]),_0x38a27d=Math[_0x3e8872(0x2dd)](_0x4d9957[_0x3e8872(0x2c7)],_0x4bf8a8[_0x3e8872(0x2c7)]),_0x2c0af4=_0x23a0af-_0x4d75e6,_0x2e8c46=_0x38a27d-_0x3df6c1;if(_0x2c0af4<=0x0||_0x2e8c46<=0x0)return 0x0;const _0x1b670b=_0x2c0af4*_0x2e8c46,_0x13463f=_0x4bf8a8['width']*_0x4bf8a8[_0x3e8872(0x258)];return _0x1b670b/_0x13463f;}function _0x5f290e(_0x83236b){const _0x5a31d2=_0x5477b5,_0x4ff7d2=document[_0x5a31d2(0x361)](_0x5a31d2(0x256));for(const _0x1342a4 of _0x4ff7d2){if(_0x83236b===_0x1342a4)continue;const _0x14dea7=Math[_0x5a31d2(0x389)](_0x83236b[_0x5a31d2(0x31c)]-_0x1342a4[_0x5a31d2(0x31c)])<0x5,_0x5454db=Math[_0x5a31d2(0x389)](_0x83236b[_0x5a31d2(0x23f)]-_0x1342a4[_0x5a31d2(0x23f)])<0x5;if(_0x14dea7&&_0x5454db){const _0x353d6a=_0x17685e(_0x83236b,_0x1342a4);if(_0x353d6a>=0.55){_0x83236b[_0x5a31d2(0x20c)]['left']=_0x1342a4[_0x5a31d2(0x20c)][_0x5a31d2(0x325)],_0x83236b[_0x5a31d2(0x20c)][_0x5a31d2(0x2d7)]=_0x1342a4[_0x5a31d2(0x20c)][_0x5a31d2(0x2d7)],_0x83236b['style'][_0x5a31d2(0x222)]='0.3';const _0x1844af=_0x83236b['querySelector']('.opacity-slider');if(_0x1844af)_0x1844af['value']=0x1e;_0x83236b[_0x5a31d2(0x3b8)]['add'](_0x5a31d2(0x1f1));return;}}}}function _0x1f42b3(_0x3b17fe,_0xcced7d){const _0x7de24c=_0x5477b5;_0x120960[_0x7de24c(0x262)]===_0x3b17fe?(_0xa57f86(),_0x120960[_0x7de24c(0x262)]=null,_0x120960['isVisible']=!![],localStorage[_0x7de24c(0x257)](_0x7de24c(0x3a2))):(_0xcced7d(),_0x120960['activeLayout']=_0x3b17fe,_0x120960[_0x7de24c(0x1f3)]=!![],localStorage['setItem'](_0x7de24c(0x3a2),_0x3b17fe));}function _0x1d96b5(_0x30699a,_0x1ba33e=!![]){const _0x411cad=_0x5477b5,_0x3ad20e=_0x2ecbd2(),_0x3e05b4=window[_0x411cad(0x2f3)]-_0x3ad20e,_0x2b046a=window[_0x411cad(0x281)],_0x522544=_0x3e05b4/0x2,_0x10cd80=_0x2b046a/0x2;let _0x4d527d=[];switch(_0x30699a){case 0x1:_0x4d527d['push']({'left':'0','top':'0','width':_0x3e05b4+'px','height':_0x2b046a+'px'});break;case 0x2:_0x4d527d[_0x411cad(0x1e5)]({'left':'0px','top':'0px','width':_0x522544+'px','height':_0x2b046a+'px'},{'left':_0x522544+'px','top':_0x411cad(0x21a),'width':_0x522544+'px','height':_0x2b046a+'px'});break;case 0x3:_0x4d527d[_0x411cad(0x1e5)]({'left':_0x411cad(0x21a),'top':'0px','width':_0x522544+'px','height':_0x2b046a+'px'},{'left':_0x522544+'px','top':_0x411cad(0x21a),'width':_0x522544+'px','height':_0x10cd80+'px'},{'left':_0x522544+'px','top':_0x10cd80+'px','width':_0x522544+'px','height':_0x10cd80+'px'});break;case 0x4:_0x4d527d[_0x411cad(0x1e5)]({'left':_0x522544+'px','top':_0x411cad(0x21a),'width':_0x522544+'px','height':_0x2b046a+'px'},{'left':_0x411cad(0x21a),'top':_0x411cad(0x21a),'width':_0x522544+'px','height':_0x10cd80+'px'},{'left':_0x411cad(0x21a),'top':_0x10cd80+'px','width':_0x522544+'px','height':_0x10cd80+'px'});break;case 0x5:_0x4d527d[_0x411cad(0x1e5)]({'left':'0px','top':_0x411cad(0x21a),'width':_0x522544+'px','height':_0x10cd80+'px'},{'left':_0x522544+'px','top':'0px','width':_0x522544+'px','height':_0x10cd80+'px'},{'left':_0x411cad(0x21a),'top':_0x10cd80+'px','width':_0x522544+'px','height':_0x10cd80+'px'},{'left':_0x522544+'px','top':_0x10cd80+'px','width':_0x522544+'px','height':_0x10cd80+'px'});break;case 0x6:const _0x400a50=_0x3e05b4*0.1573605,_0x1150a3=_0x3e05b4*0.429875,_0x4e57d2=_0x3e05b4*0.4127645,_0x8949d3=_0x1150a3,_0x226024=_0x1150a3+_0x4e57d2;_0x4d527d[_0x411cad(0x1e5)]({'left':_0x411cad(0x21a),'top':_0x411cad(0x21a),'width':_0x1150a3+'px','height':_0x2b046a+'px'}),_0x4d527d[_0x411cad(0x1e5)]({'left':_0x8949d3+'px','top':_0x411cad(0x21a),'width':_0x4e57d2+'px','height':_0x2b046a+'px'}),_0x4d527d[_0x411cad(0x1e5)]({'left':_0x226024+'px','top':_0x411cad(0x21a),'width':_0x400a50+'px','height':_0x10cd80+'px'}),_0x4d527d[_0x411cad(0x1e5)]({'left':_0x226024+'px','top':_0x10cd80+'px','width':_0x400a50+'px','height':_0x10cd80+'px'});break;case 0x7:const _0x507969=_0x3e05b4*0.1573605,_0xfe7ac5=_0x3e05b4*0.429875,_0x33e02c=_0x3e05b4*0.4127645,_0x2589c7=_0xfe7ac5,_0x4da4c9=_0xfe7ac5+_0x33e02c;_0x4d527d[_0x411cad(0x1e5)]({'left':_0x411cad(0x21a),'top':'0px','width':_0xfe7ac5+'px','height':_0x2b046a+'px'}),_0x4d527d[_0x411cad(0x1e5)]({'left':_0x2589c7+'px','top':_0x411cad(0x21a),'width':_0x33e02c+'px','height':_0x10cd80+'px'}),_0x4d527d[_0x411cad(0x1e5)]({'left':_0x2589c7+'px','top':_0x10cd80+'px','width':_0x33e02c+'px','height':_0x10cd80+'px'}),_0x4d527d[_0x411cad(0x1e5)]({'left':_0x4da4c9+'px','top':_0x411cad(0x21a),'width':_0x507969+'px','height':_0x10cd80+'px'}),_0x4d527d['push']({'left':_0x4da4c9+'px','top':_0x10cd80+'px','width':_0x507969+'px','height':_0x10cd80+'px'});break;}_0x59a66b(_0x4d527d),_0x1ba33e&&_0xe80319(String(_0x30699a));}let _0x4827c1={};const _0x165afe=_0x1d2aff=>{const _0x44924e=_0x5477b5;if(!_0x4827c1[_0x44924e(0x26c)])return;const _0x5af353=infoTranslations[_0x1d2aff]||infoTranslations['en'];let _0x5195e1='<img\x20src=\x22ttlogo.png\x22\x20alt=\x22Teacher\x20Toybox\x20Logo\x22\x20class=\x22info-window-logo\x22><h2>'+_0x5af353[_0x44924e(0x249)]+_0x44924e(0x3a6)+_0x5af353[_0x44924e(0x2ac)]+_0x44924e(0x3bc);for(let _0x18eb8b=0x1;_0x18eb8b<=0x4;_0x18eb8b++){_0x5af353['section'+_0x18eb8b+_0x44924e(0x3f3)]&&(_0x5195e1+=_0x44924e(0x414)+_0x5af353[_0x44924e(0x251)+_0x18eb8b+_0x44924e(0x3f3)]+_0x44924e(0x2e0),_0x5af353[_0x44924e(0x251)+_0x18eb8b+_0x44924e(0x348)][_0x44924e(0x270)](_0x5e7a1e=>{const _0x354684=_0x44924e,_0x2ab3ad=_0x5e7a1e[_0x354684(0x318)](/:(.+)/s);_0x5195e1+=_0x354684(0x30c)+_0x2ab3ad[0x0]+_0x354684(0x351)+(_0x2ab3ad[_0x354684(0x284)]>0x1?_0x2ab3ad[0x1]['trim']():'')+_0x354684(0x220);}),_0x5195e1+=_0x44924e(0x39b));}_0x5195e1+=_0x44924e(0x28b)+_0x5af353['conclusion']+'</em></p>',_0x4827c1[_0x44924e(0x26c)][_0x44924e(0x242)]=_0x5195e1;},_0x4302f5=()=>{const _0x20f34d=_0x5477b5;if(!_0x4827c1[_0x20f34d(0x26c)])return;_0x4827c1[_0x20f34d(0x26c)]['style'][_0x20f34d(0x2aa)]='';let _0x598a64=0x8,_0x219827=parseFloat(window['getComputedStyle'](_0x4827c1[_0x20f34d(0x26c)])[_0x20f34d(0x2aa)]),_0x4d8611=_0x598a64;for(let _0x51d511=0x0;_0x51d511<0xa;_0x51d511++){let _0x456ef3=(_0x598a64+_0x219827)/0x2;_0x4827c1['wrapper'][_0x20f34d(0x20c)][_0x20f34d(0x2aa)]=_0x456ef3+'px',_0x4827c1[_0x20f34d(0x26c)][_0x20f34d(0x35a)]>_0x4827c1[_0x20f34d(0x26c)]['clientHeight']?_0x219827=_0x456ef3:(_0x4d8611=_0x456ef3,_0x598a64=_0x456ef3);}_0x4827c1[_0x20f34d(0x26c)][_0x20f34d(0x20c)]['fontSize']=_0x4d8611+'px';};window['TT']['updateInfoWindowLanguage']=_0xca6a47=>{const _0x50de8a=_0x5477b5,_0x167435=document['querySelector'](_0x50de8a(0x245));_0x167435&&(_0x165afe(_0xca6a47),_0x4302f5());};function _0x4bbb09(_0x1f4270=!![]){const _0x406605=_0x5477b5;_0xa57f86();const _0x238eb4=_0xba4866(),_0x404731=_0x2ecbd2();_0x238eb4[_0x406605(0x20c)][_0x406605(0x325)]=_0x406605(0x21a),_0x238eb4[_0x406605(0x20c)]['top']=_0x406605(0x21a),_0x238eb4[_0x406605(0x20c)][_0x406605(0x378)]=window[_0x406605(0x2f3)]-_0x404731+'px',_0x238eb4[_0x406605(0x20c)][_0x406605(0x258)]=window['innerHeight']+'px',_0x238eb4[_0x406605(0x20c)][_0x406605(0x397)]=_0x406605(0x310),_0x238eb4[_0x406605(0x20c)][_0x406605(0x3a4)]='0';const _0x122b5c=_0x238eb4['querySelector'](_0x406605(0x2e2));if(_0x122b5c)_0x122b5c[_0x406605(0x20c)][_0x406605(0x2e9)]=_0x406605(0x310);const _0x5789b3=_0x238eb4[_0x406605(0x2b5)](_0x406605(0x317));if(_0x5789b3)_0x5789b3[_0x406605(0x20c)][_0x406605(0x2e9)]='none';const _0x442629=_0x238eb4[_0x406605(0x2b5)](_0x406605(0x387));_0x442629&&(_0x442629[_0x406605(0x242)]='',_0x442629[_0x406605(0x20c)][_0x406605(0x32b)]='0',_0x442629[_0x406605(0x20c)][_0x406605(0x32f)]=_0x406605(0x321));const _0xf3edb4=document[_0x406605(0x307)](_0x406605(0x1ea));_0xf3edb4[_0x406605(0x32c)]=_0x406605(0x314),_0xf3edb4[_0x406605(0x20c)]['height']='100%',_0xf3edb4[_0x406605(0x20c)][_0x406605(0x306)]='relative';const _0x23cd7c=document['createElement'](_0x406605(0x1ea));_0x23cd7c['className']='info-content-wrapper',_0x4827c1[_0x406605(0x26c)]=_0x23cd7c;const _0x44b3d7=localStorage[_0x406605(0x2f4)](_0x406605(0x402))||'en';_0x165afe(_0x44b3d7),_0xf3edb4[_0x406605(0x3a9)](_0x23cd7c);if(_0x442629)_0x442629['appendChild'](_0xf3edb4);setTimeout(()=>{const _0x3f5898=_0x406605;_0x23cd7c['classList'][_0x3f5898(0x403)](_0x3f5898(0x35f));},0xa);if(_0x442629){const _0x2d9e9a=new ResizeObserver(()=>{requestAnimationFrame(_0x4302f5);});_0x2d9e9a[_0x406605(0x2cc)](_0x442629),_0x238eb4[_0x406605(0x330)]=_0x2d9e9a;}setTimeout(_0x4302f5,0x32),_0x238eb4[_0x406605(0x214)]=_0x17cda9=>{const _0x3cb392=_0x406605;(_0x17cda9[_0x3cb392(0x38c)]===_0x238eb4||_0x17cda9[_0x3cb392(0x38c)]===_0xf3edb4||_0x17cda9['target']===_0x442629)&&_0x3cf5d4();},_0x1f4270&&_0xe80319('i');}_0x40de68('addButton')['onclick']=()=>{const _0x10302c=_0x5477b5,_0x18230d=_0xba4866();_0x14d756(_0x18230d),_0xe80319('+'),_0x120960['activeLayout']=null,localStorage['removeItem'](_0x10302c(0x3a2));},document[_0x5477b5(0x361)](_0x5477b5(0x385))[_0x5477b5(0x270)](_0x5ea1e8=>{const _0x20e932=_0x5477b5;_0x5ea1e8[_0x20e932(0x214)]=()=>{const _0x188fde=_0x20e932,_0x449337=parseInt(_0x5ea1e8['id'][_0x188fde(0x36d)](/\d+/)[0x0]);_0x1f42b3(_0x449337,()=>_0x1d96b5(_0x449337));};}),_0x40de68(_0x5477b5(0x349))['onclick']=()=>{const _0x2993a7=_0x5477b5;if(_0x3cf5d4())return;_0x40de68('colorPicker')[_0x2993a7(0x3f6)](),_0x120960['activeLayout']=null,localStorage[_0x2993a7(0x257)](_0x2993a7(0x3a2));};const _0x3e4cc8=_0x40de68(_0x5477b5(0x42c)),_0x1b860b=_0x40de68('themePaletteButton');_0x1b860b&&(_0x1b860b[_0x5477b5(0x214)]=_0x44378c=>{const _0x22a3ed=_0x5477b5;_0x44378c[_0x22a3ed(0x34e)]();if(_0x3cf5d4())return;_0x3e4cc8[_0x22a3ed(0x3b8)][_0x22a3ed(0x3fd)]('hidden');});_0x3e4cc8&&_0x3e4cc8[_0x5477b5(0x31a)](_0x5477b5(0x3f6),_0x700410=>{const _0x12d25f=_0x5477b5;if(_0x700410[_0x12d25f(0x38c)]['classList'][_0x12d25f(0x2a4)](_0x12d25f(0x34d))){const _0x599264=_0x700410[_0x12d25f(0x38c)]['dataset'][_0x12d25f(0x27c)];_0x599264&&(_0x59eef0(_0x599264),localStorage[_0x12d25f(0x426)](_0x12d25f(0x2b1),_0x599264),_0x3e4cc8[_0x12d25f(0x3b8)]['add'](_0x12d25f(0x321)));}});_0x40de68(_0x5477b5(0x259))[_0x5477b5(0x3f7)]=_0x348663=>{const _0x396ebe=_0x5477b5;if(_0x3cf5d4())return;const _0x4391fc=_0x348663[_0x396ebe(0x38c)][_0x396ebe(0x296)];_0x59eef0(_0x4391fc),localStorage[_0x396ebe(0x426)](_0x396ebe(0x2b1),_0x4391fc),_0x120960['activeLayout']=null;};function _0x59eef0(_0x4ca806){const _0x2affa3=_0x5477b5;document[_0x2affa3(0x409)][_0x2affa3(0x20c)][_0x2affa3(0x323)](_0x2affa3(0x407),_0x4ca806),document[_0x2affa3(0x20d)]['classList'][_0x2affa3(0x3fd)]('custom-color',_0x4ca806[_0x2affa3(0x429)]()!==_0x32e743[_0x2affa3(0x429)]());const _0x2f6bb9=parseInt(_0x4ca806[_0x2affa3(0x3de)](0x1,0x3),0x10),_0x4f7cfe=parseInt(_0x4ca806[_0x2affa3(0x3de)](0x3,0x5),0x10),_0x133b1e=parseInt(_0x4ca806[_0x2affa3(0x3de)](0x5,0x7),0x10);document['documentElement']['style'][_0x2affa3(0x323)](_0x2affa3(0x3b6),_0x2f6bb9+',\x20'+_0x4f7cfe+',\x20'+_0x133b1e);}const _0x5cd18a=_0x40de68(_0x5477b5(0x324));_0x5cd18a&&(_0x5cd18a[_0x5477b5(0x214)]=()=>{const _0x42fa9a=_0x5477b5;if(_0x3cf5d4())return;_0x59eef0(_0x32e743),localStorage[_0x42fa9a(0x426)]('ttx_accentColor',_0x32e743),_0xe80319('↺'),_0x120960['activeLayout']=null;});let _0x1650b0=0x0;_0x40de68(_0x5477b5(0x322))[_0x5477b5(0x214)]=async()=>{const _0x3a1956=_0x5477b5;if(_0x3cf5d4())return;const _0x59e071=Date['now']();if(_0x59e071-_0x1650b0<0x12c){_0x59eef0(_0x32e743),localStorage[_0x3a1956(0x426)](_0x3a1956(0x2b1),_0x32e743),_0xe80319('↺'),_0x1650b0=0x0,_0x120960[_0x3a1956(0x262)]=null;return;}_0x1650b0=_0x59e071;const _0x45d9fe=new Map(),_0x49cab5=document[_0x3a1956(0x307)](_0x3a1956(0x382)),_0x2b01d5=_0x49cab5['getContext']('2d',{'willReadFrequently':!![]}),_0x391368=document['querySelectorAll'](_0x3a1956(0x393));if(_0x391368[_0x3a1956(0x284)]===0x0){_0xe80319('?');return;}_0xe80319(_0x3a1956(0x320));for(const _0x49b9f8 of _0x391368){try{if(_0x49b9f8['tagName']===_0x3a1956(0x25a)){if(!_0x49b9f8[_0x3a1956(0x27f)])await new Promise(_0xf3b1f4=>{const _0x540d0b=_0x3a1956;_0x49b9f8[_0x540d0b(0x40e)]=_0xf3b1f4;});_0x49cab5['width']=_0x49b9f8[_0x3a1956(0x36f)],_0x49cab5[_0x3a1956(0x258)]=_0x49b9f8[_0x3a1956(0x20f)];}else _0x49cab5[_0x3a1956(0x378)]=_0x49b9f8[_0x3a1956(0x378)],_0x49cab5[_0x3a1956(0x258)]=_0x49b9f8[_0x3a1956(0x258)];const _0x2766cc=document[_0x3a1956(0x20d)][_0x3a1956(0x3b8)][_0x3a1956(0x2a4)](_0x3a1956(0x2bc)),_0x51585f=_0x2766cc?_0x3a1956(0x390):_0x3a1956(0x212);_0x2b01d5[_0x3a1956(0x312)]=_0x51585f,_0x2b01d5[_0x3a1956(0x346)](0x0,0x0,_0x49cab5['width'],_0x49cab5['height']),_0x2b01d5['drawImage'](_0x49b9f8,0x0,0x0);const _0x94e4ff=_0x2b01d5[_0x3a1956(0x404)](0x0,0x0,_0x49cab5['width'],_0x49cab5['height'])[_0x3a1956(0x228)];for(let _0x1723b2=0x0;_0x1723b2<_0x94e4ff[_0x3a1956(0x284)];_0x1723b2+=0x14){const [_0x17745b,_0x44a380,_0x560c28,_0x1432d3]=[_0x94e4ff[_0x1723b2],_0x94e4ff[_0x1723b2+0x1],_0x94e4ff[_0x1723b2+0x2],_0x94e4ff[_0x1723b2+0x3]];if(_0x1432d3<0x80||Math[_0x3a1956(0x389)](_0x17745b-_0x44a380)<0x14&&Math[_0x3a1956(0x389)](_0x44a380-_0x560c28)<0x14||_0x17745b<0x14&&_0x44a380<0x14&&_0x560c28<0x14||_0x17745b>0xeb&&_0x44a380>0xeb&&_0x560c28>0xeb)continue;const _0x9a7b82=_0x17745b>>0x4,_0x72237c=_0x44a380>>0x4,_0x16338a=_0x560c28>>0x4,_0x1c5d6d=_0x9a7b82+','+_0x72237c+','+_0x16338a;_0x45d9fe[_0x3a1956(0x225)](_0x1c5d6d,(_0x45d9fe[_0x3a1956(0x337)](_0x1c5d6d)||0x0)+0x1);}}catch(_0x3b696a){console[_0x3a1956(0x294)]('Could\x20not\x20process\x20element\x20for\x20color\x20extraction:',_0x3b696a);}}if(_0x45d9fe[_0x3a1956(0x3be)]===0x0){_0xe80319('?');return;}const _0x2245da=[..._0x45d9fe[_0x3a1956(0x3ef)]()][_0x3a1956(0x216)]((_0x657f4b,_0x2a7125)=>_0x2a7125[0x1]>_0x657f4b[0x1]?_0x2a7125:_0x657f4b)[0x0],[_0x3e0e3b,_0x5031d2,_0x3a1598]=_0x2245da[_0x3a1956(0x318)](',')[_0x3a1956(0x36a)](_0x2a1678=>parseInt(_0x2a1678)<<0x4|parseInt(_0x2a1678)),_0xff909c=_0xc095aa=>_0xc095aa['toString'](0x10)['padStart'](0x2,'0'),_0x56308e='#'+_0xff909c(_0x3e0e3b)+_0xff909c(_0x5031d2)+_0xff909c(_0x3a1598);_0x59eef0(_0x56308e),localStorage[_0x3a1956(0x426)]('ttx_accentColor',_0x56308e),_0xe80319('🎨'),_0x120960[_0x3a1956(0x262)]=null;},_0x40de68(_0x5477b5(0x329))[_0x5477b5(0x214)]=()=>{const _0x34806b=_0x5477b5;if(_0x3cf5d4())return;const _0xe2414=_0x40de68('bellSound');_0xe2414['currentTime']=0x0,_0xe2414[_0x34806b(0x333)]();},_0x40de68(_0x5477b5(0x234))[_0x5477b5(0x214)]=()=>{const _0x537f65=_0x5477b5;if(_0x3cf5d4())return;const _0x2e82bc=_0x40de68(_0x537f65(0x3ac));_0x2e82bc['currentTime']=0x0,_0x2e82bc[_0x537f65(0x333)]()[_0x537f65(0x1f2)](()=>{});},(function(){const _0x3a57ad=_0x5477b5;let _0x320c22=![],_0x5501f0=null;const _0x717351=_0x46ce41=>{const _0xa07743=_0x22b5;if(!_0x5501f0)return;const _0x1019da=_0x46ce41[_0xa07743(0x2c9)]-0xa,_0x2d4364=_0x46ce41[_0xa07743(0x3e7)]-0xa;_0x5501f0[_0xa07743(0x20c)]['transform']=_0xa07743(0x3e9)+_0x1019da+_0xa07743(0x2ce)+_0x2d4364+_0xa07743(0x34a);},_0x3cf4c3=()=>{const _0x35f417=_0x22b5;if(_0x320c22)return;_0x5501f0=document[_0x35f417(0x307)](_0x35f417(0x1ea)),_0x5501f0['id']='laserDot',document['body'][_0x35f417(0x379)](_0x5501f0),document[_0x35f417(0x31a)](_0x35f417(0x2a0),_0x717351),_0x40de68(_0x35f417(0x345))[_0x35f417(0x3b8)][_0x35f417(0x403)]('active'),_0x320c22=!![];},_0x49838e=()=>{const _0x3511f7=_0x22b5;if(!_0x320c22)return;document[_0x3511f7(0x2ec)](_0x3511f7(0x2a0),_0x717351),_0x5501f0&&(_0x5501f0['remove'](),_0x5501f0=null),_0x40de68(_0x3511f7(0x345))[_0x3511f7(0x3b8)][_0x3511f7(0x22d)]('active'),_0x320c22=![];},_0x3f8527=()=>{if(_0x3cf5d4())return;_0x320c22?_0x49838e():_0x3cf4c3();},_0x4be56c=_0x40de68(_0x3a57ad(0x345));_0x4be56c&&(_0x4be56c[_0x3a57ad(0x214)]=_0x3f8527),global['TT']['turnOffLaser']=_0x49838e;}()),_0x40de68('infoButton')[_0x5477b5(0x214)]=()=>{const _0x384b77=_0x5477b5;_0x1f42b3(_0x384b77(0x2b3),()=>_0x4bbb09(!![]));};function _0x1e2fd2(){const _0x2b136f=_0x5477b5,_0x2eb48c=localStorage[_0x2b136f(0x2f4)]('ttx_lang')||'en',_0x539dd1=window['I18N'][_0x2eb48c]||window['I18N']['en'],_0x435864=_0x2b136f(0x205),_0x5e6774=_0x2b136f(0x327),_0x4de7d4='Teacher\x20Toybox',_0x27bc20=document[_0x2b136f(0x307)]('div');_0x27bc20[_0x2b136f(0x32c)]='share-backdrop';const _0x189a3d=document[_0x2b136f(0x307)](_0x2b136f(0x1ea));_0x189a3d[_0x2b136f(0x32c)]=_0x2b136f(0x352),_0x189a3d[_0x2b136f(0x242)]='\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20class=\x22close-modal-btn\x22>&times;</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<h3\x20data-i18n=\x22panel.share.title\x22>'+window['t'](_0x539dd1,_0x2b136f(0x3d9))+_0x2b136f(0x39c)+encodeURIComponent(_0x435864)+_0x2b136f(0x421)+encodeURIComponent(_0x435864)+_0x2b136f(0x265)+encodeURIComponent(_0x5e6774)+_0x2b136f(0x339)+encodeURIComponent(_0x435864)+_0x2b136f(0x427)+encodeURIComponent(_0x4de7d4)+_0x2b136f(0x23d)+encodeURIComponent(_0x5e6774)+_0x2b136f(0x2fd)+encodeURIComponent(_0x5e6774+'\x20'+_0x435864)+'\x22\x20target=\x22_blank\x22\x20class=\x22share-grid-btn\x20whatsapp\x22><i\x20class=\x22fab\x20fa-whatsapp\x22></i>\x20WhatsApp</a>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<a\x20href=\x22https://www.reddit.com/submit?url='+encodeURIComponent(_0x435864)+'&title='+encodeURIComponent(_0x4de7d4)+_0x2b136f(0x365)+encodeURIComponent(_0x4de7d4)+'&body='+encodeURIComponent(_0x5e6774)+_0x2b136f(0x3b5)+encodeURIComponent(_0x435864)+_0x2b136f(0x3b2)+_0x435864+_0x2b136f(0x3ec),document[_0x2b136f(0x20d)]['append'](_0x27bc20,_0x189a3d),setTimeout(()=>{const _0x5d0413=_0x2b136f;_0x27bc20['style'][_0x5d0413(0x222)]='1',_0x189a3d[_0x5d0413(0x20c)][_0x5d0413(0x222)]='1',_0x189a3d['style'][_0x5d0413(0x2f6)]=_0x5d0413(0x2f5);},0xa);const _0x44ab62=()=>{const _0x36f0c6=_0x2b136f;_0x27bc20[_0x36f0c6(0x20c)][_0x36f0c6(0x222)]='0',_0x189a3d[_0x36f0c6(0x20c)][_0x36f0c6(0x222)]='0',_0x189a3d['style'][_0x36f0c6(0x2f6)]='translate(-50%,\x20-50%)\x20scale(0.9)',setTimeout(()=>{const _0x398f8c=_0x36f0c6;_0x27bc20[_0x398f8c(0x22d)](),_0x189a3d[_0x398f8c(0x22d)]();},0x12c);};_0x27bc20['onclick']=_0x44ab62,_0x189a3d[_0x2b136f(0x2b5)](_0x2b136f(0x328))['onclick']=_0x44ab62;const _0x21873a=_0x189a3d['querySelector'](_0x2b136f(0x3d6)),_0x35736e=_0x189a3d[_0x2b136f(0x2b5)]('.copy-link-area\x20input');_0x21873a['onclick']=()=>{const _0x43c6e6=_0x2b136f,_0x429bf3=()=>{const _0x1117b5=_0x22b5;_0x21873a[_0x1117b5(0x24d)]='Copied!',_0x21873a[_0x1117b5(0x20c)]['backgroundColor']='var(--success-color)',setTimeout(()=>{const _0x4d8f73=_0x1117b5;_0x21873a[_0x4d8f73(0x24d)]=_0x4d8f73(0x28e),_0x21873a['style'][_0x4d8f73(0x364)]='';},0x7d0);};navigator[_0x43c6e6(0x2bf)]?navigator[_0x43c6e6(0x2bf)][_0x43c6e6(0x2ea)](_0x435864)[_0x43c6e6(0x411)](_0x429bf3):(_0x35736e['select'](),document[_0x43c6e6(0x41d)]('copy'),_0x429bf3());};}_0x40de68('shareButton')['onclick']=()=>{if(_0x3cf5d4())return;_0x1e2fd2();},_0x40de68(_0x5477b5(0x34f))[_0x5477b5(0x214)]=()=>{const _0x128585=_0x5477b5;global['TT'][_0x128585(0x27e)]&&global['TT'][_0x128585(0x27e)](),_0xa57f86(),_0xe80319('🗑️'),_0x120960[_0x128585(0x262)]=null,localStorage[_0x128585(0x257)](_0x128585(0x3a2));},_0x40de68(_0x5477b5(0x319))[_0x5477b5(0x214)]=_0x2e1946=>{const _0x5dc257=_0x5477b5;_0x2e1946[_0x5dc257(0x34e)]();if(_0x3cf5d4())return;_0x40de68('layout-bar')['classList']['remove']('open'),_0x40de68(_0x5dc257(0x40f))['classList'][_0x5dc257(0x22d)](_0x5dc257(0x2f9)),_0x40de68('help-bar')['classList'][_0x5dc257(0x22d)]('open');if(_0x3e55ac)_0x3e55ac[_0x5dc257(0x3b8)][_0x5dc257(0x22d)](_0x5dc257(0x2f9));_0x40de68(_0x5dc257(0x3f8))[_0x5dc257(0x3b8)][_0x5dc257(0x3fd)](_0x5dc257(0x2f9));},_0x40de68(_0x5477b5(0x2c6))[_0x5477b5(0x214)]=_0x2f0e69=>{const _0x175749=_0x5477b5;_0x2f0e69[_0x175749(0x34e)]();if(_0x3cf5d4())return;_0x40de68(_0x175749(0x3f8))[_0x175749(0x3b8)]['remove'](_0x175749(0x2f9)),_0x40de68(_0x175749(0x40f))['classList']['remove'](_0x175749(0x2f9)),_0x40de68(_0x175749(0x243))['classList']['remove'](_0x175749(0x2f9));if(_0x3e55ac)_0x3e55ac[_0x175749(0x3b8)][_0x175749(0x22d)](_0x175749(0x2f9));_0x40de68(_0x175749(0x309))[_0x175749(0x3b8)][_0x175749(0x3fd)](_0x175749(0x2f9));},_0x40de68(_0x5477b5(0x1ed))[_0x5477b5(0x214)]=_0x5b7e8c=>{const _0x4577b6=_0x5477b5;_0x5b7e8c[_0x4577b6(0x34e)]();if(_0x3cf5d4())return;_0x40de68(_0x4577b6(0x3f8))['classList'][_0x4577b6(0x22d)](_0x4577b6(0x2f9)),_0x40de68(_0x4577b6(0x309))[_0x4577b6(0x3b8)][_0x4577b6(0x22d)]('open'),_0x40de68(_0x4577b6(0x243))[_0x4577b6(0x3b8)]['remove'](_0x4577b6(0x2f9));if(_0x3e55ac)_0x3e55ac[_0x4577b6(0x3b8)][_0x4577b6(0x22d)](_0x4577b6(0x2f9));_0x40de68(_0x4577b6(0x40f))[_0x4577b6(0x3b8)][_0x4577b6(0x3fd)](_0x4577b6(0x2f9));},_0x40de68(_0x5477b5(0x38e))[_0x5477b5(0x214)]=_0x40e240=>{const _0x1117dd=_0x5477b5;_0x40e240[_0x1117dd(0x34e)]();if(_0x3cf5d4())return;_0x40de68('extra-tools-bar')['classList'][_0x1117dd(0x22d)]('open'),_0x40de68(_0x1117dd(0x309))[_0x1117dd(0x3b8)][_0x1117dd(0x22d)](_0x1117dd(0x2f9)),_0x40de68(_0x1117dd(0x40f))[_0x1117dd(0x3b8)][_0x1117dd(0x22d)](_0x1117dd(0x2f9));if(_0x3e55ac)_0x3e55ac[_0x1117dd(0x3b8)][_0x1117dd(0x22d)](_0x1117dd(0x2f9));_0x40de68(_0x1117dd(0x243))['classList'][_0x1117dd(0x3fd)](_0x1117dd(0x2f9));};const _0x45bebf=_0x40de68(_0x5477b5(0x20b));if(_0x45bebf)_0x45bebf[_0x5477b5(0x214)]=_0x48c220;if(_0x38a48c)_0x38a48c['onclick']=_0x100766;if(_0x2ac0e7)_0x2ac0e7[_0x5477b5(0x214)]=_0x100766;_0x51344f&&(_0x51344f[_0x5477b5(0x214)]=async()=>{const _0x101d25=_0x5477b5;if(!await auth0Client[_0x101d25(0x369)]()){login(_0x101d25(0x2c2));return;}_0x474cea();});let _0x4a632e,_0x253b8d,_0x23f29b,_0x5bb7ef;const _0x5a192e=(_0x26e753,_0x482b06,_0x1431a3)=>{const _0x5ad672=_0x5477b5,_0x4cc712=_0x40de68(_0x26e753),_0x1aac03=_0x40de68(_0x482b06);if(!_0x4cc712||!_0x1aac03)return;const _0x44ea1c=()=>{const _0x232a3b=_0x22b5;clearTimeout(_0x1431a3),_0x1431a3=setTimeout(()=>_0x1aac03[_0x232a3b(0x3b8)]['remove'](_0x232a3b(0x2f9)),0x7d0);},_0x116230=()=>clearTimeout(_0x1431a3);_0x4cc712['addEventListener']('mouseleave',_0x44ea1c),_0x1aac03[_0x5ad672(0x31a)](_0x5ad672(0x290),_0x44ea1c),_0x4cc712[_0x5ad672(0x31a)](_0x5ad672(0x268),_0x116230),_0x1aac03['addEventListener']('mouseenter',_0x116230);};_0x5a192e(_0x5477b5(0x2c6),_0x5477b5(0x309),_0x4a632e),_0x5a192e('extraToolsButton','extra-tools-bar',_0x253b8d),_0x5a192e('managementButton',_0x5477b5(0x40f),_0x23f29b),_0x5a192e(_0x5477b5(0x38e),_0x5477b5(0x243),_0x5bb7ef);const _0x3552fb=_0x40de68(_0x5477b5(0x1eb)),_0x229cb3=_0x40de68(_0x5477b5(0x1e7)),_0x459003=_0x40de68(_0x5477b5(0x206)),_0x1153e2=_0x40de68(_0x5477b5(0x417)),_0x4c7598=document[_0x5477b5(0x361)](_0x5477b5(0x30f)),_0x55f369=_0x40de68(_0x5477b5(0x1fc));let _0x56a055=0x0;function _0x225616(){const _0x607743=_0x5477b5;_0x459003&&_0x229cb3&&(_0x459003[_0x607743(0x3b8)][_0x607743(0x22d)](_0x607743(0x321)),_0x229cb3[_0x607743(0x3b8)][_0x607743(0x403)](_0x607743(0x2f9)));}function _0x402394(){const _0x5c8425=_0x5477b5;if(_0x229cb3&&_0x459003){const _0x3a3e31=localStorage[_0x5c8425(0x2f4)](_0x5c8425(0x402))||'en';_0x229cb3[_0x5c8425(0x3b8)][_0x5c8425(0x22d)](_0x5c8425(0x2f9)),_0x459003[_0x5c8425(0x3b8)]['add'](_0x5c8425(0x321)),setTimeout(()=>{const _0x4de7f9=_0x5c8425;_0x40de68(_0x4de7f9(0x3cc))[_0x4de7f9(0x296)]='',_0x56a055=0x0,_0x1d13a3(),_0x55f369[_0x4de7f9(0x3b9)]=![],_0x55f369[_0x4de7f9(0x20c)]['backgroundColor']='',_0x55f369[_0x4de7f9(0x24d)]=window['t'](window[_0x4de7f9(0x3c8)][_0x3a3e31],_0x4de7f9(0x2a9))||'Submit';},0x190);}}function _0x1d13a3(){const _0x297f88=_0x5477b5;_0x4c7598[_0x297f88(0x270)](_0x56a890=>{const _0x38b921=_0x297f88;parseInt(_0x56a890[_0x38b921(0x2d5)][_0x38b921(0x296)])<=_0x56a055?_0x56a890[_0x38b921(0x3b8)][_0x38b921(0x403)]('selected'):_0x56a890['classList'][_0x38b921(0x22d)]('selected');});}if(_0x3552fb)_0x3552fb[_0x5477b5(0x214)]=_0x225616;if(_0x1153e2)_0x1153e2[_0x5477b5(0x214)]=_0x402394;if(_0x459003)_0x459003['onclick']=_0x402394;_0x4c7598['forEach'](_0x44f38d=>{const _0x673184=_0x5477b5;_0x44f38d[_0x673184(0x31a)](_0x673184(0x3f6),()=>{const _0x20246e=_0x673184;_0x56a055=parseInt(_0x44f38d[_0x20246e(0x2d5)][_0x20246e(0x296)]),_0x1d13a3();});});_0x55f369&&(_0x55f369[_0x5477b5(0x214)]=async()=>{const _0x3ce1fa=_0x5477b5,_0x2c89e3=_0x40de68(_0x3ce1fa(0x3cc))['value'];if(_0x56a055===0x0&&!_0x2c89e3[_0x3ce1fa(0x384)]()){alert('Please\x20provide\x20a\x20rating\x20or\x20a\x20comment.');return;}const _0x1383b4=localStorage[_0x3ce1fa(0x2f4)](_0x3ce1fa(0x402))||'en';_0x55f369[_0x3ce1fa(0x3b9)]=!![],_0x55f369[_0x3ce1fa(0x24d)]=window['t'](window[_0x3ce1fa(0x3c8)][_0x1383b4],'panel.feedback.submitButtonSending')||_0x3ce1fa(0x2be);const _0x219b7f=new FormData();_0x219b7f['append'](_0x3ce1fa(0x3f0),_0x56a055),_0x219b7f[_0x3ce1fa(0x3a9)]('comment',_0x2c89e3);try{const _0x3ba208=await fetch('https://formspree.io/f/xovloydp',{'method':_0x3ce1fa(0x304),'body':_0x219b7f,'headers':{'Accept':_0x3ce1fa(0x36b)}});if(_0x3ba208['ok'])_0x55f369[_0x3ce1fa(0x24d)]=window['t'](window[_0x3ce1fa(0x3c8)][_0x1383b4],'panel.feedback.submitButtonSuccess')||_0x3ce1fa(0x26f),_0x55f369[_0x3ce1fa(0x20c)]['backgroundColor']='var(--success-color)',setTimeout(_0x402394,0x5dc);else throw new Error(_0x3ce1fa(0x40a));}catch(_0x3c32eb){console[_0x3ce1fa(0x294)](_0x3ce1fa(0x223),_0x3c32eb),alert(_0x3ce1fa(0x415)),_0x55f369[_0x3ce1fa(0x3b9)]=![],_0x55f369[_0x3ce1fa(0x24d)]=window['t'](window[_0x3ce1fa(0x3c8)][_0x1383b4],_0x3ce1fa(0x2a9))||'Submit';}});document[_0x5477b5(0x31a)](_0x5477b5(0x3f5),_0x2610c4=>{const _0xce6b89=_0x5477b5,_0x372c63=document[_0xce6b89(0x2b5)](_0xce6b89(0x30a)),_0x454da9=document['activeElement'],_0x257340=_0x454da9&&(_0x454da9[_0xce6b89(0x412)]||[_0xce6b89(0x39a),'TEXTAREA','SELECT'][_0xce6b89(0x20a)](_0x454da9[_0xce6b89(0x27b)]));if(_0x2610c4[_0xce6b89(0x26a)]===_0xce6b89(0x370)&&!_0x257340){_0x2610c4[_0xce6b89(0x367)](),_0xa57f86(),_0x2bc035=!![],_0xe80319(_0xce6b89(0x3a8)),_0x120960[_0xce6b89(0x262)]=null,localStorage[_0xce6b89(0x257)](_0xce6b89(0x3a2));return;}if(_0x2610c4[_0xce6b89(0x26a)]===_0xce6b89(0x336)&&!_0x257340){_0x2610c4[_0xce6b89(0x367)]();_0x372c63&&_0x372c63['querySelector']('.close-btn')?.[_0xce6b89(0x3f6)]();return;}if(_0x372c63&&_0x372c63[_0xce6b89(0x3b8)][_0xce6b89(0x2a4)](_0xce6b89(0x413))){if(_0x2610c4['key']==='Enter')_0x2610c4[_0xce6b89(0x367)](),_0x372c63['querySelector']('.timer-start-pause-btn')?.[_0xce6b89(0x3f6)]();else _0x2610c4[_0xce6b89(0x41e)]===_0xce6b89(0x37a)&&!_0x257340&&(_0x2610c4[_0xce6b89(0x367)](),_0x372c63[_0xce6b89(0x2b5)](_0xce6b89(0x25c))?.[_0xce6b89(0x3f6)]());}if(!_0x2bc035||_0x257340)return;if(_0x2610c4[_0xce6b89(0x26a)]==='`'){document['querySelectorAll'](_0xce6b89(0x432))[_0xce6b89(0x270)](_0x77fed8=>_0x77fed8['style'][_0xce6b89(0x2e9)]=_0x77fed8['style'][_0xce6b89(0x2e9)]===_0xce6b89(0x39d)?_0xce6b89(0x310):_0xce6b89(0x39d));return;}const _0x4f0815=['d','t','0','w','v','o','h','g','a','u'];if(_0x4f0815['includes'](_0x2610c4[_0xce6b89(0x26a)][_0xce6b89(0x429)]())){if(_0x372c63){_0x372c63[_0xce6b89(0x2b5)](_0xce6b89(0x287)+_0x2610c4['key'][_0xce6b89(0x429)]()+'\x22]')?.[_0xce6b89(0x3f6)]();return;}}if(_0x2610c4[_0xce6b89(0x26a)][_0xce6b89(0x429)]()==='i'&&_0x372c63){_0x372c63['querySelector'](_0xce6b89(0x3f9))?.[_0xce6b89(0x3f6)]();return;}if(_0x2610c4['key'][_0xce6b89(0x429)]()==='e'&&_0x372c63){_0x372c63[_0xce6b89(0x2b5)](_0xce6b89(0x255))?.[_0xce6b89(0x3f6)]();return;}const _0x56fd29={'q':0x0,'8':0x1,'9':0x2};if(_0x56fd29[_0xce6b89(0x3e5)](_0x2610c4[_0xce6b89(0x26a)]['toLowerCase']())){if(_0x372c63){const _0x284f9d=_0x372c63[_0xce6b89(0x361)]('.resize-btn'),_0x3d6cc2=_0x56fd29[_0x2610c4[_0xce6b89(0x26a)][_0xce6b89(0x429)]()];_0x284f9d[_0x3d6cc2]&&_0x284f9d[_0x3d6cc2][_0xce6b89(0x3f6)]();}return;}if(_0x2610c4[_0xce6b89(0x26a)]===_0xce6b89(0x371)&&_0x372c63){const _0x86b7d9=_0x372c63[_0xce6b89(0x2b5)](_0xce6b89(0x42f));_0x86b7d9?.['click']();return;}if([_0xce6b89(0x286),_0xce6b89(0x288),'ArrowLeft','ArrowRight']['includes'](_0x2610c4[_0xce6b89(0x26a)])){_0x2610c4[_0xce6b89(0x367)]();if(!_0x372c63)return;const _0x380f46=_0x2ecbd2(),_0x14b064=window[_0xce6b89(0x2f3)]-_0x380f46,_0x53ba86=window['innerHeight'],_0x4426a9=_0x14b064/0x2,_0x39ef1a=_0x53ba86/0x2,_0x3baa60=0xa,_0x45402a=Math[_0xce6b89(0x389)](_0x372c63[_0xce6b89(0x31c)]-_0x4426a9)<_0x3baa60&&Math['abs'](_0x372c63[_0xce6b89(0x23f)]-_0x39ef1a)<_0x3baa60,_0xb54851=Math[_0xce6b89(0x389)](_0x372c63[_0xce6b89(0x31c)]-_0x4426a9)<_0x3baa60&&Math[_0xce6b89(0x389)](_0x372c63[_0xce6b89(0x23f)]-_0x53ba86)<_0x3baa60,_0x5f25a0=Math[_0xce6b89(0x389)](_0x372c63[_0xce6b89(0x31c)]-_0x14b064)<_0x3baa60&&Math[_0xce6b89(0x389)](_0x372c63[_0xce6b89(0x23f)]-_0x39ef1a)<_0x3baa60;if(!_0x45402a&&!_0xb54851&&!_0x5f25a0)return;const _0x4a9354=_0x372c63[_0xce6b89(0x355)],_0x379045=_0x372c63[_0xce6b89(0x2a6)],_0x376782=_0x4a9354<_0x3baa60,_0x443728=Math[_0xce6b89(0x389)](_0x4a9354-_0x4426a9)<_0x3baa60,_0x213448=_0x379045<_0x3baa60,_0x7522c1=Math[_0xce6b89(0x389)](_0x379045-_0x39ef1a)<_0x3baa60;if(_0xb54851){if(_0x2610c4[_0xce6b89(0x26a)]===_0xce6b89(0x35e)&&_0x376782)_0x372c63[_0xce6b89(0x20c)][_0xce6b89(0x325)]=_0x4426a9+'px';else _0x2610c4[_0xce6b89(0x26a)]===_0xce6b89(0x278)&&_0x443728&&(_0x372c63[_0xce6b89(0x20c)]['left']=_0xce6b89(0x21a));}else{if(_0x5f25a0){if(_0x2610c4['key']==='ArrowDown'&&_0x213448)_0x372c63['style'][_0xce6b89(0x2d7)]=_0x39ef1a+'px';else _0x2610c4[_0xce6b89(0x26a)]===_0xce6b89(0x286)&&_0x7522c1&&(_0x372c63['style'][_0xce6b89(0x2d7)]=_0xce6b89(0x21a));}else{if(_0x45402a){if(_0x2610c4[_0xce6b89(0x26a)]==='ArrowRight'&&_0x376782)_0x372c63[_0xce6b89(0x20c)][_0xce6b89(0x325)]=_0x4426a9+'px';else{if(_0x2610c4[_0xce6b89(0x26a)]==='ArrowLeft'&&_0x443728)_0x372c63[_0xce6b89(0x20c)]['left']='0px';else{if(_0x2610c4[_0xce6b89(0x26a)]==='ArrowDown'&&_0x213448)_0x372c63[_0xce6b89(0x20c)][_0xce6b89(0x2d7)]=_0x39ef1a+'px';else _0x2610c4[_0xce6b89(0x26a)]===_0xce6b89(0x286)&&_0x7522c1&&(_0x372c63[_0xce6b89(0x20c)][_0xce6b89(0x2d7)]=_0xce6b89(0x21a));}}}}}return;}const _0x20dfa8={'n':'addButton','1':'layout1Button','2':'layout2Button','3':_0xce6b89(0x347),'4':_0xce6b89(0x2e3),'5':_0xce6b89(0x396),'6':_0xce6b89(0x291),'7':'layout7Button','c':'colorButton','m':_0xce6b89(0x322),'b':_0xce6b89(0x329),'s':_0xce6b89(0x234),'p':_0xce6b89(0x345),'/':_0xce6b89(0x1ed),'r':_0xce6b89(0x34f),'x':'extraToolsButton','l':'screenButton','k':'clockButton','j':_0xce6b89(0x32e),'f':_0xce6b89(0x1eb),'z':'themePaletteButton','?':'helpButton','u':_0xce6b89(0x20b)},_0x457dfa=_0x2610c4[_0xce6b89(0x26a)][_0xce6b89(0x429)]();if(_0x20dfa8[_0x457dfa]){if(_0x457dfa==='r'&&(_0x2610c4['ctrlKey']||_0x2610c4['shiftKey']||_0x2610c4[_0xce6b89(0x271)]||_0x2610c4[_0xce6b89(0x285)]))return;_0x2610c4['preventDefault'](),_0x40de68(_0x20dfa8[_0x457dfa])?.[_0xce6b89(0x3f6)]();}else{if(_0x457dfa==='y'){_0x2610c4['preventDefault']();const _0xea78ff=document[_0xce6b89(0x2b5)]('.buyme-button');if(_0xea78ff)_0xea78ff[_0xce6b89(0x3f6)]();}}});let _0x1071c4;window['addEventListener']('resize',()=>{clearTimeout(_0x1071c4),_0x1071c4=setTimeout(()=>{const _0x4d58d7=_0x22b5,_0xf1362b=window[_0x4d58d7(0x2f3)],_0x2c00e8=window['innerHeight'],_0x1d651b=_0x2ecbd2(),_0x328dc1=_0x4f870c-_0x1d651b,_0x5001f7=_0xf1362b-_0x1d651b;document[_0x4d58d7(0x361)](_0x4d58d7(0x256))[_0x4d58d7(0x270)](_0x10b38b=>{const _0x3d6eb4=_0x4d58d7;if(_0x10b38b[_0x3d6eb4(0x2b5)]('.info-content-wrapper')){_0x10b38b[_0x3d6eb4(0x20c)][_0x3d6eb4(0x378)]=_0x5001f7+'px',_0x10b38b[_0x3d6eb4(0x20c)][_0x3d6eb4(0x258)]=_0x2c00e8+'px';return;}const _0x263e76=_0x10b38b[_0x3d6eb4(0x355)]/_0x328dc1,_0x23fa9a=_0x10b38b[_0x3d6eb4(0x2a6)]/_0x460df6,_0x1c016d=_0x10b38b[_0x3d6eb4(0x31c)]/_0x328dc1,_0x2f0122=_0x10b38b['offsetHeight']/_0x460df6;_0x10b38b[_0x3d6eb4(0x20c)][_0x3d6eb4(0x325)]=_0x263e76*_0x5001f7+'px',_0x10b38b[_0x3d6eb4(0x20c)]['top']=_0x23fa9a*_0x2c00e8+'px',_0x10b38b[_0x3d6eb4(0x20c)]['width']=_0x1c016d*_0x5001f7+'px',_0x10b38b[_0x3d6eb4(0x20c)][_0x3d6eb4(0x258)]=_0x2f0122*_0x2c00e8+'px';}),_0x4f870c=_0xf1362b,_0x460df6=_0x2c00e8;},0x64);});function _0x3e2beb(){const _0xfefc5c=_0x5477b5,_0x46332f=localStorage[_0xfefc5c(0x2f4)]('ttx_accentColor');_0x46332f&&(_0x59eef0(_0x46332f),_0x40de68(_0xfefc5c(0x259))[_0xfefc5c(0x296)]=_0x46332f);const _0x26613b=localStorage[_0xfefc5c(0x2f4)](_0xfefc5c(0x230)),_0x937204=document[_0xfefc5c(0x1e6)](_0xfefc5c(0x1e9));_0x937204&&(_0x26613b===_0xfefc5c(0x26e)&&(_0x937204[_0xfefc5c(0x368)]=!![],document[_0xfefc5c(0x20d)]['classList']['add'](_0xfefc5c(0x2bc))));const _0x2ba4ab=localStorage[_0xfefc5c(0x2f4)](_0xfefc5c(0x3a2));if(_0x2ba4ab){const _0x1c0289=_0x40de68(_0xfefc5c(0x2df)+_0x2ba4ab+_0xfefc5c(0x248));_0x1c0289&&_0x1c0289[_0xfefc5c(0x3f6)]();}}_0x3e2beb(),document[_0x5477b5(0x20d)][_0x5477b5(0x31a)](_0x5477b5(0x280),_0x53f702=>{const _0x2a8c89=_0x5477b5;!_0x53f702[_0x2a8c89(0x38c)]['closest'](_0x2a8c89(0x2cb))&&(_0x2bc035=!![]);const _0x1d4312=_0x53f702[_0x2a8c89(0x38c)][_0x2a8c89(0x2f7)](_0x2a8c89(0x266));if(_0x1d4312)return;(_0x53f702['target']===document['body']||_0x53f702[_0x2a8c89(0x38c)][_0x2a8c89(0x2f7)](_0x2a8c89(0x233)))&&(document[_0x2a8c89(0x20d)][_0x2a8c89(0x3b8)][_0x2a8c89(0x3fd)](_0x2a8c89(0x3c6)),_0x53f702['target']['closest'](_0x2a8c89(0x233))&&(_0x59eef0(_0x32e743),localStorage[_0x2a8c89(0x426)]('ttx_accentColor',_0x32e743),_0xe80319('↺')));}),document[_0x5477b5(0x31a)]('click',_0x6a60bf=>{const _0x4232c4=_0x5477b5,_0xa76e6=_0x6a60bf[_0x4232c4(0x38c)][_0x4232c4(0x2f7)](_0x4232c4(0x24a)),_0x297960=_0x6a60bf['target'][_0x4232c4(0x2f7)]('#feedback-panel'),_0x4fa63d=_0x6a60bf[_0x4232c4(0x38c)][_0x4232c4(0x2f7)]('#upgrade-panel');if(!_0xa76e6&&!_0x297960&&!_0x4fa63d){if(_0x40de68(_0x4232c4(0x309)))_0x40de68('layout-bar')[_0x4232c4(0x3b8)][_0x4232c4(0x22d)](_0x4232c4(0x2f9));if(_0x40de68(_0x4232c4(0x40f)))_0x40de68(_0x4232c4(0x40f))[_0x4232c4(0x3b8)][_0x4232c4(0x22d)](_0x4232c4(0x2f9));if(_0x40de68(_0x4232c4(0x3f8)))_0x40de68(_0x4232c4(0x3f8))[_0x4232c4(0x3b8)][_0x4232c4(0x22d)]('open');if(_0x40de68('help-bar'))_0x40de68('help-bar')[_0x4232c4(0x3b8)][_0x4232c4(0x22d)](_0x4232c4(0x2f9));_0x100766(),_0x402394(),document['querySelectorAll'](_0x4232c4(0x2d6))[_0x4232c4(0x270)](_0x4f0c71=>{const _0x19b291=_0x4232c4;if(_0x4f0c71)_0x4f0c71[_0x19b291(0x3b8)]['add'](_0x19b291(0x321));});}}),(function(){const _0x4d2267=_0x5477b5;let _0x3f6b69=![],_0x390ed3=0x0,_0x52016a,_0x4c3365,_0x3238d2;function _0x43c5b8(){const _0x2f2eb7=_0x22b5;_0x390ed3=Date[_0x2f2eb7(0x3e4)]();if(!_0x3f6b69)return;_0x3f6b69=![];try{_0x4c3365&&_0x4c3365[_0x2f2eb7(0x22d)]();}catch(_0x34c7d2){}try{_0x52016a&&_0x52016a['remove']();}catch(_0x5eabb0){}const _0x2946c7=document[_0x2f2eb7(0x1e6)](_0x2f2eb7(0x37b));if(_0x2946c7)_0x2946c7[_0x2f2eb7(0x3b8)][_0x2f2eb7(0x22d)]('active');}function _0x38fd14(){const _0x311dd8=_0x22b5;if(_0x3f6b69)return;_0x3f6b69=!![],_0x52016a=document['createElement'](_0x311dd8(0x1ea)),_0x52016a[_0x311dd8(0x32c)]=_0x311dd8(0x31b),_0x52016a['style']['cssText']=_0x311dd8(0x3a0),_0x4c3365=document[_0x311dd8(0x307)](_0x311dd8(0x1ea)),_0x4c3365[_0x311dd8(0x32c)]=_0x311dd8(0x22c),_0x4c3365[_0x311dd8(0x20c)][_0x311dd8(0x2b0)]=_0x311dd8(0x410),_0x3238d2=document[_0x311dd8(0x307)](_0x311dd8(0x331));const _0x52b65d=document[_0x311dd8(0x307)](_0x311dd8(0x2da));_0x52b65d[_0x311dd8(0x2d1)]='demo.mp4',_0x52b65d[_0x311dd8(0x313)]=_0x311dd8(0x342),_0x3238d2[_0x311dd8(0x379)](_0x52b65d),_0x3238d2[_0x311dd8(0x3d5)]=!![],_0x3238d2[_0x311dd8(0x3b0)]=!![],_0x3238d2[_0x311dd8(0x20c)][_0x311dd8(0x2b0)]=_0x311dd8(0x213),_0x4c3365[_0x311dd8(0x379)](_0x3238d2),document[_0x311dd8(0x20d)][_0x311dd8(0x379)](_0x52016a),document[_0x311dd8(0x20d)][_0x311dd8(0x379)](_0x4c3365);const _0x2fc5e9=async()=>{const _0x45c7b3=_0x311dd8;try{await _0x3238d2['play']();}catch(_0x4c90bc){try{_0x3238d2[_0x45c7b3(0x2a3)]=!![],await _0x3238d2['play']();}catch(_0x91e52d){}}};_0x3238d2[_0x311dd8(0x31a)]('loadedmetadata',_0x2fc5e9),_0x2fc5e9();const _0x59f15e=_0x8261b1=>{const _0xd32d09=_0x311dd8,_0x506a96=_0x8261b1[_0xd32d09(0x2c9)],_0x3291f2=_0x8261b1['clientY'];_0x8261b1[_0xd32d09(0x367)](),_0x8261b1[_0xd32d09(0x34e)](),_0x43c5b8(),setTimeout(()=>{const _0x3687dd=_0xd32d09,_0x49394b=document[_0x3687dd(0x1f4)](_0x506a96,_0x3291f2);if(!_0x49394b)return;try{_0x49394b[_0x3687dd(0x283)](new PointerEvent('pointerdown',{'bubbles':!![],'cancelable':!![],'clientX':_0x506a96,'clientY':_0x3291f2,'pointerType':_0x3687dd(0x3ee)}));}catch(_0x3c3c78){}try{_0x49394b['dispatchEvent'](new MouseEvent(_0x3687dd(0x388),{'bubbles':!![],'cancelable':!![],'clientX':_0x506a96,'clientY':_0x3291f2}));}catch(_0x33efff){}try{_0x49394b[_0x3687dd(0x283)](new MouseEvent(_0x3687dd(0x261),{'bubbles':!![],'cancelable':!![],'clientX':_0x506a96,'clientY':_0x3291f2}));}catch(_0x2c1979){}_0x49394b[_0x3687dd(0x283)](new MouseEvent('click',{'bubbles':!![],'cancelable':!![],'clientX':_0x506a96,'clientY':_0x3291f2}));},0x0);};_0x52016a[_0x311dd8(0x31a)]('pointerdown',_0x59f15e,{'capture':!![]}),_0x52016a[_0x311dd8(0x31a)](_0x311dd8(0x388),_0x59f15e,{'capture':!![]}),_0x52016a[_0x311dd8(0x31a)](_0x311dd8(0x3f6),_0x59f15e,{'capture':!![]}),_0x4c3365['addEventListener'](_0x311dd8(0x3f6),_0x43c5b8);}const _0x1328e6=document['getElementById'](_0x4d2267(0x37b));if(_0x1328e6){const _0x516772=_0x1328e6[_0x4d2267(0x3b7)](!![]);_0x1328e6[_0x4d2267(0x3f2)][_0x4d2267(0x2af)](_0x516772,_0x1328e6),_0x516772['addEventListener'](_0x4d2267(0x3f6),_0xd284ef=>{const _0x318bee=_0x4d2267;_0xd284ef[_0x318bee(0x34e)]();if(!_0x3f6b69){if(Date['now']()-_0x390ed3<0xc8)return;_0x516772[_0x318bee(0x3b8)]['add']('active'),_0x38fd14();}else _0x43c5b8();});}}()),document[_0x5477b5(0x31a)](_0x5477b5(0x353),_0x348c28=>{const _0x3ecfb9=_0x5477b5;_0x348c28['detail']===_0x3ecfb9(0x2c2)&&setTimeout(()=>{_0x474cea();},0x1f4);});});
>>>>>>> 54517d8e6840767c5733137bd26a9b42cd90c238
