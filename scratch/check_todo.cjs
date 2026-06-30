const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/success new student/index.html', 'utf8');
console.log('Contains global-todo-list:', content.includes('id="global-todo-list"'));
const start = content.indexOf('id="global-todo-list"');
if(start !== -1) {
   console.log(content.substring(start - 50, start + 300));
}
