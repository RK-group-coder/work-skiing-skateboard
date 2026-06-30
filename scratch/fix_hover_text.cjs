const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// Left Card updates
content = content.replace(
  "document.getElementById('dynamic-bg-left').style.opacity='1';\"",
  "document.getElementById('dynamic-bg-left').style.opacity='1'; document.getElementById('page-task-quest5-step2').classList.add('has-dynamic-bg');\""
);
content = content.replace(
  "document.getElementById('dynamic-bg-left').style.opacity='0';\"",
  "document.getElementById('dynamic-bg-left').style.opacity='0'; document.getElementById('page-task-quest5-step2').classList.remove('has-dynamic-bg');\""
);

// Right Card updates
content = content.replace(
  "document.getElementById('dynamic-bg-right').style.opacity='1';\"",
  "document.getElementById('dynamic-bg-right').style.opacity='1'; document.getElementById('page-task-quest5-step2').classList.add('has-dynamic-bg');\""
);
content = content.replace(
  "document.getElementById('dynamic-bg-right').style.opacity='0';\"",
  "document.getElementById('dynamic-bg-right').style.opacity='0'; document.getElementById('page-task-quest5-step2').classList.remove('has-dynamic-bg');\""
);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully appended class toggle for text color change.");
