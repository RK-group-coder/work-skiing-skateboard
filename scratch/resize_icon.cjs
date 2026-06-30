const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `.td-sb-icon {
      width: 48px;
      height: 48px;`;

const replaceStr = `.td-sb-icon {
      width: 72px;
      height: 72px;`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully resized td-sb-icon to 72px");
