const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const oldModalStyle = `style="background: white; border-radius: 32px; padding: 60px 50px; max-width: 650px; width: 90%; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.15); position: relative; transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);" id="quest5-reminder-modal-content"`;
const newModalStyle = `style="background: linear-gradient(rgba(255, 253, 248, 0.9), rgba(255, 253, 248, 0.9)), url('ncku_emblem.png') no-repeat center center / 60% white; border: 6px solid #6E1414; border-radius: 32px; padding: 60px 50px; max-width: 650px; width: 90%; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.15); position: relative; transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);" id="quest5-reminder-modal-content"`;

if (content.includes(oldModalStyle)) {
    content = content.replace(oldModalStyle, newModalStyle);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully updated modal border and background.");
} else {
    console.log("Could not find the exact modal style to replace.");
}
