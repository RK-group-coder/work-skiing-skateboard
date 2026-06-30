const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const brokenCSS = `.td-step-item {
      cursor: pointer;
      transition: transform 0.2s;
    }
    .td-step-item:hover {
      transform: translateX(5px);
      display: flex;
      margin-bottom: 24px;
      position: relative;
    }`;

const fixedCSS = `.td-step-item {
      display: flex;
      margin-bottom: 24px;
      position: relative;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .td-step-item:hover {
      transform: translateX(5px);
    }`;

if (content.includes(brokenCSS)) {
    content = content.replace(brokenCSS, fixedCSS);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully fixed td-step-item CSS layout bug.");
} else {
    // If exact whitespace matching fails, use regex
    const regex = /\.td-step-item\s*\{\s*cursor:\s*pointer;\s*transition:\s*transform\s*0\.2s;\s*\}\s*\.td-step-item:hover\s*\{\s*transform:\s*translateX\(5px\);\s*display:\s*flex;\s*margin-bottom:\s*24px;\s*position:\s*relative;\s*\}/;
    if (regex.test(content)) {
        content = content.replace(regex, fixedCSS);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully fixed td-step-item CSS using Regex.");
    } else {
        console.log("Could not find the broken CSS to fix.");
    }
}
