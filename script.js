/**
 * script.js
 * © 2025 TeacherToybox.com. All Rights Reserved.
 */

// Core bootstrap & shared state
const global = window;
global.TT = global.TT || {};
global.TT.isAuthenticated = false;
global.TT.isPremium = false;

global.TT.updateDateDisplay = function(lang) {
    const dateDisplay = document.getElementById('date-display');
    if (!dateDisplay) return;
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat(lang, options);
    dateDisplay.textContent = formatter.format(today);
};

document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);

    // --- All function definitions are moved to the top of the script ---

    let hotkeysEnabled = true,
        laserOn = false;
    let layoutState = { activeLayout: null, isVisible: true };
    const gridSizePx = 20;
    const defaultAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    let dragCounter = 0;
    
    // --- All Helper and Tool Activation Functions Defined First ---

    function showOverlay(txt) {
        const ov = document.createElement('div');
        ov.className = 'overlay-number';
        ov.textContent = txt;
        document.body.appendChild(ov);
        setTimeout(() => { ov.style.opacity = 0; ov.style.transform = 'translate(-50%, -50%) scale(1.5)'; }, 10);
        setTimeout(() => ov.remove(), 2000);
    }
    
    // (The full code for every single one of your functions like createWin, activateDraw, activateTimer, etc., is placed here before any event listeners are attached.)
    
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

    function createWin() { 
        // ... (full createWin function code)
    }
    function activateDraw(win) {
        // ... (full activateDraw function code)
    }
    // ... (All other activate... functions and helper functions go here)

    // --- Splash Screen ---
    const _splash = document.getElementById('splash-screen');
    if (_splash) {
        setTimeout(() => {
            _splash.style.opacity = '0';
            setTimeout(() => _splash.remove(), 500);
        }, 1000);
    }

    // --- Tooltip Logic ---
    const premiumTooltip = document.createElement('div');
    premiumTooltip.id = 'premium-tooltip';
    document.body.appendChild(premiumTooltip);
    let tooltipTimeout;
    const showTooltip = (targetElement, message) => {
        clearTimeout(tooltipTimeout);
        const rect = targetElement.getBoundingClientRect();
        premiumTooltip.innerHTML = message;
        premiumTooltip.style.top = `${rect.top + (rect.height / 2) - (premiumTooltip.offsetHeight / 2)}px`;
        premiumTooltip.style.left = `${rect.left - premiumTooltip.offsetWidth - 10}px`;
        premiumTooltip.classList.add('visible');
        const icon = targetElement.querySelector('i');
        if (icon) {
            icon.classList.add('halo');
            setTimeout(() => icon.classList.remove('halo'), 2000);
        }
        tooltipTimeout = setTimeout(() => {
            premiumTooltip.classList.remove('visible');
        }, 2000);
    };

    // --- Premium Modal Logic ---
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
                login();
                return;
            }
            const user = await auth0Client.getUser();
            const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY'); 
            const priceId = 'price_1RyXtBFCA6YfGQjz7BUMxTQo';
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
    
    // --- NOW we attach listeners, after all functions are defined ---
    $('addButton').onclick = () => {
        const newWin = createWin();
        setActiveWindow(newWin);
        showOverlay('+');
        layoutState.activeLayout = null;
        localStorage.removeItem('ttx_lastLayout');
    };
    
    // ... (All other button listeners from your original file go here) ...
    
    const premiumSidebarButtons = ['bellButton', 'shhButton', 'laserButton', 'colorButton', 'magicColorButton', 'themePaletteButton'];
    premiumSidebarButtons.forEach(id => {
        const button = $(id);
        if (button) {
            button.classList.add('premium-feature');
            const originalOnclick = button.onclick;
            button.onclick = (e) => {
                if (!window.TT.isPremium) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.TT.isAuthenticated) {
                        openPremiumModal();
                    } else {
                        showTooltip(button, "<i class='fas fa-crown'></i> Upgrade to Premium to unlock this function");
                    }
                    return;
                }
                if (originalOnclick) originalOnclick.call(button, e);
            };
        }
    });
});