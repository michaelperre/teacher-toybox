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
    const premiumModal = $('premium-modal');
    const premiumBackdrop = $('premium-backdrop');
    const closePremiumBtn = $('close-premium-modal-btn');
    const goPremiumBtn = $('go-premium-btn');

    const openPremiumModal = () => {
        if (premiumBackdrop && premiumModal) {
            premiumBackdrop.classList.remove('hidden');
            premiumModal.classList.remove('hidden');
        }
    };

    const closePremiumModal = () => {
        if (premiumBackdrop && premiumModal) {
            premiumBackdrop.classList.add('hidden');
            premiumModal.classList.add('hidden');
        }
    };

    if (premiumBackdrop) premiumBackdrop.onclick = closePremiumModal;
    if (closePremiumBtn) closePremiumBtn.onclick = closePremiumModal;

    if (goPremiumBtn) {
        goPremiumBtn.onclick = async () => {
            if (!await auth0Client.isAuthenticated()) {
                login('upgrade'); // CORRECTED
                return;
            }

            const user = await auth0Client.getUser();
            // IMPORTANT: Replace with your Stripe PUBLISHABLE Key
            const stripe = Stripe('pk_live_51RyVoHFCA6YfGQJzhJ8SlyEuCayZQXmmbpI0AGeJoLGsNIxz1W8qICgjAqrjkJdSnStHH9U9XvFW49x0PnX2Gxyg000uNaxUaF'); // UPDATED KEY
            const priceId = 'price_1RyXtBFCA6YfGQJz7BUMxTQo'; // UPDATED KEY

            try {
                // This fetch call requires your backend serverless function to be running
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

    let hotkeysEnabled = true,
        laserOn = false;
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

    function moveLaser(e) {
        const d = document.getElementById('laserDot');
        if (d) d.style.transform = `translate(${e.clientX - 11}px, ${e.clientY - 11}px) scale(1)`;
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
            b.className = 'icon-btn';
            b.innerHTML = `<i class="${icon}"></i>`;
            b.style.width = '40px'; b.style.height = '40px'; b.style.fontSize = '16px'; b.style.background = 'rgba(255, 255, 255, 0.1)';
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
                    openPremiumModal();
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
        }
    
        const v = document.createElement('div');
        v.className = 'content-fill';
        v.style.height = '100%';
        v.style.position = 'relative';
    
        const infoWrapper = document.createElement('div');
        infoWrapper.className = 'info-content-wrapper';
    
        const renderInfoText = (langCode) => {
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
            infoWrapper.innerHTML = htmlContent;
        };
        
        const langSelectorWrap = document.createElement('div');
        langSelectorWrap.className = 'info-language-selector-wrap';
        
        const langSelect = document.createElement('select');
        langSelect.className = 'info-language-selector';
        
        const supportedLangs = {
            en: "English", cs: "Čeština", uk: "Українська", zh: "中文（简体）", hi: "हिन्दी", 
            es: "Español", fr: "Français", ar: "العربية", fa: "فارسی", pt: "Português", ru: "Русский"
        };
        
        Object.entries(supportedLangs).forEach(([code, name]) => {
            if (infoTranslations[code]) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                langSelect.appendChild(option);
            }
        });
        
        langSelect.addEventListener('change', (e) => {
            renderInfoText(e.target.value);
            setTimeout(fitText, 0); 
        });

        langSelectorWrap.appendChild(langSelect);

        const initialLang = ($('langSelect') && $('langSelect').value) || localStorage.getItem('ttx_lang') || 'en';
        langSelect.value = initialLang;
        renderInfoText(initialLang);

        v.append(langSelectorWrap, infoWrapper);
        if(mainArea) mainArea.appendChild(v);
    
        setTimeout(() => {
            infoWrapper.classList.add('info-fade-in');
        }, 10);
    
        const fitText = () => {
            if (!infoWrapper) return;
            infoWrapper.style.fontSize = '';
        
            let minSize = 8;
            let maxSize = parseFloat(window.getComputedStyle(infoWrapper).fontSize);
            let finalSize = minSize;
        
            for (let i = 0; i < 10; i++) {
                let midSize = (minSize + maxSize) / 2;
                infoWrapper.style.fontSize = `${midSize}px`;
        
                if (infoWrapper.scrollHeight > infoWrapper.clientHeight) {
                    maxSize = midSize;
                } else {
                    finalSize = midSize;
                    minSize = midSize;
                }
            }
            infoWrapper.style.fontSize = `${finalSize}px`;
        };
    
        if (mainArea) {
            const resizeObserver = new ResizeObserver(() => {
                requestAnimationFrame(fitText);
            });
            resizeObserver.observe(mainArea);
            w.toolResizeObserver = resizeObserver;
        }
    
        setTimeout(fitText, 50);
    
        w.onclick = (e) => {
            if (!e.target.closest('.info-language-selector')) {
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
        if (window.TT.isPremium) {
            if (closeInfoIfOpen()) return;
            $('colorPicker').click();
            layoutState.activeLayout = null;
            localStorage.removeItem('ttx_lastLayout');
        } else {
            openPremiumModal();
        }
    };
    
    const colorPalette = $('color-palette');
    const themePaletteButton = $('themePaletteButton');
    if (themePaletteButton) {
        themePaletteButton.onclick = (e) => {
            if (window.TT.isPremium) {
                e.stopPropagation();
                if (closeInfoIfOpen()) return;
                colorPalette.classList.toggle('hidden');
            } else {
                openPremiumModal();
            }
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

    let lastMagicClick = 0;
    $('magicColorButton').onclick = async() => {
        if (window.TT.isPremium) {
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
        } else {
            openPremiumModal();
        }
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
    $('laserButton').onclick = function() {
        if (closeInfoIfOpen()) return;
        laserOn = !laserOn;
        this.classList.toggle('active', laserOn);
        if (laserOn) { const d = document.createElement('div');
            d.id = 'laserDot';
            document.body.appendChild(d);
            document.addEventListener('pointermove', moveLaser); } else { document.removeEventListener('pointermove', moveLaser);
            document.getElementById('laserDot')?.remove(); }
    };

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
        if (laserOn) {
            $('laserButton').click();
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
        $('upgrade-panel').classList.remove('open');
        $('extra-tools-bar').classList.toggle('open');
    };

    $('screenButton').onclick = (e) => {
        e.stopPropagation();
        if (closeInfoIfOpen()) return;
        $('extra-tools-bar').classList.remove('open');
        $('management-bar').classList.remove('open');
        $('help-bar').classList.remove('open');
        $('upgrade-panel').classList.remove('open');
        $('layout-bar').classList.toggle('open');
    };

    $('managementButton').onclick = (e) => {
        e.stopPropagation();
        if (closeInfoIfOpen()) return;
        $('extra-tools-bar').classList.remove('open');
        $('layout-bar').classList.remove('open');
        $('help-bar').classList.remove('open');
        $('upgrade-panel').classList.remove('open');
        $('management-bar').classList.toggle('open');
    };
    
    $('helpButton').onclick = (e) => {
        e.stopPropagation();
        if (closeInfoIfOpen()) return;
        $('extra-tools-bar').classList.remove('open');
        $('layout-bar').classList.remove('open');
        $('management-bar').classList.remove('open');
        $('upgrade-panel').classList.remove('open');
        $('help-bar').classList.toggle('open');
    };
    
    // --- Upgrade Panel Logic ---
    const upgradeButton = $('upgradeButton');
    const upgradePanel = $('upgrade-panel');
    const upgradeBackdrop = $('upgrade-backdrop');
    const closeUpgradeBtn = $('close-upgrade-btn');
    const panelUpgradeBtn = $('panel-upgrade-btn');

    const openUpgradePanel = (e) => {
        if (e) e.stopPropagation();
        if (closeInfoIfOpen()) return;

        // Close other side panels for a clean UI
        $('extra-tools-bar').classList.remove('open');
        $('layout-bar').classList.remove('open');
        $('management-bar').classList.remove('open');
        $('help-bar').classList.remove('open');

        if (upgradeBackdrop && upgradePanel) {
            upgradeBackdrop.classList.remove('hidden');
            upgradePanel.classList.add('open');
        }
    };

    const closeUpgradePanel = () => {
        if (upgradePanel && upgradeBackdrop) {
            upgradePanel.classList.remove('open');
            upgradeBackdrop.classList.add('hidden');
        }
    };

    if (upgradeButton) upgradeButton.onclick = openUpgradePanel;
    if (closeUpgradeBtn) closeUpgradeBtn.onclick = closeUpgradePanel;
    if (upgradeBackdrop) upgradeBackdrop.onclick = closeUpgradePanel;

    if (panelUpgradeBtn) {
        panelUpgradeBtn.onclick = async () => {
            if (!await auth0Client.isAuthenticated()) {
                login('upgrade');
                return;
            }

            const user = await auth0Client.getUser();
            const stripe = Stripe('pk_live_51RyVoHFCA6YfGQJzhJ8SlyEuCayZQXmmbpI0AGeJoLGsNIxz1W8qICgjAqrjkJdSnStHH9U9XvFW49x0PnX2Gxyg000uNaxUaF'); // UPDATED KEY
            const priceId = 'price_1RyXtBFCA6YfGQJz7BUMxTQo'; // UPDATED KEY

            try {
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
            feedbackPanel.classList.remove('open');
            feedbackBackdrop.classList.add('hidden');
            setTimeout(() => {
                $('feedback-comment').value = '';
                currentRating = 0;
                updateStars();
                submitFeedbackBtn.disabled = false;
                submitFeedbackBtn.textContent = 'Submit';
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
            submitFeedbackBtn.disabled = true;
            submitFeedbackBtn.textContent = 'Sending...';
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
                    submitFeedbackBtn.textContent = 'Thank You!';
                    submitFeedbackBtn.style.backgroundColor = 'var(--success-color)';
                    setTimeout(closeFeedbackPanel, 1500);
                } else { throw new Error('Form submission failed'); }
            } catch (error) {
                console.error('Error submitting feedback:', error);
                alert('Sorry, there was an error sending your feedback.');
                submitFeedbackBtn.disabled = false;
                submitFeedbackBtn.textContent = 'Submit';
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
            $('layout-bar').classList.remove('open');
            $('management-bar').classList.remove('open');
            $('extra-tools-bar').classList.remove('open');
            $('help-bar').classList.remove('open');

            // Use the dedicated close functions to also hide the backdrops
            closeUpgradePanel();
            closeFeedbackPanel();
            
            // Close color palettes
            document.querySelectorAll('.custom-color-palette, #color-palette').forEach(p => {
                if (p) p.classList.add('hidden');
            });
        }
        
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
    });
    
    // Original premium logic was here, moved to auth.js and a new upgrade button in index.html
    // Old premiumSidebarButtons array removed.
    
    // Listen for the custom event from auth.js
    document.addEventListener('postLoginAction', (e) => {
        if (e.detail === 'upgrade') {
            // We need a short delay to ensure the UI has updated after login
            setTimeout(() => {
                openUpgradePanel();
            }, 500); // 500ms delay
        }
    });

});