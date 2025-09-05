/*
 * tour.js
 * Logic for the guided walkthrough tour.
 * © 2025 TeacherToybox.com. All Rights Reserved.
 */

(function() {
  let demoOpen = false;
  let demoJustClosedAt = 0;
  let backdrop, modal, video;
  let activeOnCloseCallback = null; // Variable to hold the callback

  function closeDemoModal() {
    demoJustClosedAt = Date.now();
    if (!demoOpen) return;
    demoOpen = false;
    try { modal && modal.remove(); } catch(e) {}
    try { backdrop && backdrop.remove(); } catch(e) {}
    const btn = document.getElementById('demoButton');
    if (btn) btn.classList.remove('active');

    // Run the callback if it exists
    if (typeof activeOnCloseCallback === 'function') {
        activeOnCloseCallback();
        activeOnCloseCallback = null; // Clear it after use
    }
  }

  function openDemoModal(onCloseCallback) { // Accept the callback
    if (demoOpen) return;
    demoOpen = true;
    activeOnCloseCallback = onCloseCallback; // Store the callback

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
    
  window.TT.openDemoModal = openDemoModal;
  
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


let isTourActive = false;
let isPerformingAction = false;

// The tour steps are now hardcoded in English to isolate the problem.
const tourSteps = [
    {
        element: '#addButton',
        title: "Welcome to Teacher Toybox!",
        content: "This is your digital classroom command center. Let's quickly walk through the main controls. Click \"Next\" to continue."
    },
    {
        element: '#addButton',
        title: "Add a Window",
        content: "This button adds a new window. If one isn't open already, I'll click it for you so we can look at the window tools.",
        action: () => {
            if (document.querySelectorAll('.floating').length === 0) {
                document.getElementById('addButton')?.click();
            }
        }
    },
    {
        element: '.floating .win-sidebar',
        title: "Window Tool Palette",
        content: "Excellent! This is the tool palette for the new window. It has tools like a drawing canvas and text editor."
    },
    {
        element: '.floating .win-sidebar .icon-btn[data-hotkey="d"]',
        title: "Drawing Canvas",
        content: "For example, clicking this button turns the window into an interactive whiteboard. Let's try it.",
        action: () => document.querySelector('.floating .win-sidebar .icon-btn[data-hotkey="d"]')?.click()
    },
    {
        element: '#screenButton',
        title: "Arrange Your Screen",
        content: "This button reveals preset layouts. You can instantly organize your windows into splitscreen, quadrants, and more.",
        action: () => document.querySelector('#screenButton')?.click()
    },
    {
        element: '.floating .drag-bar',
        title: "Move & Resize",
        content: "You can also drag this bar to move windows, and resize them from any edge or corner."
    },
    {
        element: '#helpButton',
        title: "Help & Resources",
        content: "That's the basics! This button groups together the tour, demo video, and more information. Click 'Finish' to start exploring.",
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
        const margin = 10;
        const spaceBelow = window.innerHeight - rect.bottom;
        let tooltipTop = (spaceBelow >= tooltipRect.height + margin + 15) ? rect.bottom + 15 : rect.top - tooltipRect.height - 15;
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
    
    ['#layout-bar', '#management-bar', '#extra-tools-bar', '#help-bar'].forEach(selector => {
        document.querySelector(selector)?.classList.remove('open');
    });

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
    currentStep = 0;
    createTourElements();
    showStep(currentStep);
    setTimeout(() => {
        document.body.addEventListener('click', handleGlobalClick);
    }, 100);
}

const tourButton = document.getElementById('tourButton');
if (tourButton) {
    tourButton.addEventListener('click', startTour);
}

// --- First-Time User Experience ---
if (!localStorage.getItem('ttx_tour_completed')) {
    setTimeout(() => {
        // Since script.js is guaranteed to run first (due to defer), this will be ready
        if (window.TT && typeof window.TT.openDemoModal === 'function') {
            // Open the demo modal and pass the startTour function as the callback
            window.TT.openDemoModal(startTour);
        }
    }, 1500); // Wait for splash screen to fade
}