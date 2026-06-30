const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// There are two "加入待辦" buttons we need to remove:
// <button class="td-btn-todo">加入待辦</button>

content = content.replace(/<button class="td-btn-todo">加入待辦<\/button>/g, '');

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully removed td-btn-todo buttons");
