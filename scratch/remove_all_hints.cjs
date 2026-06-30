const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const regex = /<div class="td-hint-box">[\s\S]*?<\/div>\s*<\/div>/g;
content = content.replace(regex, '');

fs.writeFileSync(path, content, 'utf8');
console.log("Removed all remaining hints.");
