const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const step5HTML = `
<!-- Quest 5 Step 5 Page (Other Hospitals - PDF form) -->
<div class="page" id="page-task-quest5-step5" style="display: none; background: #FCF8F5; min-height: 100vh; font-family: 'Noto Sans TC', sans-serif;">
  
  <!-- Top Navigation (Inline Styled) -->
  <header style="display: flex; justify-content: space-between; align-items: center; padding: 12px 40px; background: #FFFDF8; border-bottom: 1px solid #E5E5E5; color: #1a1a1a;">
    <div style="display: flex; align-items: center; gap: 20px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="icon_health_check.png" alt="NCKU" style="width: 40px; height: 40px;">
        <span style="font-weight: 800; font-size: 20px;">成大新手教學系統</span>
      </div>
      <div style="width: 1px; height: 20px; background: #e5e5e5;"></div>
      <div style="color: #666; font-size: 14px; font-weight: 500;">
        <span>首頁</span> <span style="margin: 0 6px; color: #ccc;">/</span> <span>任務地圖</span> <span style="margin: 0 6px; color: #ccc;">/</span> <span style="color: #FF6D00; font-weight: bold;">自行選擇醫院</span>
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
  </header>

  <div style="display: flex; max-width: 1400px; margin: 40px auto; gap: 32px; padding: 0 20px; align-items: stretch;">
    <!-- Left Sidebar -->
    <aside style="background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); padding: 32px; width: 340px; display: flex; flex-direction: column; flex-shrink: 0;">
      <div style="border-bottom: 2px dashed #eee; padding-bottom: 24px; margin-bottom: 24px;">
        <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
          <div style="width: 60px; height: 60px; background: #FFF3E0; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 32px;">🏥</div>
          <div>
            <h2 style="margin: 0; font-size: 24px; color: #1a1a1a;">自行選擇醫院</h2>
            <div style="color: #666; font-size: 14px; margin-top: 4px;">依序完成以下步驟</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <span id="q5s5-progress-num" style="font-size: 32px; font-weight: 800; color: #FF9800;">0</span> 
            <span style="color: #999; font-size: 16px;">/ 2</span><br>
            <span style="color: #666; font-size: 14px;">已完成</span>
          </div>
        </div>
      </div>

      <div id="q5s5-steps" style="display: flex; flex-direction: column; gap: 0;">
        <style>
          .q5s5-step { display: flex; gap: 16px; position: relative; cursor: pointer; padding: 16px 0; }
          .q5s5-step:hover .q5s5-step-title { color: #4CAF50; }
          .q5s5-step-left { display: flex; flex-direction: column; align-items: center; width: 28px; position: relative; }
          .q5s5-step-check { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #cbd5e1; background: white; z-index: 2; transition: all 0.3s; }
          .q5s5-step-line { width: 0px; height: calc(100% - 12px); border-left: 2px dashed #cbd5e1; position: absolute; top: 34px; left: 13px; z-index: 1; transition: all 0.3s; }
          .q5s5-step-title { font-weight: 700; color: #334155; font-size: 18px; transition: color 0.2s; line-height: 28px; }
          
          .q5s5-step.done .q5s5-step-check { 
            background: #4CAF50; 
            border-color: #4CAF50; 
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>');
            background-size: 16px;
            background-position: center;
            background-repeat: no-repeat;
          }
          .q5s5-step.done .q5s5-step-line { border-left: 2px solid #4CAF50; }
          .q5s5-step.done .q5s5-step-title { color: #4CAF50; }
        </style>

        <div class="q5s5-step">
          <div class="q5s5-step-left"><div class="q5s5-step-check"></div><div class="q5s5-step-line"></div></div>
          <div style="flex: 1;">
            <div class="q5s5-step-title">列印健康檢查紀錄卡</div>
            <button class="s5-sub-btn" onclick="event.stopPropagation(); this.innerText='已加入 ✓'; this.style.background='#22c55e'; this.style.color='white';" style="margin-top: 8px; background: #cbd5e1; border: none; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; color: #475569; cursor: pointer; transition: all 0.3s;">加入待辦</button>
          </div>
        </div>
        <div class="q5s5-step">
          <div class="q5s5-step-left"><div class="q5s5-step-check"></div></div>
          <div style="flex: 1;"><div class="q5s5-step-title">攜帶表格如期健檢</div></div>
        </div>
      </div>

      <div style="margin-top: auto; padding-top: 32px;">
        <button id="td-btn-next-quest5-step5" class="disabled" style="width: 100%; background: #6E1414; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: not-allowed; transition: 0.3s; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(110, 20, 20, 0.3); opacity: 0.5;">
          下一步
        </button>
        <button onclick="showPage(document.getElementById('page-task-quest5-step4'))" style="width: 100%; background: white; color: #666; border: 2px solid #eee; padding: 14px; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s;">
          返回上一步
        </button>
      </div>
    </aside>

    <!-- Right Browser Area -->
    <main style="flex: 1; min-width: 0; background: white; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column;">
      
      <!-- Browser Header -->
      <div style="background: #f1f5f9; padding: 16px 20px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;">
        <div style="display: flex; gap: 8px;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #eab308;"></div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #22c55e;"></div>
        </div>
        <div style="display: flex; gap: 12px; color: #94a3b8;">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.6-6.3L2 8"/></svg>
        </div>
        <div style="flex: 1; background: white; border-radius: 20px; padding: 8px 16px; font-size: 14px; color: #475569; display: flex; align-items: center; gap: 8px; border: 1px solid #e2e8f0;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          https://health-epsh.ncku.edu.tw/var/file/97/1097/img/437/650053435.pdf
        </div>
      </div>
      
      <!-- Mock Browser Content: PDF File -->
      <div style="flex: 1; overflow-y: auto; background: #525659; padding: 40px; display: flex; justify-content: center;">
         
         <div style="background: white; width: 100%; max-width: 800px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); padding: 40px; font-family: 'MingLiU', serif;">
            <div style="text-align: center; margin-bottom: 20px;">
               <div style="font-size: 14px; color: #666; margin-bottom: 8px;">大學校院學生健康資料卡中文版</div>
               <h2 style="font-size: 26px; margin: 0; letter-spacing: 2px;">國立成功大學—學生健康檢查紀錄卡</h2>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px;">
               <div>
                  □應屆新生 □復學生 □轉學生 □提早入學生<br>
                  □其他入學身分：＿＿＿＿＿＿
               </div>
               <div style="text-align: right;">
                  入學年月：＿＿＿＿年＿＿＿＿月<br>
                  檢查日期：＿＿＿＿年＿＿＿＿月＿＿＿＿日
               </div>
               <div style="border: 1px solid #000; padding: 10px; width: 150px; text-align: center;">
                  學號
               </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; border: 2px solid #000;">
               <tr>
                  <td rowspan="4" style="width: 30px; text-align: center; writing-mode: vertical-lr; border: 1px solid #000; padding: 10px;">學生基本資料</td>
                  <td style="border: 1px solid #000; padding: 8px; width: 80px; text-align: center;">姓名</td>
                  <td style="border: 1px solid #000; padding: 8px;"></td>
                  <td style="border: 1px solid #000; padding: 8px; width: 80px; text-align: center;">就讀系所</td>
                  <td colspan="3" style="border: 1px solid #000; padding: 8px;">學院 ＿＿＿＿系(所) ＿＿＿＿年級 ＿＿＿＿班(組)</td>
               </tr>
               <tr>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center; background: #eee;">出生日期<br>(西元)</td>
                  <td style="border: 1px solid #000; padding: 8px;">＿＿年＿＿月＿＿日</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center; background: #eee;">性別</td>
                  <td style="border: 1px solid #000; padding: 8px;">□男 □女</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center; background: #eee;">血型</td>
                  <td style="border: 1px solid #000; padding: 8px;">□A型 □B型 □AB型<br>□O型 □不知道</td>
               </tr>
               <tr>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center; background: #eee;">行動電話</td>
                  <td style="border: 1px solid #000; padding: 8px;"></td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center; background: #eee;">E-mail</td>
                  <td colspan="3" style="border: 1px solid #000; padding: 8px;"></td>
               </tr>
               <tr>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center; background: #eee;">戶籍地址<br><br>現居地址</td>
                  <td colspan="5" style="border: 1px solid #000; padding: 8px;"><br><br>□同上 □如右：</td>
               </tr>
               <tr>
                  <td rowspan="2" style="width: 30px; text-align: center; writing-mode: vertical-lr; border: 1px solid #000; padding: 10px;">健康基本資料</td>
                  <td colspan="6" style="border: 1px solid #000; padding: 10px;">
                     ◆個人疾病史：(勾選本人曾患過的疾病)<br>
                     □1.無　　　□6.腎臟病　　　□11.關節炎　　　□16.重大手術名稱：＿＿＿＿＿＿<br>
                     □2.肺結核　□7.癲癇　　　　□12.糖尿病　　　□17.過敏物質名稱：＿＿＿＿＿＿<br>
                     □3.心臟病　□8.紅斑性狼瘡　□13.心理疾病　　□18.其他：＿＿＿＿＿＿<br>
                     □4.肝炎　　□9.血友病　　　□14.癌症<br>
                     □5.氣喘　　□10.蠶豆症　　 □15.海洋性貧血<br>
                  </td>
               </tr>
            </table>

         </div>

      </div>
    </main>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const q5s5Page = document.getElementById('page-task-quest5-step5');
      if (!q5s5Page) return;
      const stepItems = q5s5Page.querySelectorAll('.q5s5-step');
      const progressNum = q5s5Page.querySelector('#q5s5-progress-num');
      const nextBtn = document.getElementById('td-btn-next-quest5-step5');
      stepItems.forEach((item) => {
        item.addEventListener('click', (e) => {
          if (e.target.tagName.toLowerCase() === 'button') return; // Don't trigger if clicked on sub-button
          item.classList.toggle('done');
          const doneCount = q5s5Page.querySelectorAll('.q5s5-step.done').length;
          progressNum.innerText = doneCount;
          if (doneCount === stepItems.length) {
            nextBtn.classList.remove('disabled');
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
          } else {
            nextBtn.classList.add('disabled');
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
          }
        });
      });
      if(nextBtn) {
         nextBtn.addEventListener('click', () => {
           if(!nextBtn.classList.contains('disabled')) {
              showReminderModal();
           }
         });
      }
    }, 1000);
  });
</script>
`;

if (!content.includes('id="page-task-quest5-step5"')) {
    content += '\n' + step5HTML;
}

// Update Step 4 script to go to Step 5 instead of showing Modal
// The script block for step 4 has this snippet:
/*
      const q5s4Page = document.getElementById('page-task-quest5-step4');
      ...
      if(nextBtn) {
         nextBtn.addEventListener('click', () => {
           if(!nextBtn.classList.contains('disabled')) {
              showReminderModal();
           }
         });
      }
*/
// To carefully replace ONLY step 4's script logic, we can find the script block that contains 'q5s4Page'
const step4ScriptStart = content.indexOf(`const q5s4Page = document.getElementById('page-task-quest5-step4');`);
if (step4ScriptStart !== -1) {
    const nextBtnListenerStart = content.indexOf(`nextBtn.addEventListener('click',`, step4ScriptStart);
    if (nextBtnListenerStart !== -1) {
        const replaceOld = `showReminderModal();`;
        const replaceNew = `showPage(document.getElementById('page-task-quest5-step5'));`;
        
        // Find the index of showReminderModal(); after nextBtnListenerStart
        const targetIndex = content.indexOf(replaceOld, nextBtnListenerStart);
        if (targetIndex !== -1 && targetIndex < nextBtnListenerStart + 300) { // Safety bound
            content = content.substring(0, targetIndex) + replaceNew + content.substring(targetIndex + replaceOld.length);
        }
    }
}

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully created Step 5 and updated Step 4 transition.");
