const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('id="page-task-quest5"');
if (startIdx !== -1) {
    const logoStart = content.indexOf('<div class="td-logo-area">', startIdx);
    if (logoStart !== -1) {
        const logoEnd = content.indexOf('</div>', logoStart) + 6;
        
        const oldLogoHTML = content.substring(logoStart, logoEnd);
        const newLogoHTML = oldLogoHTML.replace(/ncku_emblem\.png[^"]*/, 'icon_health_check.png');
        
        content = content.substring(0, logoStart) + newLogoHTML + content.substring(logoEnd);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully replaced the top-left logo with icon_health_check.png");
    } else {
        console.log("Could not find td-logo-area in quest5.");
    }
} else {
    console.log("Could not find quest5 container.");
}
