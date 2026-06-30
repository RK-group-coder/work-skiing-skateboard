const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('https://campus4.ncku.edu.tw/wwwmenu/program/fresh/health_check.php', 'https://healthcenter.epsh.ncku.edu.tw/');

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully updated the URL text.");
