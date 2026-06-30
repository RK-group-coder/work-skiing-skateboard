const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// There are two identical boxes to update
const oldBoxBackground = `background: #f1f5f9; padding: 20px 30px; border-radius: 20px; transition: all 0.2s; border: 2px solid transparent;`;
const newBoxBackground = `background: #6E1414; padding: 20px 30px; border-radius: 20px; transition: all 0.2s; border: 2px solid transparent; box-shadow: 0 10px 20px rgba(110,20,20,0.2);`;

const oldBoxText = `color: #334155;`;
const newBoxText = `color: #FFFDF8;`;

// We need to specifically target the modal content so we don't accidentally replace other things
const modalStart = `id="quest5-reminder-modal"`;
const modalIndex = content.indexOf(modalStart);

if (modalIndex !== -1) {
    let beforeModal = content.substring(0, modalIndex);
    let modalContent = content.substring(modalIndex);

    // Replace the background for the two boxes
    modalContent = modalContent.split(oldBoxBackground).join(newBoxBackground);
    
    // Replace the text color for the titles (繳費收據寫學號 and 至衛生保健組繳交收據)
    // The spans have: style="font-size: 22px; font-weight: 700; color: #334155;"
    const oldSpanStyle = `font-size: 22px; font-weight: 700; color: #334155;`;
    const newSpanStyle = `font-size: 22px; font-weight: 700; color: #FFFDF8;`;
    modalContent = modalContent.split(oldSpanStyle).join(newSpanStyle);

    content = beforeModal + modalContent;
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully updated box colors in the modal.");
} else {
    console.log("Modal not found in the file.");
}
