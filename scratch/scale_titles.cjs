const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Scale H1 and move it down (the container)
const oldMain = '<main style="max-width: 1000px; margin: 60px auto; padding: 0 20px; text-align: center;">';
const newMain = '<main style="max-width: 1000px; margin: 120px auto 60px auto; padding: 0 20px; text-align: center;">';
content = content.replace(oldMain, newMain);

// 2. Scale H1
const oldH1 = 'font-size: 42px; color: #1a1a1a; margin-bottom: 16px; font-weight: 800; letter-spacing: 2px;">預約健康檢查</h1>';
const newH1 = 'font-size: 55px; color: #1a1a1a; margin-bottom: 16px; font-weight: 800; letter-spacing: 2px;">預約健康檢查</h1>';
content = content.replace(oldH1, newH1);

// 3. Scale P
const oldP = 'font-size: 18px; color: #666; margin-bottom: 100px; font-weight: 500;">9/7日前檢查';
const newP = 'font-size: 24px; color: #666; margin-bottom: 100px; font-weight: 500;">9/7日前檢查';
content = content.replace(oldP, newP);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully scaled title text and moved container down.");
