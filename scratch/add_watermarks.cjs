const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Update the page container style to include position: relative and overflow-x: hidden
const oldPageContainerStart = '<div class="page" id="page-task-quest5-step2" style="display: none; background: #FFF8E7; min-height: 100vh; font-family: \'Noto Sans TC\', sans-serif;">';
const newPageContainerStart = '<div class="page" id="page-task-quest5-step2" style="display: none; background: #FFF8E7; min-height: 100vh; font-family: \'Noto Sans TC\', sans-serif; position: relative; overflow-x: hidden;">';

if(content.includes(oldPageContainerStart)) {
    content = content.replace(oldPageContainerStart, newPageContainerStart);
}

// 2. Insert the watermark images after the header
// First find the header block inside quest5-step2
const newPageStart = content.indexOf('id="page-task-quest5-step2"');
if (newPageStart !== -1) {
    const headerEnd = content.indexOf('</header>', newPageStart);
    if (headerEnd !== -1) {
        const watermarkHTML = `
  <!-- Watermarks -->
  <img src="ncku_emblem.png" style="position: absolute; top: 60%; left: -100px; transform: translateY(-50%); width: 600px; opacity: 0.04; pointer-events: none; z-index: 0;">
  <img src="ncku_emblem.png" style="position: absolute; top: 60%; right: -100px; transform: translateY(-50%); width: 600px; opacity: 0.04; pointer-events: none; z-index: 0;">
  `;
        content = content.substring(0, headerEnd + 9) + watermarkHTML + content.substring(headerEnd + 9);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully added watermarks to step 2 page.");
    }
}
