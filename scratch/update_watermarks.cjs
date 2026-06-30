const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const oldWatermarkStr1 = '<img src="ncku_emblem.png" style="position: absolute; top: 60%; left: -100px; transform: translateY(-50%); width: 600px; opacity: 0.04; pointer-events: none; z-index: 0;">';
const oldWatermarkStr2 = '<img src="ncku_emblem.png" style="position: absolute; top: 60%; right: -100px; transform: translateY(-50%); width: 600px; opacity: 0.04; pointer-events: none; z-index: 0;">';

const newWatermarkStr1 = '<img src="ncku_emblem.png" style="position: absolute; top: -100px; left: -200px; transform: rotate(-15deg); width: 850px; opacity: 0.04; pointer-events: none; z-index: 0;">';
const newWatermarkStr2 = '<img src="ncku_emblem.png" style="position: absolute; bottom: -200px; right: -150px; transform: rotate(25deg); width: 900px; opacity: 0.04; pointer-events: none; z-index: 0;">';

if (content.includes(oldWatermarkStr1) && content.includes(oldWatermarkStr2)) {
    content = content.replace(oldWatermarkStr1, newWatermarkStr1);
    content = content.replace(oldWatermarkStr2, newWatermarkStr2);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully updated watermarks size, position, and rotation.");
} else {
    console.log("Could not find the old watermark strings.");
}
