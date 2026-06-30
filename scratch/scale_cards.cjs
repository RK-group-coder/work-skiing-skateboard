const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// Scale up the two cards
content = content.replace(/width: 340px; height: 220px;/g, 'width: 442px; height: 286px;');

// Move them down a bit (increasing margin above the cards flex container)
// The subtitle `<p style="... margin-bottom: 60px; ...">9/7日前檢查 &nbsp;|&nbsp; 9月底前繳交報告</p>`
content = content.replace('margin-bottom: 60px; font-weight: 500;">9/7日前檢查', 'margin-bottom: 100px; font-weight: 500;">9/7日前檢查');

// Also, slightly reduce the gap so they fit nicely within max-width: 1000px
content = content.replace('gap: 60px; flex-wrap: wrap;', 'gap: 40px; flex-wrap: wrap;');

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully scaled up cards and moved them down.");
