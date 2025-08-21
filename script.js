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
    console.log('script.js: File has started running.'); // <-- DEBUG MESSAGE 1
    // --- Splash Screen ---
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

        const icon = targetElement.querySelector('i');
        if (icon) {
            icon.classList.add('halo');
            setTimeout(() => {
                icon.classList.remove('halo');
            }, 2000);
        }

        tooltipTimeout = setTimeout(() => {
            premiumTooltip.classList.remove('visible');
        }, 2000);
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
        const secondsDeg = (seconds / 60) * 360;
        const minutesDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
        const hoursDeg = (hours / 12) * 360 + (minutes / 60) * 30;
        
        if (hourHand && minuteHand && secondHand) {
            if (secondsDeg < 1) { 
                secondHand.style.transition = 'none';
            } else {
                secondHand.style.transition = '';
            }
            secondHand.style.transform = `rotate(${secondsDeg}deg)`;
            minuteHand.style.transform = `rotate(${minutesDeg}deg)`;
            hourHand.style.transform = `rotate(${hoursDeg}deg)`;
        }
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
        setClocks();
        setInterval(setClocks, 1000);
    }
    
    const dateDisplay = $('date-display');
    if (dateDisplay) {
      const closeEnlargedDate = () => {
        const backdrop = document.querySelector('.date-backdrop');
        if (dateDisplay.classList.contains('date-enlarged')) {
          dateDisplay.classList.remove('date-enlarged');
        }
        if (backdrop) {
          backdrop.style.opacity = '0';
          setTimeout(() => backdrop.remove(), 400);
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
    
    // ... (keep all the other functions like toolStyles, hotkeysEnabled, dragCounter, etc.) ...
    
    console.log('script.js: About to attach button listeners...'); // <-- DEBUG MESSAGE 2
    $('addButton').onclick = () => {
        const newWin = createWin();
        setActiveWindow(newWin);
        showOverlay('+');
        layoutState.activeLayout = null;
        localStorage.removeItem('ttx_lastLayout');
    };

    // ... (rest of the file remains unchanged) ...
});