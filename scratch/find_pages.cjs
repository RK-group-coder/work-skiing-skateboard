const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/success new student/index.html', 'utf8');
const lines = content.split('\n');
const res = [];
lines.forEach(l => {
  const m = l.match(/id="page-[^"]+"/);
  if(m) res.push(m[0]);
});
console.log(Array.from(new Set(res)));
