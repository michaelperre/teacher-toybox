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

    // --- All functions must be defined before they are used by listeners ---

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
    
    // ... (Your full function definitions will be placed here)
    function createWin() {
        // This is a placeholder for your full createWin function
        const win = document.createElement('div');
        win.className = 'floating';
        const i = document.querySelectorAll('.floating').length;
        const currentSidebarWidth = getSidebarWidth();
        win.style.left = `${30 * i}px`;
        win.style.top = `${30 * i}px`;
        win.style.width = `${(window.innerWidth - currentSidebarWidth) / 2}px`;
        win.style.height = `${window.innerHeight / 2}px`;
        
        // ... (The rest of your full createWin function, including creating the drag bar, win-body, tool sidebar, etc.)
        
        document.body.appendChild(win);
        return win;
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
    
    // ... all other of your original functions like activateDraw, activateTimer, etc. ...

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
    
    // --- Event Listeners and Initialization Code ---
    // This part runs last, after all functions above have been defined.
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('light-mode', themeToggle.checked);
            localStorage.setItem('ttx_theme', themeToggle.checked ? 'light' : 'dark');
        });
    }

    $('addButton').onclick = () => {
        const newWin = createWin();
        setActiveWindow(newWin);
        showOverlay('+');
        layoutState.activeLayout = null;
        localStorage.removeItem('ttx_lastLayout');
    };
    
    // ... (All other original button listeners and setup code go here) ...
    
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