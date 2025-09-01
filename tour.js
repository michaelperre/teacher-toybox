/**
 * tour.js
 * Logic for the guided walkthrough tour.
 * © 2025 TeacherToybox.com. All Rights Reserved.
 *
 * This refactored version encapsulates the tour logic within a class for better
 * state management, readability, and maintainability.
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Generates the tour steps array with text in the specified language.
     * @param {string} lang - The language code (e.g., 'en', 'es').
     * @returns {Array} An array of tour step objects.
     */
    function getTourSteps(lang) {
        const dict = window.I18N[lang] || window.I18N.en;
        return [
            {
                element: '#addButton',
                title: window.t(dict, 'tour.step1.title'),
                content: window.t(dict, 'tour.step1.content'),
            },
            {
                element: '#addButton',
                title: window.t(dict, 'tour.step2.title'),
                content: window.t(dict, 'tour.step2.content'),
                action: () => {
                    if (document.querySelectorAll('.floating').length === 0) {
                        document.getElementById('addButton')?.click();
                    }
                }
            },
            {
                element: '.floating .win-sidebar',
                title: window.t(dict, 'tour.step3.title'),
                content: window.t(dict, 'tour.step3.content'),
            },
            {
                element: '.floating .win-sidebar .icon-btn[data-hotkey="d"]',
                title: window.t(dict, 'tour.step4.title'),
                content: window.t(dict, 'tour.step4.content'),
                action: () => document.querySelector('.floating .win-sidebar .icon-btn[data-hotkey="d"]')?.click()
            },
            {
                element: '#screenButton',
                title: window.t(dict, 'tour.step5.title'),
                content: window.t(dict, 'tour.step5.content'),
                action: () => document.querySelector('#screenButton')?.click()
            },
            {
                element: '.floating .drag-bar',
                title: window.t(dict, 'tour.step6.title'),
                content: window.t(dict, 'tour.step6.content'),
            },
            {
                element: '#helpButton',
                title: window.t(dict, 'tour.step7.title'),
                content: window.t(dict, 'tour.step7.content'),
                action: () => document.getElementById('helpButton')?.click()
            }
        ];
    }

    /**
     * A class to manage the state and flow of the guided tour.
     */
    class GuidedTour {
        constructor() {
            this.isActive = false;
            this.isPerformingAction = false;
            this.currentStepIndex = 0;
            this.steps = [];
            this.elements = {
                highlight: null,
                tooltip: null
            };
        }

        /**
         * Starts the guided tour.
         */
        start() {
            if (this.isActive) return;

            this.isActive = true;
            this.currentStepIndex = 0;

            const currentLang = localStorage.getItem('ttx_lang') || 'en';
            this.steps = getTourSteps(currentLang);

            this._createDOMElements();
            this.showStep(this.currentStepIndex);

            // Add a slight delay before listening for clicks to avoid accidentally closing the tour instantly.
            setTimeout(() => {
                document.body.addEventListener('click', this._handleGlobalClick);
            }, 100);
        }

        /**
         * Ends the guided tour and cleans up.
         */
        stop() {
            if (!this.isActive) return;
            this.isActive = false;

            localStorage.setItem('ttx_tour_completed', 'true');
            document.body.removeEventListener('click', this._handleGlobalClick);

            // Cleanly fade out and remove tour elements.
            if (this.elements.tooltip) this.elements.tooltip.style.opacity = '0';
            if (this.elements.highlight) this.elements.highlight.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0)';

            // Close any pop-out bars for a clean exit.
            document.querySelectorAll('#layout-bar, #management-bar, #extra-tools-bar, #help-bar').forEach(bar => bar.classList.remove('open'));

            setTimeout(() => {
                this._removeDOMElements();
            }, 400);
        }

        /**
         * Asynchronously proceeds to the next step, handling actions and delays.
         */
        async next() {
            const step = this.steps[this.currentStepIndex];

            // If the current step has an action, perform it and wait for the UI to update.
            if (step && step.action) {
                this.isPerformingAction = true;
                step.action();
                await new Promise(resolve => setTimeout(resolve, 400));
                this.isPerformingAction = false;
            }

            this.currentStepIndex++;

            if (this.currentStepIndex >= this.steps.length) {
                this.stop();
            } else {
                this.showStep(this.currentStepIndex);
            }
        }

        /**
         * Displays a specific step of the tour.
         * @param {number} index - The index of the step to display.
         */
        showStep(index) {
            const step = this.steps[index];
            const targetElement = document.querySelector(step.element);

            if (!targetElement) {
                console.warn(`Tour target element not found: "${step.element}". Ending tour.`);
                this.stop();
                return;
            }

            this._updateTooltipContent(step, index);
            this._positionElements(targetElement);
        }

        /**
         * Creates and appends the highlight and tooltip elements to the DOM.
         * @private
         */
        _createDOMElements() {
            this.elements.highlight = document.createElement('div');
            this.elements.highlight.className = 'tour-highlight-element';

            this.elements.tooltip = document.createElement('div');
            this.elements.tooltip.className = 'tour-tooltip';

            document.body.append(this.elements.highlight, this.elements.tooltip);
        }

        /**
         * Removes the tour elements from the DOM.
         * @private
         */
        _removeDOMElements() {
            this.elements.highlight?.remove();
            this.elements.tooltip?.remove();
        }

        /**
         * Updates the content and event listeners for the tooltip.
         * @private
         * @param {object} step - The current step object.
         * @param {number} index - The index of the current step.
         */
        _updateTooltipContent(step, index) {
            this.elements.tooltip.innerHTML = `
                <h4>${step.title}</h4>
                <p>${step.content}</p>
                <div class="tour-tooltip-footer">
                    <span class="tour-progress">${index + 1} / ${this.steps.length}</span>
                    <button class="tour-next-btn">${index === this.steps.length - 1 ? 'Finish' : 'Next'}</button>
                </div>
            `;
            this.elements.tooltip.querySelector('.tour-next-btn').addEventListener('click', () => this.next(), { once: true });
        }

        /**
         * Positions the highlight and tooltip relative to the target element.
         * @private
         * @param {HTMLElement} targetElement - The element to highlight.
         */
        _positionElements(targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const { highlight, tooltip } = this.elements;
            
            // Position the highlight element
            highlight.style.top = `${rect.top - 5}px`;
            highlight.style.left = `${rect.left - 5}px`;
            highlight.style.width = `${rect.width + 10}px`;
            highlight.style.height = `${rect.height + 10}px`;

            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';

            // Robustly position the tooltip, ensuring it stays within the viewport
            const tooltipRect = tooltip.getBoundingClientRect();
            const margin = 10;
            let tooltipTop, tooltipLeft;

            // Prefer positioning below the element if there's enough space
            if (window.innerHeight - rect.bottom > tooltipRect.height + margin + 15) {
                tooltipTop = rect.bottom + 15;
            } else {
                tooltipTop = rect.top - tooltipRect.height - 15;
            }

            // Center horizontally relative to the target
            tooltipLeft = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

            // Clamp values to ensure the tooltip is always visible
            tooltipTop = Math.max(margin, Math.min(tooltipTop, window.innerHeight - tooltipRect.height - margin));
            tooltipLeft = Math.max(margin, Math.min(tooltipLeft, window.innerWidth - tooltipRect.width - margin));

            tooltip.style.top = `${tooltipTop}px`;
            tooltip.style.left = `${tooltipLeft}px`;
        }
        
        /**
         * Bound class method to handle clicks outside the tour tooltip, which will end the tour.
         * @private
         */
        _handleGlobalClick = (event) => {
            if (this.isPerformingAction || this.elements.tooltip?.contains(event.target)) {
                return;
            }
            this.stop();
        };
    }

    // --- Tour Initiation Logic ---
    const tour = new GuidedTour();

    document.getElementById('tourButton')?.addEventListener('click', () => {
        // If another tour is somehow active, stop it before starting a new one.
        if (tour.isActive) tour.stop();
        tour.start();
    });

    // Automatically start the tour for first-time visitors.
    if (!localStorage.getItem('ttx_tour_completed')) {
        setTimeout(() => tour.start(), 1500);
    }
});