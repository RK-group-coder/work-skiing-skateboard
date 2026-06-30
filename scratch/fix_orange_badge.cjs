const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove 'overflow: hidden;' from other-card-inner
const oldCardInner = 'id="other-card-inner" style="position: relative; width: 442px; height: 286px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px; overflow: hidden;"';
const newCardInner = 'id="other-card-inner" style="position: relative; width: 442px; height: 286px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;"';
content = content.replace(oldCardInner, newCardInner);

// 2. Add 'border-radius: 24px; overflow: hidden;' to the 4-grid background div
const oldGridDiv = '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 2px; z-index: 0;">';
const newGridDiv = '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 2px; z-index: 0; border-radius: 24px; overflow: hidden;">';
content = content.replace(oldGridDiv, newGridDiv);

// 3. Add 'border-radius: 24px;' to the Dark Overlay div (it doesn't need overflow:hidden, but border-radius is needed so it doesn't bleed)
const oldOverlayDiv = '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1;"></div>';
const newOverlayDiv = '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1; border-radius: 24px;"></div>';
content = content.replace(oldOverlayDiv, newOverlayDiv);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully fixed the clipping of the orange badge.");
