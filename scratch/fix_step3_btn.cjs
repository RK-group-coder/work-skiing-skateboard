const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const step3BtnOld = `<button id="td-btn-next-quest5-step3" class="disabled" style="width: 100%; background: #fbbf24; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: not-allowed; transition: 0.3s; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3); opacity: 0.5;">`;
const step3BtnNew = `<button id="td-btn-next-quest5-step3" class="disabled" style="width: 100%; background: #6E1414; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: not-allowed; transition: 0.3s; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(110, 20, 20, 0.3); opacity: 0.5;">`;

if (content.includes(step3BtnOld)) {
    content = content.replace(step3BtnOld, step3BtnNew);
    console.log("Updated step 3 button successfully.");
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Could not find step 3 button.");
}
