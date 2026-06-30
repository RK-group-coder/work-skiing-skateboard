const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Change background color of the page container
content = content.replace(
  '<div class="page" id="page-task-quest5-step2" style="display: none; background: #FFFDF8;',
  '<div class="page" id="page-task-quest5-step2" style="display: none; background: #FFF8E7;'
);

// 2. Update Header background to maroon
content = content.replace(
  '<header style="padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; background: white;">',
  '<header style="padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; background: #6E1414; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">'
);

// 3. Update Title text color to off-white
content = content.replace(
  '<div style="display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; color: #333;">',
  '<div style="display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; color: #FFFDF8;">'
);

// 4. Update Back button styling for dark background
content = content.replace(
  '<button onclick="showPage(document.getElementById(\'page-task-quest5\'))" style="background: none; border: 1px solid #ccc; padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #555; font-weight: bold; transition: 0.2s;">',
  '<button onclick="showPage(document.getElementById(\'page-task-quest5\'))" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #FFFDF8; font-weight: bold; transition: 0.2s;" onmouseover="this.style.background=\'rgba(255,255,255,0.2)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.1)\'">'
);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully updated header to dark red and background to light yellow.");
