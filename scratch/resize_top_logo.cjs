const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `.td-logo-area img {
      width: 32px;
      height: 32px;
    }`;

const replaceStr = `.td-logo-area img {
      width: 48px;
      height: 48px;
    }`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully resized td-logo-area img to 48px");
