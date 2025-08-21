/**
 * script.js
 * © 2025 TeacherToybox.com. All Rights Reserved.
 *
 * This script is the intellectual property of TeacherToybox.com.
 * Unauthorized copying or distribution is strictly prohibited.
 */

// Core bootstrap & shared state
const global = window;
global.TT = global.TT || {};
global.TT.isAuthenticated = false; // Add auth status
global.TT.isPremium = false; // Add premium status to global state

// --- Date Display & Localization ---
global.TT.updateDateDisplay = function(lang) {
    const dateDisplay = document.getElementById('date-display');
    if (!dateDisplay) return;
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat(lang, options);
    dateDisplay.textContent = formatter.format(today);
};


document.addEventListener('DOMContentLoaded', () => {
    const _splash = document.getElementById('splash-screen');
    if (_splash) {
        setTimeout(() => {
            _splash.style.opacity = '0';
            setTimeout(() => _splash.remove(), 500);
        }, 1000);
    }
    const $ = id => document.getElementById(id);

    // *** Create Tooltip Element and Show/Hide Logic ***
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

        // NEW: Find the icon and add the halo effect
        const icon = targetElement.querySelector('i');
        if (icon) {
            icon.classList.add('halo');
            // Remove the class after the animation is done so it can be re-triggered
            setTimeout(() => {
                icon.classList.remove('halo');
            }, 2000);
        }

        tooltipTimeout = setTimeout(() => {
            premiumTooltip.classList.remove('visible');
        }, 2000); // Hide after 2 seconds
    };

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
    
    // ... (keep all your other functions like themeToggle, createWin, activateDraw, etc. exactly as they were) ...
    // NOTE: For brevity, the full code of the other functions is omitted here, but should be kept in your file.

    function createWin() {
        // ... (entire createWin function setup is the same) ...
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
            
            btn.onclick = (e) => {
                if (tool.premium && !window.TT.isPremium) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.TT.isAuthenticated) {
                        openPremiumModal();
                    } else {
                        showTooltip(btn, "<i class='fas fa-crown'></i> Upgrade to Premium to unlock this function");
                    }
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

        // ... (rest of createWin function is the same) ...
        return win;
    }

    // ... (keep the rest of your script.js code including all the activate... functions) ...

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