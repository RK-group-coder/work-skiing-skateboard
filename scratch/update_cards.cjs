const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// The original HTML for the cards:
const originalLeftCard = `<div style="position: relative; width: 340px; height: 220px; border-radius: 24px; background: linear-gradient(135deg, #FFD180, #FFB74D); box-shadow: 0 10px 25px rgba(255, 183, 77, 0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;"`;

const newLeftCard = `<div style="position: relative; width: 340px; height: 220px; border-radius: 24px; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('ncku_hospital_card.png') center/cover; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;"`;

// Need to change the text color for the left card to white for contrast
const leftCardTitleOrigin = `<h2 style="font-size: 28px; color: #1a1a1a; font-weight: 800; margin: 0; z-index: 2;">在成大醫院檢查</h2>`;
const leftCardTitleNew = `<h2 style="font-size: 28px; color: #ffffff; font-weight: 800; margin: 0; z-index: 2; text-shadow: 1px 2px 4px rgba(0,0,0,0.5);">在成大醫院檢查</h2>`;

const originalRightCard = `<div style="position: relative; width: 340px; height: 220px; border-radius: 24px; background: linear-gradient(135deg, #FFCA28, #FFA000); box-shadow: 0 10px 25px rgba(255, 160, 0, 0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;"`;

// For the right card, we can use CSS grid directly in the inline style, or create a container inside.
// Actually, it's easier to put an absolute positioned grid div behind the text.
const newRightCard = `<div style="position: relative; width: 340px; height: 220px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px; overflow: hidden;"`;

const rightCardTitleOrigin = `<h2 style="font-size: 28px; color: #1a1a1a; font-weight: 800; margin: 0; z-index: 2;">自行選擇醫院</h2>`;
const rightCardGridAndTitleNew = `
          <!-- 4-grid background -->
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 2px; z-index: 0;">
            <div style="background: url('hospital_1.png') center/cover;"></div>
            <div style="background: url('hospital_2.png') center/cover;"></div>
            <div style="background: url('hospital_3.png') center/cover;"></div>
            <div style="background: url('hospital_4.png') center/cover;"></div>
          </div>
          <!-- Dark Overlay -->
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1;"></div>
          
          <h2 style="font-size: 28px; color: #ffffff; font-weight: 800; margin: 0; z-index: 2; text-shadow: 1px 2px 4px rgba(0,0,0,0.5);">自行選擇醫院</h2>`;

content = content.replace(originalLeftCard, newLeftCard);
content = content.replace(leftCardTitleOrigin, leftCardTitleNew);

content = content.replace(originalRightCard, newRightCard);
content = content.replace(rightCardTitleOrigin, rightCardGridAndTitleNew);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated cards with generated images.");
