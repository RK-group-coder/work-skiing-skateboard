const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                  // You can add actual logic to mark the node complete on the map here
                  showPage(document.getElementById('page-home'));`;

const replacementStr = `                  // Navigate to the next step
                  showPage(document.getElementById('page-task-quest5-step2'));`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully fixed the Next button navigation.");
} else {
    // try a more relaxed regex
    const regex = /showPage\(document\.getElementById\('page-home'\)\);/g;
    // but wait, there are other buttons going to page-home (like back button).
    // so we should only replace the one inside nextBtn listener.
    const searchBlock = `if(!nextBtn.classList.contains('disabled')) {`;
    const searchIdx = content.indexOf(searchBlock);
    if (searchIdx !== -1) {
        const endIdx = content.indexOf('}', searchIdx);
        let block = content.substring(searchIdx, endIdx);
        block = block.replace("showPage(document.getElementById('page-home'));", "showPage(document.getElementById('page-task-quest5-step2'));");
        content = content.substring(0, searchIdx) + block + content.substring(endIdx);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully fixed using block replacement.");
    } else {
        console.log("Could not find the block to fix.");
    }
}
