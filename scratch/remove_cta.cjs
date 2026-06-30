const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const regex = /<!-- Bottom CTA bar -->\s*<div class="cta-bar" id="cta-bar">\s*<span class="cta-label">.*?<\/span>\s*<button class="cta-arrow-btn" id="btn-start-quest5" aria-label=".*?">\s*<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"\s*stroke-linecap="round" stroke-linejoin="round">\s*<path d="M5 12h14M12 5l7 7-7 7" \/>\s*<\/svg>\s*<\/button>\s*<\/div>/;

if (regex.test(content)) {
    content = content.replace(regex, '<!-- Bottom CTA bar removed for Quest 5 -->');
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully removed CTA bar for Quest 5");
} else {
    console.log("Could not find the CTA bar with regex. Attempting fallback...");
    // Fallback if regex fails due to line endings
    const startIdx = content.indexOf('<button class="cta-arrow-btn" id="btn-start-quest5"');
    if (startIdx !== -1) {
        const divStart = content.lastIndexOf('<div class="cta-bar"', startIdx);
        const divEnd = content.indexOf('</div>', startIdx) + 6;
        const commentStart = content.lastIndexOf('<!-- Bottom CTA bar -->', divStart);
        
        let removeStart = divStart;
        if (commentStart !== -1 && (divStart - commentStart < 50)) {
            removeStart = commentStart;
        }
        
        content = content.substring(0, removeStart) + '<!-- Bottom CTA bar removed for Quest 5 -->' + content.substring(divEnd);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully removed CTA bar for Quest 5 using fallback");
    } else {
        console.log("Failed to find btn-start-quest5");
    }
}
