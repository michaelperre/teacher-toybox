/**
 * tour.js
 * © 2025 Teacher Toybox Ltd. All Rights Reserved.
 *
 * Handles the guided tour for first-time users.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tourButton = document.getElementById('tourButton');
    if (!tourButton) return;

    let currentStep = 0;
    let tourOverlay = null;
    let tourTooltip = null;

    const tourSteps = [
        { element: '#addButton', text: 'Welcome to Teacher Toybox! Click here to add your first window.' },
        { element: '#screenButton', text: 'Great! Now, use the layout tools to arrange your windows on the screen.' },
        { element: '#extraToolsButton', text: 'You can customize the look and feel of the site with these extra tools.' },
        { element: '#feedbackButton', text: 'Have an idea or need help? Send us your feedback here.' },
        { element: '.floating .win-sidebar .icon-btn[data-hotkey="d"]', text: 'Each window has its own set of tools. Try selecting the drawing tool!' },
        { element: '#upgradeButton', text: 'Unlock even more powerful tools by upgrading to Premium. Enjoy exploring!' }
    ];

    function startTour() {
        if (document.querySelector('.tour-overlay')) return; // Tour already running
        localStorage.setItem('ttx_tour_completed', 'true');
        currentStep = 0;
        createTourElements();
        showStep();
    }

    function createTourElements() {
        tourOverlay = document.createElement('div');
        tourOverlay.className = 'tour-overlay';
        document.body.appendChild(tourOverlay);

        tourTooltip = document.createElement('div');
        tourTooltip.className = 'tour-tooltip';
        tourTooltip.innerHTML = `
            <div class="tour-text"></div>
            <div class="tour-nav">
                <button class="tour-next">Next</button>
                <button class="tour-end">End Tour</button>
            </div>
        `;
        document.body.appendChild(tourTooltip);

        tourOverlay.addEventListener('click', handleOverlayClick);
        tourTooltip.querySelector('.tour-next').addEventListener('click', nextStep);
        tourTooltip.querySelector('.tour-end').addEventListener('click', endTour);
    }

    function showStep() {
        if (currentStep >= tourSteps.length) {
            endTour();
            return;
        }

        const step = tourSteps[currentStep];
        const targetElement = document.querySelector(step.element);

        if (!targetElement) {
            console.warn(`Tour step ${currentStep}: element "${step.element}" not found. Skipping.`);
            nextStep();
            return;
        }

        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
        targetElement.classList.add('tour-highlight');

        tourTooltip.querySelector('.tour-text').textContent = step.text;

        const targetRect = targetElement.getBoundingClientRect();
        const tooltipRect = tourTooltip.getBoundingClientRect();

        let top = targetRect.bottom + 10;
        let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);

        // Adjust if off-screen
        if (top + tooltipRect.height > window.innerHeight) {
            top = targetRect.top - tooltipRect.height - 10;
        }
        if (left < 10) {
            left = 10;
        }
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 10;
        }

        tourTooltip.style.top = `${top}px`;
        tourTooltip.style.left = `${left}px`;
        tourTooltip.style.opacity = '1';

        if (currentStep === tourSteps.length - 1) {
            tourTooltip.querySelector('.tour-next').textContent = 'Finish';
        } else {
            tourTooltip.querySelector('.tour-next').textContent = 'Next';
        }
    }

    function nextStep() {
        currentStep++;
        showStep();
    }

    function endTour() {
        if (tourOverlay) {
            tourOverlay.style.opacity = '0';
            setTimeout(() => tourOverlay.remove(), 300);
        }
        if (tourTooltip) {
            tourTooltip.style.opacity = '0';
            setTimeout(() => tourTooltip.remove(), 300);
        }
        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
    }

    function handleOverlayClick(e) {
        // --- THIS IS THE FIX ---
        // Check if the click was inside the cookie banner. If so, do nothing.
        if (e.target.closest('#cookie-consent-banner')) {
            return;
        }
        // --- END OF FIX ---
        endTour();
    }

    tourButton.addEventListener('click', startTour);

    // Automatically start the tour for first-time visitors
    if (!localStorage.getItem('ttx_tour_completed')) {
        setTimeout(startTour, 1500); // Wait a moment for the page to settle
    }
});

