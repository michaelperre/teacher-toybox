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

    // REBUILT: Define steps with keys instead of fetching text immediately.
    const tourSteps = [
        {
            element: '#addButton',
            titleKey: 'tour.step1.title',
            contentKey: 'tour.step1.content'
        },
        {
            element: '#addButton',
            titleKey: 'tour.step2.title',
            contentKey: 'tour.step2.content',
            action: () => {
                if (document.querySelectorAll('.floating').length === 0) {
                    document.getElementById('addButton')?.click();
                }
            }
        },
        {
            element: '.floating .win-sidebar',
            titleKey: 'tour.step3.title',
            contentKey: 'tour.step3.content'
        },
        {
            element: '.floating .win-sidebar .icon-btn[data-hotkey="d"]',
            titleKey: 'tour.step4.title',
            contentKey: 'tour.step4.content',
            action: () => document.querySelector('.floating .win-sidebar .icon-btn[data-hotkey="d"]')?.click()
        },
        {
            element: '#screenButton',
            titleKey: 'tour.step5.title',
            contentKey: 'tour.step5.content',
            action: () => document.querySelector('#screenButton')?.click()
        },
        {
            element: '.floating .drag-bar',
            titleKey: 'tour.step6.title',
            contentKey: 'tour.step6.content'
        },
        {
            element: '#helpButton',
            titleKey: 'tour.step7.title',
            contentKey: 'tour.step7.content',
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

        // REBUILT: Look up the text "just-in-time" when the step is shown.
        const lang = localStorage.getItem('ttx_lang') || 'en';
        const dict = (window.I18N && (window.I18N[lang] || window.I18N.en)) || {};
        const title = window.t(dict, step.titleKey) || 'Loading...';
        const content = window.t(dict, step.contentKey) || 'Please wait.';
        
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
                <h4>${title}</h4>
                <p>${content}</p>
                <div class="tour-tooltip-footer">
                    <span class="tour-progress">${index + 1} / ${tourSteps.length}</span>
                    <button class="tour-next-btn">${index === tourSteps.length - 1 ? 'Finish' : 'Next'}</button>
                </div>
            `;

            const tooltipRect = tooltip.getBoundingClientRect();
            const margin = 10;
            const spaceBelow = window.innerHeight - rect.bottom;
            let tooltipTop;

            if (spaceBelow >= tooltipRect.height + margin + 15) {
                tooltipTop = rect.bottom + 15;
            } else {
                tooltipTop = rect.top - tooltipRect.height - 15;
            }

            let tooltipLeft = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            tooltipTop = Math.max(margin, Math.min(tooltipTop, window.innerHeight - tooltipRect.height - margin));
            tooltipLeft = Math.max(margin, Math.min(tooltipLeft, window.innerWidth - tooltipRect.width - margin));

            tooltip.style.top = `${tooltipTop}px`;
            tooltip.style.left = `${tooltipLeft}px`;
            
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';

            tooltip.querySelector('.tour-next-btn').addEventListener('click', nextStep, { once: true });
        }, 150);
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
        localStorage.setItem('ttx_tour_completed', 'true');
        document.body.removeEventListener('click', handleGlobalClick);

        if (tooltip) tooltip.style.opacity = '0';
        if (highlight) highlight.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0)';
        
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
        if (isPerformingAction || (tooltip && tooltip.contains(event.target))) {
            return;
        }
        endTour();
    }

    function startTour() {
        if (isTourActive) return;
        isTourActive = true;
        
        // REBUILT: No longer needs to generate steps here.
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

    if (!localStorage.getItem('ttx_tour_completed')) {
        setTimeout(startTour, 1500); 
    }
});