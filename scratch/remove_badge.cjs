const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const badgeHtmlStart = '<!-- Blue Badge -->';
const badgeHtmlEnd = '標示用\n     </div>';

const startIndex = content.indexOf(badgeHtmlStart);
if (startIndex !== -1) {
    const endIndex = content.indexOf(badgeHtmlEnd, startIndex) + badgeHtmlEnd.length;
    if (endIndex > badgeHtmlEnd.length) {
        // Remove the badge block
        content = content.slice(0, startIndex) + content.slice(endIndex);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully removed the blue badge.");
    } else {
        console.log("Could not find the end of the badge html.");
    }
} else {
    console.log("Could not find the start of the badge html.");
}
