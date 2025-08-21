/*
 * tour.js
 * Logic for the guided walkthrough tour.
 * © 2025 TeacherToybox.com. All Rights Reserved.
 */

document.addEventListener('DOMContentLoaded', () => {
    // A flag to prevent the tour from starting automatically if it's already running
    let isTourActive = false;
    // A flag to ignore programmatic clicks during tour actions
    let isPerformingAction = false;

    const tourSteps = [
        {
            element: '#addButton',
            title: 'Welcome to Teacher Toybox!',
            content: 'This is your digital classroom command center. Let\'s quickly walk through the main controls. Click "Next" to continue.',
        },
        {
            element: '#addButton',
            title: 'Add a Window',
            content: 'This button adds a new window. If one isn\'t open already, I\'ll click it for you so we can look at the window tools.',
            action: () => {
                if (document.querySelectorAll('.floating').length === 0) {
                    document.getElementById('addButton')?.click();
                }
            } 
        },
        {
            element: '.floating .win-sidebar',
            title: 'Window Tool Palette',
            content: 'Excellent! This is the tool palette for the new window. It has tools like a drawing canvas and text editor.',
        },
        {
            element: '.floating .win-sidebar .icon-btn[data-hotkey="d"]',
            title: 'Drawing Canvas',
            content: 'For example, clicking this button turns the window into an interactive whiteboard. Let\'s try it.',
            action: () => document.querySelector('.floating .win-sidebar .icon-btn[data-hotkey="d"]')?.click() 
        },
        {
            element: '#screenButton',
            title: 'Arrange Your Screen',
            content: 'This button reveals preset layouts. You can instantly organize your windows into splitscreen, quadrants, and more.',
            action: () => document.querySelector('#screenButton')?.click() 
        },
        {
            element: '.floating .drag-bar',
            title: 'Move & Resize',
            content: 'You can also drag this bar to move windows, and resize them from any edge or corner.',
        },
        {
            element: '#helpButton',
            title: 'Help & Resources',
            content: 'That\'s the basics! This button groups together the tour, demo video, and more information. Click \'Finish\' to start exploring.',
            action: () => document.getElementById('helpButton')?.click()
        }
    ];

    let currentStep = 0;
    let highlight, tooltip;

    function createTourElements() {
        highlight = document.createElement('div');
        highlight.className = 'tour-highlight-element';

        tooltip = document.createElement('div');
        tooltip.className = 'tour-tooltip';

        document.body.append(highlight, tooltip);
    }

    function showStep(index) {
        const step = tourSteps[index];
        
        setTimeout(() => {
            const targetElement = document.querySelector(step.element);
            if (!targetElement) {
                console.warn(`Tour element not found: ${step.element}`);
                endTour();
                return;
            }

            const rect = targetElement.getBoundingClientRect();
            
            highlight.style.top = `${rect.top - 5}px`;
            highlight.style.left = `${rect.left - 5}px`;
            highlight.style.width = `${rect.width + 10}px`;
            highlight.style.height = `${rect.height + 10}px`;

            tooltip.innerHTML = `
                <h4>${step.title}</h4>
                <p>${step.content}</p>
                <div class="tour-tooltip-footer">
                    <span class="tour-progress">${index + 1} / ${tourSteps.length}</span>
                    <button class="tour-next-btn">${index === tourSteps.length - 1 ? 'Finish' : 'Next'}</button>
                </div>
            `;

            const tooltipRect = tooltip.getBoundingClientRect();

            // --- MODIFIED: Robust tooltip positioning logic ---
            const margin = 10; // 10px margin from the screen edges

            // 1. Determine preferred vertical position (prefer below, then above)
            const spaceBelow = window.innerHeight - rect.bottom;
            let tooltipTop;
            if (spaceBelow >= tooltipRect.height + margin + 15) {
                tooltipTop = rect.bottom + 15;
            } else {
                tooltipTop = rect.top - tooltipRect.height - 15;
            }

            // 2. Determine initial horizontal position (centered on target)
            let tooltipLeft = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

            // 3. Final clamping to GUARANTEE the tooltip is always inside the viewport.
            tooltipTop = Math.max(margin, Math.min(tooltipTop, window.innerHeight - tooltipRect.height - margin));
            tooltipLeft = Math.max(margin, Math.min(tooltipLeft, window.innerWidth - tooltipRect.width - margin));
            // --- END OF MODIFICATION ---

            tooltip.style.top = `${tooltipTop}px`;
            tooltip.style.left = `${tooltipLeft}px`;
            
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';

            tooltip.querySelector('.tour-next-btn').addEventListener('click', nextStep, { once: true });
        }, 150); // Delay to allow UI to update from actions
    }

    function nextStep(event) {
        if (event) event.stopPropagation();

        const step = tourSteps[currentStep];
        if (step.action) {
            isPerformingAction = true;
            step.action();
            setTimeout(() => { isPerformingAction = false; }, 100);
        }

        currentStep++;
        if (currentStep >= tourSteps.length) {
            endTour();
        } else {
            const delay = step.action ? 400 : 50;
            setTimeout(() => showStep(currentStep), delay);
        }
    }

    function endTour() {
        if (!isTourActive) return;
        isTourActive = false;

        // Set a flag in localStorage so the tour doesn't auto-start next time.
        localStorage.setItem('ttx_tour_completed', 'true');

        document.body.removeEventListener('click', handleGlobalClick);

        if (tooltip) tooltip.style.opacity = '0';
        if (highlight) highlight.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0)';
        
        // Close all pop-out bars for a clean exit
        document.querySelector('#layout-bar')?.classList.remove('open');
        document.querySelector('#management-bar')?.classList.remove('open');
        document.querySelector('#extra-tools-bar')?.classList.remove('open');
        document.querySelector('#help-bar')?.classList.remove('open');

        setTimeout(() => {
            if (highlight && highlight.parentNode) highlight.remove();
            if (tooltip && tooltip.parentNode) tooltip.remove();
        }, 400);
    }
    
    function handleGlobalClick(event) {
        if (isPerformingAction) {
            return;
        }
        if (tooltip && tooltip.contains(event.target)) {
            return;
        }
        endTour();
    }

    function startTour() {
        if (isTourActive) return;
        isTourActive = true;
        currentStep = 0;
        createTourElements();
        showStep(currentStep);
        
        setTimeout(() => {
            document.body.addEventListener('click', handleGlobalClick);
        }, 100);
    }

    // --- Tour Initiation Logic ---

    const tourButton = document.getElementById('tourButton');
    if (tourButton) {
        tourButton.addEventListener('click', startTour);
    }

    // Check if the tour has been completed before, and only start if it hasn't.
    if (!localStorage.getItem('ttx_tour_completed')) {
        setTimeout(startTour, 1500); 
    }
});