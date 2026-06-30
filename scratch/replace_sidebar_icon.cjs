const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// The original tag in index.html (the one we appended):
// <div class="td-sb-icon">
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
// </div>

const startIdx = content.indexOf('id="page-task-quest5"');
if (startIdx !== -1) {
    const iconStart = content.indexOf('<div class="td-sb-icon">', startIdx);
    if (iconStart !== -1) {
        const iconEnd = content.indexOf('</div>', iconStart) + 6;
        
        // Since the downloaded image already has a brown circle background, we can just replace the whole div or put the img inside and clear the div's background
        const newIcon = '<div class="td-sb-icon" style="background: transparent;"><img src="icon_health_check.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: contain;"></div>';
        
        content = content.substring(0, iconStart) + newIcon + content.substring(iconEnd);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully replaced the SVG with the downloaded image.");
    } else {
        console.log("Could not find td-sb-icon in quest5.");
    }
} else {
    console.log("Could not find quest5 container.");
}
