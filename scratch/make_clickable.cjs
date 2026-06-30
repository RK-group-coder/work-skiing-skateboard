const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add z-index to btn-start-quest5 and make it larger to click
const btnSearch = 'id="btn-start-quest5" onclick="showPage(document.getElementById(\'page-task-quest5\'))" style="position: absolute;';
const btnReplace = 'id="btn-start-quest5" onclick="showPage(document.getElementById(\'page-task-quest5\'))" style="z-index: 1000; position: absolute;';
content = content.replace(btnSearch, btnReplace);

// 2. Add onclick to the whole page-cover-quest5 container
// <div class="page cover-page hidden" id="page-cover-quest5" style="display:none;">
const pageSearch = '<div class="page cover-page hidden" id="page-cover-quest5" style="display:none;">';
const pageReplace = '<div class="page cover-page hidden" id="page-cover-quest5" style="display:none; cursor: pointer;" onclick="if(event.target.closest(\'#btn-back-map-quest5\')) return; showPage(document.getElementById(\'page-task-quest5\'))">';
content = content.replace(pageSearch, pageReplace);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully made the entire page clickable");
