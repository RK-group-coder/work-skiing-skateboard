const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// Step 3 fix
const s3LineOld = `.q5s3-step-line { width: 2px; height: calc(100% + 24px); background: dashed 2px #e2e8f0; position: absolute; top: 24px; z-index: 1; transition: all 0.3s; }`;
const s3LineNew = `.q5s3-step-line { width: 0px; height: calc(100% - 12px); border-left: 2px dashed #cbd5e1; position: absolute; top: 30px; left: 11px; z-index: 1; transition: all 0.3s; }`;

const s3DoneLineOld = `.q5s3-step.done .q5s3-step-line { background: #4CAF50; }`;
const s3DoneLineNew = `.q5s3-step.done .q5s3-step-line { border-left: 2px solid #4CAF50; }`;

if (content.includes(s3LineOld)) {
    content = content.replace(s3LineOld, s3LineNew);
} else {
    console.log("Could not find exact s3LineOld");
}
if (content.includes(s3DoneLineOld)) {
    content = content.replace(s3DoneLineOld, s3DoneLineNew);
} else {
    console.log("Could not find exact s3DoneLineOld");
}

// Step 4 fix
const s4LineOld = `.q5s4-step-line { width: 2px; height: calc(100% + 32px); background: dashed 2px #e2e8f0; position: absolute; top: 28px; z-index: 1; transition: all 0.3s; }`;
const s4LineNew = `.q5s4-step-line { width: 0px; height: calc(100% - 12px); border-left: 2px dashed #cbd5e1; position: absolute; top: 34px; left: 13px; z-index: 1; transition: all 0.3s; }`;

const s4DoneLineOld = `.q5s4-step.done .q5s4-step-line { background: #4CAF50; }`;
const s4DoneLineNew = `.q5s4-step.done .q5s4-step-line { border-left: 2px solid #4CAF50; }`;

if (content.includes(s4LineOld)) {
    content = content.replace(s4LineOld, s4LineNew);
} else {
    console.log("Could not find exact s4LineOld");
}
if (content.includes(s4DoneLineOld)) {
    content = content.replace(s4DoneLineOld, s4DoneLineNew);
} else {
    console.log("Could not find exact s4DoneLineOld");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully fixed step lines.");
