const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/success new student/index.html', 'utf8');
const start = content.indexOf('id="hm-side-menu"');
if(start !== -1) {
   console.log(content.substring(start, start + 3000));
}
