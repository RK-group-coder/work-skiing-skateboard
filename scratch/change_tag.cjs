const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('id="page-cover-quest5"');
if (startIdx !== -1) {
    const nextTagBadgeIdx = content.indexOf('入宿活動', startIdx);
    if (nextTagBadgeIdx !== -1) {
        content = content.substring(0, nextTagBadgeIdx) + '健康檢查' + content.substring(nextTagBadgeIdx + '入宿活動'.length);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully replaced '入宿活動' with '健康檢查' in quest5.");
    } else {
        console.log("Could not find '入宿活動' after quest5.");
    }
} else {
    console.log("Could not find quest5 container.");
}
