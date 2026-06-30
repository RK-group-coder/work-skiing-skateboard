const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('id="page-cover-quest5"');
if (startIdx !== -1) {
    const headlineStart = content.indexOf('<div class="cover-headline">', startIdx);
    if (headlineStart !== -1) {
        const headlineEnd = content.indexOf('</div>', headlineStart) + 6;
        
        const newHeadline = `<div class="cover-headline">
        <h1>防患未然，</h1>
        <h1>健康大未來</h1>
        <h1>從今天啟航！</h1>
      </div>`;
        
        content = content.substring(0, headlineStart) + newHeadline + content.substring(headlineEnd);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully replaced headline in quest5.");
    } else {
        console.log("Could not find cover-headline in quest5.");
    }
} else {
    console.log("Could not find quest5 container.");
}
