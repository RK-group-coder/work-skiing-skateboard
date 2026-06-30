const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// Replace Step 3 CSS
const step3StyleOld = `<style>
          .q5s3-step { display: flex; gap: 16px; position: relative; cursor: pointer; padding: 12px 0; }
          .q5s3-step:hover .td-step-title { color: #fbbf24; }
          .q5s3-step-left { display: flex; flex-direction: column; align-items: center; width: 24px; position: relative; }
          .q5s3-step-check { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #cbd5e1; background: white; z-index: 2; transition: all 0.3s; }
          .q5s3-step-line { width: 2px; height: calc(100% + 24px); background: dashed 2px #e2e8f0; position: absolute; top: 24px; z-index: 1; }
          .q5s3-step-marker { width: 24px; height: 24px; border-radius: 50%; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #94a3b8; font-weight: bold; }
          .q5s3-step-title { font-weight: 700; color: #334155; font-size: 16px; transition: color 0.2s; }
          
          /* Done State */
          .q5s3-step.done .q5s3-step-check { background: #fbbf24; border-color: #fbbf24; }
          .q5s3-step.done .q5s3-step-line { background: solid 2px #fbbf24; }
        </style>`;

const step3StyleNew = `<style>
          .q5s3-step { display: flex; gap: 16px; position: relative; cursor: pointer; padding: 12px 0; }
          .q5s3-step:hover .q5s3-step-title { color: #4CAF50; }
          .q5s3-step-left { display: flex; flex-direction: column; align-items: center; width: 24px; position: relative; }
          .q5s3-step-check { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #cbd5e1; background: white; z-index: 2; transition: all 0.3s; }
          .q5s3-step-line { width: 2px; height: calc(100% + 24px); background: dashed 2px #e2e8f0; position: absolute; top: 24px; z-index: 1; transition: all 0.3s; }
          .q5s3-step-marker { width: 24px; height: 24px; border-radius: 50%; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #94a3b8; font-weight: bold; transition: all 0.3s; }
          .q5s3-step-title { font-weight: 700; color: #334155; font-size: 16px; transition: color 0.2s; }
          
          /* Done State */
          .q5s3-step.done .q5s3-step-check { 
            background: #4CAF50; 
            border-color: #4CAF50; 
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>');
            background-size: 14px;
            background-position: center;
            background-repeat: no-repeat;
          }
          .q5s3-step.done .q5s3-step-line { background: #4CAF50; }
          .q5s3-step.done .q5s3-step-marker { background: #4CAF50; border-color: #4CAF50; color: white; }
          .q5s3-step.done .q5s3-step-title { color: #4CAF50; }
        </style>`;

// Replace Step 4 CSS
const step4StyleOld = `<style>
          .q5s4-step { display: flex; gap: 16px; position: relative; cursor: pointer; padding: 16px 0; }
          .q5s4-step:hover .q5s4-step-title { color: #FF9800; }
          .q5s4-step-left { display: flex; flex-direction: column; align-items: center; width: 28px; position: relative; }
          .q5s4-step-check { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #cbd5e1; background: white; z-index: 2; transition: all 0.3s; }
          .q5s4-step-line { width: 2px; height: calc(100% + 32px); background: dashed 2px #e2e8f0; position: absolute; top: 28px; z-index: 1; }
          .q5s4-step-title { font-weight: 700; color: #334155; font-size: 18px; transition: color 0.2s; line-height: 28px; }
          .q5s4-step.done .q5s4-step-check { background: #FF9800; border-color: #FF9800; }
          .q5s4-step.done .q5s4-step-line { background: solid 2px #FF9800; }
        </style>`;

const step4StyleNew = `<style>
          .q5s4-step { display: flex; gap: 16px; position: relative; cursor: pointer; padding: 16px 0; }
          .q5s4-step:hover .q5s4-step-title { color: #4CAF50; }
          .q5s4-step-left { display: flex; flex-direction: column; align-items: center; width: 28px; position: relative; }
          .q5s4-step-check { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #cbd5e1; background: white; z-index: 2; transition: all 0.3s; }
          .q5s4-step-line { width: 2px; height: calc(100% + 32px); background: dashed 2px #e2e8f0; position: absolute; top: 28px; z-index: 1; transition: all 0.3s; }
          .q5s4-step-title { font-weight: 700; color: #334155; font-size: 18px; transition: color 0.2s; line-height: 28px; }
          .q5s4-step.done .q5s4-step-check { 
            background: #4CAF50; 
            border-color: #4CAF50; 
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>');
            background-size: 16px;
            background-position: center;
            background-repeat: no-repeat;
          }
          .q5s4-step.done .q5s4-step-line { background: #4CAF50; }
          .q5s4-step.done .q5s4-step-title { color: #4CAF50; }
        </style>`;

// Use basic string replacement but handle slight whitespace differences by using regex if necessary
// But since we wrote these exactly in our earlier scripts, exact match should work.
if(content.includes(step3StyleOld)) {
    content = content.replace(step3StyleOld, step3StyleNew);
    console.log("Updated Step 3 styles.");
} else {
    console.log("Step 3 old style block not found. Trying regex...");
    content = content.replace(/<style>[\s\S]*?\.q5s3-step\.done \.q5s3-step-check[\s\S]*?<\/style>/g, step3StyleNew);
}

if(content.includes(step4StyleOld)) {
    content = content.replace(step4StyleOld, step4StyleNew);
    console.log("Updated Step 4 styles.");
} else {
    console.log("Step 4 old style block not found. Trying regex...");
    content = content.replace(/<style>[\s\S]*?\.q5s4-step\.done \.q5s4-step-check[\s\S]*?<\/style>/g, step4StyleNew);
}

fs.writeFileSync(path, content, 'utf8');
