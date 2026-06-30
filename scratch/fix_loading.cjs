const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the redundant loading screen HTML
const loadingScreenStart = content.indexOf('<!-- Fullscreen Loading Overlay -->');
if (loadingScreenStart !== -1) {
    const loadingScreenEnd = content.indexOf('</script>', loadingScreenStart) + 9; // ends with the script tag
    if (loadingScreenEnd > 9) {
        content = content.substring(0, loadingScreenStart) + content.substring(loadingScreenEnd);
    }
}

// 2. Change the onclick handlers in Step 2 to use the existing playLoadingTransition
const step2Start = content.indexOf('id="page-task-quest5-step2"');
if (step2Start !== -1) {
    const step2End = content.indexOf('id="page-task-quest5-step3"', step2Start);
    let step2Section = content.substring(step2Start, step2End !== -1 ? step2End : undefined);
    
    // Replace transitionWithLoading with playLoadingTransition
    step2Section = step2Section.replace(
        /onclick="transitionWithLoading\(document\.getElementById\('page-task-quest5-step3'\)\)"/g, 
        `onclick="playLoadingTransition(() => showPage(document.getElementById('page-task-quest5-step3')))"`
    );
    
    step2Section = step2Section.replace(
        /onclick="transitionWithLoading\(document\.getElementById\('page-task-quest5-step4'\)\)"/g, 
        `onclick="playLoadingTransition(() => showPage(document.getElementById('page-task-quest5-step4')))"`
    );
    
    if (step2End !== -1) {
        content = content.substring(0, step2Start) + step2Section + content.substring(step2End);
    } else {
        content = content.substring(0, step2Start) + step2Section;
    }
}

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully reverted redundant loading screen and used playLoadingTransition.");
