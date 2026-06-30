const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/success new student/index.html', 'utf8');
const idx = content.indexOf('id="page-overview"');
console.log(content.substring(idx, idx + 500));
