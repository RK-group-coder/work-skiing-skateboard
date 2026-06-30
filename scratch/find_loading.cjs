const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/success new student/index.html', 'utf8');
const match = content.match(/id="[^"]*loading[^"]*"/ig);
console.log(match);
