const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Inject dynamic background divs at the beginning of page-task-quest5-step2
const pageStartStr = 'id="page-task-quest5-step2"';
const pageStartIdx = content.indexOf(pageStartStr);
if (pageStartIdx !== -1) {
    const insertIdx = content.indexOf('>', pageStartIdx) + 1;
    
    const dynamicBgs = `
  <!-- Dynamic Backgrounds -->
  <div id="dynamic-bg-left" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('ncku_hospital_card.png') center/cover; filter: blur(10px) brightness(0.6); opacity: 0; transition: opacity 0.5s ease; z-index: 0; pointer-events: none;"></div>
  <div id="dynamic-bg-right" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('hospital_1.png') center/cover; filter: blur(10px) brightness(0.6); opacity: 0; transition: opacity 0.5s ease; z-index: 0; pointer-events: none;"></div>
`;
    content = content.substring(0, insertIdx) + dynamicBgs + content.substring(insertIdx);
}

// 2. Add relative position and z-index to header and main so they stay on top
content = content.replace(
  '<header style="padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; background: #6E1414; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">',
  '<header style="padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; background: #6E1414; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: relative; z-index: 10;">'
);
content = content.replace(
  '<main style="max-width: 1000px; margin: 120px auto 60px auto; padding: 0 20px; text-align: center;">',
  '<main style="max-width: 1000px; margin: 120px auto 60px auto; padding: 0 20px; text-align: center; position: relative; z-index: 10;">'
);

// 3. Update the hover events on the left card
const oldLeftHover = 'onmouseover="this.style.transform=\'translateY(-10px) scale(1.02)\'" \n             onmouseout="this.style.transform=\'translateY(0) scale(1)\'"';
// It might not have a newline in the exact format depending on how my previous replace worked.
// Let's use regex to be safe.
const leftHoverRegex = /onmouseover="this\.style\.transform='translateY\(-10px\) scale\(1\.02\)'"\s*onmouseout="this\.style\.transform='translateY\(0\) scale\(1\)'"/;

const newLeftHover = `onmouseover="this.style.transform='translateY(-10px) scale(1.02)'; document.getElementById('dynamic-bg-left').style.opacity='1';" onmouseout="this.style.transform='translateY(0) scale(1)'; document.getElementById('dynamic-bg-left').style.opacity='0';"`;

// 4. Update the hover events on the right card. 
// Since they have the exact same old string, we can do replace one by one, but wait, if we use a regex without /g, it replaces the first one (left card).
if(leftHoverRegex.test(content)) {
    content = content.replace(leftHoverRegex, newLeftHover);
    console.log("Replaced left card hover.");
}

const newRightHover = `onmouseover="this.style.transform='translateY(-10px) scale(1.02)'; document.getElementById('dynamic-bg-right').style.opacity='1';" onmouseout="this.style.transform='translateY(0) scale(1)'; document.getElementById('dynamic-bg-right').style.opacity='0';"`;

if(leftHoverRegex.test(content)) {
    content = content.replace(leftHoverRegex, newRightHover);
    console.log("Replaced right card hover.");
}

// Ensure the watermarks are above the dynamic bgs but below content
content = content.replace('opacity: 0.04; pointer-events: none; z-index: 0;', 'opacity: 0.04; pointer-events: none; z-index: 1;');
content = content.replace('opacity: 0.04; pointer-events: none; z-index: 0;', 'opacity: 0.04; pointer-events: none; z-index: 1;'); // replace the second one too

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully added dynamic background hover effects.");
