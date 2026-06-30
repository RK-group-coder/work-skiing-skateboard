const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// The header of the new page has: <img src="icon_health_check_correct.png" alt="NCKU" style="width: 32px; height: 32px; border-radius: 50%;">
// Let's replace it with icon_health_check.png

const oldImgTag = '<img src="icon_health_check_correct.png" alt="NCKU" style="width: 32px; height: 32px; border-radius: 50%;">';
const newImgTag = '<img src="icon_health_check.png" alt="NCKU" style="width: 48px; height: 48px;">'; 
// Note: The previous page used 48px size for the crest logo (because user said "放大1.5倍" from 32px).
// And the laurel wreath logo doesn't need border-radius: 50% since it has transparent background.

// But wait, there might be other places where icon_health_check_correct.png is used. 
// I only want to replace it in the new page header. Let's find the new page header.
const newPageStart = content.indexOf('id="page-task-quest5-step2"');
if (newPageStart !== -1) {
    const headerStart = content.indexOf('<header', newPageStart);
    const headerEnd = content.indexOf('</header>', headerStart);
    
    let headerBlock = content.substring(headerStart, headerEnd);
    headerBlock = headerBlock.replace(oldImgTag, newImgTag);
    
    content = content.substring(0, headerStart) + headerBlock + content.substring(headerEnd);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully replaced the header icon in step 2.");
} else {
    console.log("Could not find the new page.");
}
