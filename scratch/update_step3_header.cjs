const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const step3Id = 'id="page-task-quest5-step3"';
const startIndex = content.indexOf(step3Id);
if (startIndex === -1) {
    console.error("Step 3 not found");
    process.exit(1);
}

const headerStartStr = '<!-- Top Navigation (Inline Styled) -->';
const headerStart = content.indexOf(headerStartStr, startIndex);
const headerEndStr = '</header>';
const headerEnd = content.indexOf(headerEndStr, headerStart) + headerEndStr.length;

const newHeader = `<!-- Top Navigation (Inline Styled) -->
  <header style="display: flex; justify-content: space-between; align-items: center; padding: 12px 40px; background: #FFFDF8; border-bottom: 1px solid #E5E5E5; color: #1a1a1a;">
    <div style="display: flex; align-items: center; gap: 20px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="icon_health_check.png" alt="NCKU" style="width: 40px; height: 40px;">
        <span style="font-weight: 800; font-size: 20px;">成大新手教學系統</span>
      </div>
      <div style="width: 1px; height: 20px; background: #e5e5e5;"></div>
      <div style="color: #666; font-size: 14px; font-weight: 500;">
        <span>首頁</span> <span style="margin: 0 6px; color: #ccc;">/</span> <span>任務地圖</span> <span style="margin: 0 6px; color: #ccc;">/</span> <span style="color: #6E1414; font-weight: bold;">健康檢查</span>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 24px;">
      <div style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #ccc;"></div>
        <span style="font-weight: bold; font-size: 14px; color: #333;">新生同學 <span style="font-size: 10px; color: #666;">▼</span></span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; background: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; border: 1px solid #e5e5e5; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <span style="color: #8B1A1A; font-weight: 900; font-size: 11px;">LV.1</span>
        <span style="color: #666;">新手村居民</span>
        <div style="width: 60px; height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; margin: 0 4px;">
           <div style="width: 40%; height: 100%; background: #8B1A1A;"></div>
        </div>
        <span style="color: #999; font-size: 11px;">120 / 300 XP 🏆</span>
      </div>
      <div style="display: flex; gap: 16px; color: #333;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer;"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </div>
    </div>
  </header>`;

content = content.substring(0, headerStart) + newHeader + content.substring(headerEnd);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully replaced step 3 header.");
