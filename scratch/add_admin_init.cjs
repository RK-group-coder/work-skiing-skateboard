const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /onclick="showPage\(document\.getElementById\('page-admin'\)\); document\.getElementById\('hm-side-menu'\)\.style\.transform='translateX\(100%\)'; document\.getElementById\('hm-side-overlay'\)\.style\.opacity='0'; document\.getElementById\('hm-side-overlay'\)\.style\.pointerEvents='none';"/g,
  `onclick="showPage(document.getElementById('page-admin')); if(typeof adminLoadFormOptions === 'function') adminLoadFormOptions(); document.getElementById('hm-side-menu').style.transform='translateX(100%)'; document.getElementById('hm-side-overlay').style.opacity='0'; document.getElementById('hm-side-overlay').style.pointerEvents='none';"`
);

// Bust browser cache by updating the timestamp parameter on one of the stylesheets or images
content = content.replace(/style\.css\?v=[0-9]+/g, 'style.css?v=' + Date.now());
// If it doesn't have v= param, add it
if (!content.includes('style.css?v=')) {
    content = content.replace(/style\.css"/g, 'style.css?v=' + Date.now() + '"');
}

fs.writeFileSync(path, content, 'utf8');
console.log("Updated onclick and added cache buster.");
