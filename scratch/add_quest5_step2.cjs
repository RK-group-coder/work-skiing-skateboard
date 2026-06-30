const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// The new page HTML
const newPageHTML = `
<!-- Quest 5 Step 2 Page -->
<div class="page" id="page-task-quest5-step2" style="display: none; background: #FFFDF8; min-height: 100vh; font-family: 'Noto Sans TC', sans-serif;">
  <!-- Header -->
  <header style="padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; background: white;">
    <div style="display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; color: #333;">
      <img src="icon_health_check_correct.png" alt="NCKU" style="width: 32px; height: 32px; border-radius: 50%;">
      成大新手教學系統
    </div>
    <button onclick="showPage(document.getElementById('page-task-quest5'))" style="background: none; border: 1px solid #ccc; padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #555; font-weight: bold; transition: 0.2s;">
      &larr; 返回上一步
    </button>
  </header>

  <!-- Main Content -->
  <main style="max-width: 1000px; margin: 60px auto; padding: 0 20px; text-align: center;">
    
    <h1 style="font-size: 42px; color: #1a1a1a; margin-bottom: 16px; font-weight: 800; letter-spacing: 2px;">預約健康檢查</h1>
    <p style="font-size: 18px; color: #666; margin-bottom: 60px; font-weight: 500;">9/7日前檢查 &nbsp;|&nbsp; 9月底前繳交報告</p>

    <div style="display: flex; justify-content: center; gap: 60px; flex-wrap: wrap;">
      
      <!-- Card 1: NCKU Hospital -->
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="position: relative; width: 340px; height: 220px; border-radius: 24px; background: linear-gradient(135deg, #FFD180, #FFB74D); box-shadow: 0 10px 25px rgba(255, 183, 77, 0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;" 
             onmouseover="this.style.transform='translateY(-10px) scale(1.02)'" 
             onmouseout="this.style.transform='translateY(0) scale(1)'">
          
          <h2 style="font-size: 28px; color: #1a1a1a; font-weight: 800; margin: 0; z-index: 2;">在成大醫院檢查</h2>
          
          <!-- Badge -->
          <div style="position: absolute; bottom: -20px; right: -20px; width: 100px; height: 100px; background: #0056b3; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px; box-shadow: 0 8px 16px rgba(0,86,179,0.3); border: 4px solid #FFFDF8;">
            標示用
          </div>
        </div>
        <p style="font-size: 16px; font-weight: 700; color: #444; border-bottom: 2px solid #333; padding-bottom: 4px; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#6E1414'; this.style.borderColor='#6E1414'" onmouseout="this.style.color='#444'; this.style.borderColor='#333'">
          點我觀看 <span style="color: #6E1414;">各科系優惠時段</span>
        </p>
      </div>

      <!-- Card 2: Other Hospitals -->
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="position: relative; width: 340px; height: 220px; border-radius: 24px; background: linear-gradient(135deg, #FFCA28, #FFA000); box-shadow: 0 10px 25px rgba(255, 160, 0, 0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;"
             onmouseover="this.style.transform='translateY(-10px) scale(1.02)'" 
             onmouseout="this.style.transform='translateY(0) scale(1)'">
          
          <h2 style="font-size: 28px; color: #1a1a1a; font-weight: 800; margin: 0; z-index: 2;">自行選擇醫院</h2>
          
          <!-- Badge -->
          <div style="position: absolute; bottom: -20px; right: -20px; width: 100px; height: 100px; background: #FF6D00; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px; box-shadow: 0 8px 16px rgba(255,109,0,0.3); border: 4px solid #FFFDF8;">
            標示用
          </div>
        </div>
        <p style="font-size: 16px; font-weight: 700; color: #444; border-bottom: 2px solid #333; padding-bottom: 4px; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#6E1414'; this.style.borderColor='#6E1414'" onmouseout="this.style.color='#444'; this.style.borderColor='#333'">
          點我觀看 <span style="color: #6E1414;">各地區合規醫院</span>
        </p>
      </div>

    </div>
  </main>
</div>
`;

// Append new page right before </body>
content = content.replace('</body>', newPageHTML + '\n</body>');

// Now, update the JS handler for the Next button in page-task-quest5
// The previous script had: alert('任務五完成！即將返回任務地圖並解鎖最終任務！'); showPage(document.getElementById('page-home'));
const oldAlertStr = "alert('任務五完成！即將返回任務地圖並解鎖最終任務！');";
const oldShowPageStr = "showPage(document.getElementById('page-home'));";

if (content.includes(oldShowPageStr) && content.includes(oldAlertStr)) {
    content = content.replace(oldAlertStr, "");
    content = content.replace(oldShowPageStr, "showPage(document.getElementById('page-task-quest5-step2'));");
    console.log("Successfully updated the next button click handler.");
} else {
    console.log("Could not find the exact old JS string to replace. Checking alternative pattern.");
    // Fallback: replace using regex if there was a slight difference
    const jsRegex = /alert\('任務五完成[^\)]+'\);\s*showPage\(document\.getElementById\('page-home'\)\);/g;
    content = content.replace(jsRegex, "showPage(document.getElementById('page-task-quest5-step2'));");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully appended new page html.");
