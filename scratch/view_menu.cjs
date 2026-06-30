const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/success new student/index.html', 'utf8');
const start = content.indexOf('id="hm-side-menu"');
console.log(content.substring(start - 50, start + 800));
