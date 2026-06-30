const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add new CSS for td-step-left, td-step-check
const newCSS = `
    /* --- New step layout: check | number | text --- */
    .td-step-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      margin-bottom: 20px;
      position: relative;
      cursor: pointer;
      transition: transform 0.15s;
    }
    .td-step-item:hover {
      transform: translateX(4px);
    }
    .td-step-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 10px;
      min-width: 28px;
    }
    .td-step-check {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid #D4BFA9;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.3s;
    }
    .td-step-check .td-check-icon {
      display: none;
    }
    .td-step-item.done .td-step-check {
      background: #4CAF50;
      border-color: #4CAF50;
    }
    .td-step-item.done .td-step-check .td-check-icon {
      display: block;
      width: 14px;
      height: 14px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E") no-repeat center/contain;
    }
    .td-step-left .td-step-line {
      width: 2px;
      flex: 1;
      min-height: 24px;
      border-left: 2px dashed #D4BFA9;
      margin-top: 6px;
    }
    .td-step-item.done .td-step-left .td-step-line {
      border-left-color: #4CAF50;
      border-left-style: solid;
    }
    .td-step-marker {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid #D4BFA9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      color: #8B7355;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .td-step-content {
      flex: 1;
      padding-top: 2px;
    }
    .td-step-title {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      margin-bottom: 2px;
    }
    .td-step-desc {
      font-size: 13px;
      color: #888;
    }
    .td-step-item.done .td-step-desc {
      color: #4CAF50;
      font-weight: 600;
    }
`;

// 2. Inject the new CSS before closing </style> of the quest5 section
// Find the td-step-item block in CSS and replace it
const oldStepItemCSS = `.td-step-item {
      display: flex;
      margin-bottom: 24px;
      position: relative;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .td-step-item:hover {
      transform: translateX(5px);
    }`;

if (content.includes(oldStepItemCSS)) {
    content = content.replace(oldStepItemCSS, newCSS);
    console.log("Replaced old step CSS with new layout CSS.");
} else {
    // Try to find and insert before a known marker
    const marker = '.td-step-line {';
    const idx = content.indexOf(marker, content.indexOf('id="page-task-quest5"'));
    if (idx !== -1) {
        content = content.substring(0, idx) + newCSS + '\n    ' + content.substring(idx);
        console.log("Inserted new CSS before .td-step-line");
    } else {
        console.log("Could not locate CSS insertion point.");
    }
}

// 3. Also remove old CSS for td-step-marker, td-step-line, td-step-content, td-step-title, td-step-desc inside quest5 styles
// (they are now replaced by the new CSS above)

// 4. Update the JS interaction script to target the new structure
const oldJSMarker = `const stepItems = quest5Page.querySelectorAll('.td-step-item');`;
const newJSMarker = `const stepItems = quest5Page.querySelectorAll('.td-step-item');`;
// The JS already correctly targets .td-step-item, so we just need to update what happens inside to not touch .td-step-marker for the checkmark
// Instead it should update .td-step-check

const oldClickHandler = `item.addEventListener('click', () => {
            const isDone = item.classList.toggle('done');
            
            // Toggle checkmark SVG vs Number
            const marker = item.querySelector('.td-step-marker');
            if (isDone) {
              marker.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
              
              // Change description to "已完成"
              const desc = item.querySelector('.td-step-desc');
              item.dataset.origDesc = desc.innerText;
              desc.innerText = '已完成';
            } else {
              marker.innerHTML = index + 1;
              const desc = item.querySelector('.td-step-desc');
              if (item.dataset.origDesc) {
                desc.innerText = item.dataset.origDesc;
              }
            }`;

const newClickHandler = `item.addEventListener('click', () => {
            const isDone = item.classList.toggle('done');
            
            // Toggle description text
            const desc = item.querySelector('.td-step-desc');
            if (isDone) {
              item.dataset.origDesc = desc.innerText;
              desc.innerText = '已完成';
            } else {
              if (item.dataset.origDesc) {
                desc.innerText = item.dataset.origDesc;
              }
            }`;

if (content.includes(oldClickHandler)) {
    content = content.replace(oldClickHandler, newClickHandler);
    console.log("Updated JS click handler.");
} else {
    console.log("Could not find old JS click handler to update.");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Done.");
