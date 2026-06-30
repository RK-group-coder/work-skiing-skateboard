const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('id="page-cover-quest5"');
if (startIdx !== -1) {
    // Find the tag-badge div inside quest5
    const tagBadgeStart = content.indexOf('<div class="tag-badge">', startIdx);
    if (tagBadgeStart !== -1) {
        const svgStart = content.indexOf('<svg', tagBadgeStart);
        const svgEnd = content.indexOf('</svg>', svgStart) + 6;
        
        const newSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>';
        
        content = content.substring(0, svgStart) + newSvg + content.substring(svgEnd);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully replaced house SVG with heart SVG in quest5.");
    } else {
        console.log("Could not find tag-badge in quest5.");
    }
} else {
    console.log("Could not find quest5 container.");
}
