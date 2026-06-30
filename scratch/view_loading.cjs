const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/success new student/index.html', 'utf8');
const start = content.indexOf('id="page-loading"');
console.log(content.substring(start - 200, start + 1000));
