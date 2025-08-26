/* numbered-list.js */

function activateNumberedList(win) {
    const mainArea = win.querySelector('.win-main-area');
    if (!mainArea) return;

    mainArea.innerHTML = '';
    mainArea.style.padding = '0';
    win.dataset.tool = 'numbered-list';

    const container = document.createElement('div');
    container.className = 'numbered-list-container';

    // 1. Editable Title
    const title = document.createElement('h2');
    title.className = 'list-title';
    title.contentEditable = true;
    title.textContent = 'The List';

    title.addEventListener('focus', () => {
        if (title.textContent === 'The List') {
            title.textContent = '';
        }
    });

    title.addEventListener('blur', () => {
        if (title.textContent.trim() === '') {
            title.textContent = 'The List';
        }
    });

    // 2. Table for the list
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'list-table-wrapper';
    const table = document.createElement('table');
    table.className = 'list-table';
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    tableWrapper.appendChild(table);

    // 3. Bottom Controls
    const controls = document.createElement('div');
    controls.className = 'list-controls';

    const addRowBtn = document.createElement('button');
    addRowBtn.className = 'control-btn-large';
    addRowBtn.innerHTML = '<i class="fas fa-plus"></i>';
    addRowBtn.title = 'Add Row';

    const removeRowBtn = document.createElement('button');
    removeRowBtn.className = 'control-btn-large';
    removeRowBtn.innerHTML = '<i class="fas fa-minus"></i>';
    removeRowBtn.title = 'Remove Row';

    const resetBtn = document.createElement('button');
    resetBtn.className = 'control-btn-large';
    resetBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    resetBtn.title = 'Reset List';

    controls.append(addRowBtn, removeRowBtn, resetBtn);

    // --- Helper Functions ---
    const createRow = () => {
        const row = tbody.insertRow();
        const rowNumber = tbody.rows.length;

        // Column 1: Number
        const cellNum = row.insertCell();
        cellNum.className = 'col-number';
        cellNum.textContent = rowNumber;

        // Column 2: Text Input
        const cellText = row.insertCell();
        cellText.className = 'col-text';
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = `Item ${rowNumber}...`;
        cellText.appendChild(textInput);

        // Column 3: Counter
        const cellCounter = row.insertCell();
        cellCounter.className = 'col-counter';
        const minusBtn = document.createElement('button');
        minusBtn.className = 'counter-btn';
        minusBtn.textContent = '-';
        const valueSpan = document.createElement('span');
        valueSpan.className = 'counter-value';
        valueSpan.textContent = '0';
        const plusBtn = document.createElement('button');
        plusBtn.className = 'counter-btn';
        plusBtn.textContent = '+';

        plusBtn.onclick = () => {
            let currentValue = parseInt(valueSpan.textContent, 10);
            valueSpan.textContent = currentValue + 1;
        };

        minusBtn.onclick = () => {
            let currentValue = parseInt(valueSpan.textContent, 10);
            if (currentValue > 0) {
                valueSpan.textContent = currentValue - 1;
            }
        };

        cellCounter.append(minusBtn, valueSpan, plusBtn);
    };
    
    const updateRowNumbers = () => {
        Array.from(tbody.rows).forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    };

    const setupInitialState = () => {
        tbody.innerHTML = '';
        title.textContent = 'The List';
        for (let i = 0; i < 3; i++) {
            createRow();
        }
    };

    // --- Event Listeners for Controls ---
    addRowBtn.onclick = createRow;

    removeRowBtn.onclick = () => {
        if (tbody.rows.length > 1) { // Prevent removing all rows
            tbody.deleteRow(-1);
        }
    };

    resetBtn.onclick = setupInitialState;

    // Build the final structure and initialize
    container.append(title, tableWrapper, controls);
    mainArea.appendChild(container);
    setupInitialState();
}