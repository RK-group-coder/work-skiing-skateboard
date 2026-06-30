const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('id="page-task-quest5"');
if (startIdx !== -1) {
    const iconStart = content.indexOf('<div class="td-sb-icon"', startIdx);
    if (iconStart !== -1) {
        const iconEnd = content.indexOf('</div>', iconStart) + 6;
        
        // Since the user actually wanted the other image
        const newIcon = '<div class="td-sb-icon" style="background: transparent;"><img src="icon_health_check_correct.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: contain;"></div>';
        
        content = content.substring(0, iconStart) + newIcon + content.substring(iconEnd);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully replaced the SVG with the correct downloaded image.");
    } else {
        console.log("Could not find td-sb-icon in quest5.");
    }
} else {
    console.log("Could not find quest5 container.");
}
