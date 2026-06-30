const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// The incorrect button:
// onclick="window.location.href='admin.html'"
// Change to:
// onclick="showPage(document.getElementById('page-admin')); document.getElementById('hm-side-menu').style.transform='translateX(100%)'; document.getElementById('hm-side-overlay').style.opacity='0'; document.getElementById('hm-side-overlay').style.pointerEvents='none';"

content = content.replace(
  /onclick="window\.location\.href='admin\.html'"/g,
  `onclick="showPage(document.getElementById('page-admin')); document.getElementById('hm-side-menu').style.transform='translateX(100%)'; document.getElementById('hm-side-overlay').style.opacity='0'; document.getElementById('hm-side-overlay').style.pointerEvents='none';"`
);

// We should also make sure it has the id so that db.js can show/hide it
content = content.replace(
  /<div style="padding: 14px 18px; border-radius: 12px; font-weight: 700; color: white; background: #0f172a; cursor: pointer; font-size: 16px; display: flex; align-items: center; transition: all 0.2s; box-shadow: 0 4px 12px rgba\(15,23,42,0\.2\);" onclick="showPage\(document\.getElementById\('page-admin'\)\)/g,
  `<div id="hm-menu-admin-btn" style="padding: 14px 18px; border-radius: 12px; font-weight: 700; color: white; background: #0f172a; cursor: pointer; font-size: 16px; display: flex; align-items: center; transition: all 0.2s; box-shadow: 0 4px 12px rgba(15,23,42,0.2);" onclick="showPage(document.getElementById('page-admin'))`
);

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed the admin link to use showPage('page-admin') instead of admin.html");
