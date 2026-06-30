const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const injectedHint = `      <div style="margin-top: 16px; font-size: 14px; color: #333; line-height: 1.6; padding: 0 8px;">
        💡<br>
        • 若忘記密碼，可點選「忘記密碼」進行重設。<br>
        • 完成右側操作後，回到左側勾選完成，繼續下一步！
      </div>`;

content = content.replace(injectedHint, '');

fs.writeFileSync(path, content, 'utf8');
console.log("Removed duplicate hint.");
