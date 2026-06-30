const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/success new student/index.html', 'utf8');
const idx = content.indexOf('id="page-task-quest5-step2"');
console.log(content.substring(idx, idx + 500));
