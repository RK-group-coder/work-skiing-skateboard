const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('id="page-task-quest5"');
if (startIdx !== -1) {
    const mockWebStart = content.indexOf('<div class="mock-web">', startIdx);
    if (mockWebStart !== -1) {
        // We need to find the matching closing </div> for mock-web.
        // It's followed closely by </div></div> (for td-browser-content and td-browser).
        // Let's just find the next </div>\n      </div>\n\n      <div class="td-hint-box">
        const hintBoxIdx = content.indexOf('<div class="td-hint-box">', mockWebStart);
        
        // Find the </div> that closes td-browser-content
        // The structure is:
        // <div class="td-browser-content">
        //   <div class="mock-web">...</div>
        // </div>
        // <div class="td-hint-box">
        
        // We'll replace from <div class="mock-web"> up to the </div> right before </div>\n      <div class="td-hint-box">
        
        // Wait, a safer way is to use regex or string parsing. 
        // Let's just replace the chunk starting at <div class="mock-web"> 
        // We can find the end by looking for <div class="td-hint-box"> and then backtracking to the closing div of mock-web.
        
        let endIdx = content.lastIndexOf('</div>', hintBoxIdx - 1); // this closes td-browser
        endIdx = content.lastIndexOf('</div>', endIdx - 1); // this closes td-browser-content
        endIdx = content.lastIndexOf('</div>', endIdx - 1); // this closes mock-web
        
        // Wait, to be perfectly safe, I will just do a string replacement on a large chunk.
        // Or I can use a simple substring replace.
        const chunkStart = mockWebStart;
        // Let's just find the exact string to replace. I will construct the string.
        // Actually, just find the start of `<div class="mock-web">` and the start of `</div>\n        </div>\n      </div>\n\n      <div class="td-hint-box">`
        
        const replaceEnd = content.indexOf('</div>\n        </div>\n      </div>\n\n      <div class="td-hint-box">', mockWebStart);
        
        if (replaceEnd !== -1) {
            const newContent = '<img src="ncku_health_system.png" style="width: 100%; height: auto; object-fit: contain;">\n        </div>\n      </div>\n\n      <div class="td-hint-box">';
            content = content.substring(0, chunkStart) + newContent + content.substring(replaceEnd + '</div>\n        </div>\n      </div>\n\n      <div class="td-hint-box">'.length);
            fs.writeFileSync(path, content, 'utf8');
            console.log("Successfully replaced mock-web with the uploaded image.");
        } else {
            // Alternative matching if formatting changed
            console.log("Could not find the exact end pattern. Trying an alternative...");
            const altEnd = content.indexOf('</div>\n      </div>\n\n      <div class="td-hint-box">', mockWebStart);
            if(altEnd !== -1) {
                // mock-web ends before altEnd
                // let's just find the last </div> before altEnd
                 const newContent = '<img src="ncku_health_system.png" style="width: 100%; height: auto; object-fit: contain;">\n';
                 
                 // Instead of complex string math, let's use a robust regex that matches the whole mock-web div
                 const regex = /<div class="mock-web">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div class="td-hint-box">/;
                 content = content.replace(regex, '<img src="ncku_health_system.png" style="width: 100%; height: auto; object-fit: contain; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 4px;">\n        </div>\n      </div>\n\n      <div class="td-hint-box">');
                 fs.writeFileSync(path, content, 'utf8');
                 console.log("Successfully replaced via Regex.");
            } else {
                console.log("Failed to find end of mock-web.");
            }
        }
    } else {
        console.log("Could not find mock-web in quest5.");
    }
} else {
    console.log("Could not find quest5 container.");
}
