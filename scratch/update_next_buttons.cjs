const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// Step 3 Next Button
const step3BtnOld = `background: #fbbf24; color: white; border: none; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: not-allowed; transition: 0.3s; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);`;
const step3BtnNew = `background: #6E1414; color: white; border: none; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: not-allowed; transition: 0.3s; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(110, 20, 20, 0.3);`;

if (content.includes(step3BtnOld)) {
    content = content.replace(step3BtnOld, step3BtnNew);
    console.log("Updated step 3 button.");
}

// Step 4 Next Button
const step4BtnOld = `background: #FF9800; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: not-allowed; transition: 0.3s; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);`;
const step4BtnNew = `background: #6E1414; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: not-allowed; transition: 0.3s; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(110, 20, 20, 0.3);`;

if (content.includes(step4BtnOld)) {
    content = content.replace(step4BtnOld, step4BtnNew);
    console.log("Updated step 4 button.");
}

fs.writeFileSync(path, content, 'utf8');
