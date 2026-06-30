const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// Replace in closeReminderModalAndGoHome
content = content.replace(
    /function closeReminderModalAndGoHome\(\) \{[\s\S]*?showPage\(document\.getElementById\('page-home'\)\);[\s\S]*?\}/g,
    (match) => {
        return match.replace(
            `showPage(document.getElementById('page-home'));`,
            `playLoadingTransition(() => showPage(document.getElementById('page-home')));`
        );
    }
);

// Replace in closeStep5ReminderModalAndGoHome
content = content.replace(
    /function closeStep5ReminderModalAndGoHome\(\) \{[\s\S]*?showPage\(document\.getElementById\('page-home'\)\);[\s\S]*?\}/g,
    (match) => {
        return match.replace(
            `showPage(document.getElementById('page-home'));`,
            `playLoadingTransition(() => showPage(document.getElementById('page-home')));`
        );
    }
);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully updated modal close functions to use playLoadingTransition.");
