const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// The button has: onclick="showPage(document.getElementById('page-task-quest5'))"
// but the target should be 'page-task-quest5-step2'

// First we fix the button inside page-cover-quest5
content = content.replace(
  /<div id="btn-start-quest5" onclick="showPage\(document\.getElementById\('page-task-quest5'\)\)"/g,
  `<div id="btn-start-quest5" onclick="playLoadingTransition(() => showPage(document.getElementById('page-task-quest5-step2')))"`
);

// We should also fix the page-cover-quest5 container onclick if it has one
content = content.replace(
  /onclick="if\(event\.target\.closest\('#btn-back-map-quest5'\)\) return; showPage\(document\.getElementById\('page-task-quest5'\)\)"/g,
  `onclick="if(event.target.closest('#btn-back-map-quest5')) return; playLoadingTransition(() => showPage(document.getElementById('page-task-quest5-step2')))"`
);

// Also verify back buttons in step2!
content = content.replace(
  /<button onclick="showPage\(document\.getElementById\('page-task-quest5'\)\)"/g,
  `<button onclick="showPage(document.getElementById('page-cover-quest5'))"`
);

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed link from cover page to step 2.");
