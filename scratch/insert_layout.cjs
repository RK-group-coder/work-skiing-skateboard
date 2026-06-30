const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
const htmlPath = 'C:/Users/User/Documents/work-skiing-skateboard/task_detail.html';

let content = fs.readFileSync(path, 'utf8');
const newHTML = fs.readFileSync(htmlPath, 'utf8');

// 1. Add onclick to btn-start-quest5
const btnSearch = '<div id="btn-start-quest5" style="position: absolute; bottom: 8vh; left: 50%; transform: translateX(-50%); font-size: 2.2rem; font-weight: 700; color: #fff; letter-spacing: 4px; cursor: pointer; animation: text-blink 1.5s infinite; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">';
const btnReplace = '<div id="btn-start-quest5" onclick="showPage(document.getElementById(\'page-task-quest5\'))" style="position: absolute; bottom: 8vh; left: 50%; transform: translateX(-50%); font-size: 2.2rem; font-weight: 700; color: #fff; letter-spacing: 4px; cursor: pointer; animation: text-blink 1.5s infinite; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">';

content = content.replace(btnSearch, btnReplace);

// 2. Append newHTML before <!-- App JS -->
if (content.includes('<!-- ===== TASK DETAIL PAGE (Health Checkup) ===== -->')) {
    console.log("Task detail page already exists in index.html.");
} else {
    const insertMarker = '<!-- App JS -->';
    if (content.includes(insertMarker)) {
        content = content.replace(insertMarker, newHTML + '\n\n  ' + insertMarker);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully appended new layout to index.html");
    } else {
        // Fallback to before </body>
        const bodyEnd = content.indexOf('</body>');
        content = content.substring(0, bodyEnd) + newHTML + '\n\n' + content.substring(bodyEnd);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully appended new layout before </body>");
    }
}
