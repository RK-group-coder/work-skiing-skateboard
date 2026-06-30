const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add onclick to the Other Hospitals card
// The card div looks like this:
// <div style="position: relative; width: 442px; height: 286px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;"
//              onmouseover="this.style.transform='translateY(-10px) scale(1.02)'; document.getElementById('dynamic-bg-right').style.opacity='1'; document.getElementById('page-task-quest5-step2').classList.add('has-dynamic-bg');" onmouseout="this.style.transform='translateY(0) scale(1)'; document.getElementById('dynamic-bg-right').style.opacity='0'; document.getElementById('page-task-quest5-step2').classList.remove('has-dynamic-bg');">
const rightCardSearchStr = `<div style="position: relative; width: 442px; height: 286px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;"
             onmouseover="this.style.transform='translateY(-10px) scale(1.02)'; document.getElementById('dynamic-bg-right').style.opacity='1'; document.getElementById('page-task-quest5-step2').classList.add('has-dynamic-bg');" onmouseout="this.style.transform='translateY(0) scale(1)'; document.getElementById('dynamic-bg-right').style.opacity='0'; document.getElementById('page-task-quest5-step2').classList.remove('has-dynamic-bg');">`;

const rightCardReplaceStr = `<div style="position: relative; width: 442px; height: 286px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;"
             onclick="showPage(document.getElementById('page-task-quest5-step4'))"
             onmouseover="this.style.transform='translateY(-10px) scale(1.02)'; document.getElementById('dynamic-bg-right').style.opacity='1'; document.getElementById('page-task-quest5-step2').classList.add('has-dynamic-bg');" onmouseout="this.style.transform='translateY(0) scale(1)'; document.getElementById('dynamic-bg-right').style.opacity='0'; document.getElementById('page-task-quest5-step2').classList.remove('has-dynamic-bg');">`;

content = content.replace(rightCardSearchStr, rightCardReplaceStr);

// 2. The HTML for Step 4
const step4HTML = `
<!-- Quest 5 Step 4 Page (Other Hospitals) -->
<div class="page" id="page-task-quest5-step4" style="display: none; background: #FCF8F5; min-height: 100vh; font-family: 'Noto Sans TC', sans-serif;">
  
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
            <span id="q5s4-progress-num" style="font-size: 32px; font-weight: 800; color: #FF9800;">0</span> 
            <span style="color: #999; font-size: 16px;">/ 2</span><br>
            <span style="color: #666; font-size: 14px;">已完成</span>
          </div>
        </div>
      </div>

      <div id="q5s4-steps" style="display: flex; flex-direction: column; gap: 0;">
        <!-- Steps Template -->
        <style>
          .q5s4-step { display: flex; gap: 16px; position: relative; cursor: pointer; padding: 16px 0; }
          .q5s4-step:hover .q5s4-step-title { color: #FF9800; }
          .q5s4-step-left { display: flex; flex-direction: column; align-items: center; width: 28px; position: relative; }
          .q5s4-step-check { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #cbd5e1; background: white; z-index: 2; transition: all 0.3s; }
          .q5s4-step-line { width: 2px; height: calc(100% + 32px); background: dashed 2px #e2e8f0; position: absolute; top: 28px; z-index: 1; }
          .q5s4-step-title { font-weight: 700; color: #334155; font-size: 18px; transition: color 0.2s; line-height: 28px; }
          
          /* Done State */
          .q5s4-step.done .q5s4-step-check { background: #FF9800; border-color: #FF9800; }
          .q5s4-step.done .q5s4-step-line { background: solid 2px #FF9800; }
        </style>

        <div class="q5s4-step">
          <div class="q5s4-step-left"><div class="q5s4-step-check"></div><div class="q5s4-step-line"></div></div>
          <div style="flex: 1;"><div class="q5s4-step-title">查詢合規醫院</div></div>
        </div>
        <div class="q5s4-step">
          <div class="q5s4-step-left"><div class="q5s4-step-check"></div></div> <!-- No line for last -->
          <div style="flex: 1;"><div class="q5s4-step-title">打電話/線上預約</div></div>
        </div>
      </div>

      <div style="margin-top: auto; padding-top: 32px;">
        <button id="td-btn-next-quest5-step4" class="disabled" style="width: 100%; background: #FF9800; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: not-allowed; transition: 0.3s; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3); opacity: 0.5;">
          下一步
        </button>
        <button onclick="showPage(document.getElementById('page-task-quest5-step2'))" style="width: 100%; background: white; color: #666; border: 2px solid #eee; padding: 14px; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s;">
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
          https://hrpts.osha.gov.tw/Home/CertifiedHospInfoSearch
        </div>
      </div>
      
      <!-- Mock Browser Content: OSHA System -->
      <div style="flex: 1; overflow-y: auto; background: #fff; padding: 0;">
          
          <!-- Banner Image Area -->
          <div style="background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%); padding: 30px; text-align: center; color: white;">
             <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;">勞工健康保護管理報備資訊系統</h1>
          </div>
          
          <!-- Sub Nav -->
          <div style="display: flex; border-bottom: 2px solid #00BCD4; font-size: 14px; font-weight: bold; color: #555;">
             <div style="padding: 15px 25px; cursor: pointer;">首頁</div>
             <div style="padding: 15px 25px; background: #E0F7FA; color: #00838F; cursor: pointer;">認可醫療機構查詢</div>
             <div style="padding: 15px 25px; cursor: pointer;">勞動檢查機構一覽表</div>
             <div style="padding: 15px 25px; cursor: pointer;">勞工主管機關一覽表</div>
             <div style="padding: 15px 25px; cursor: pointer;">認可顧問機構查詢</div>
             <div style="padding: 15px 25px; cursor: pointer;">操作手冊下載</div>
             <div style="padding: 15px 25px; cursor: pointer;">登入/帳號申請</div>
          </div>

          <div style="padding: 30px 40px;">
              <!-- Announcement Box -->
              <div style="background: #FFF3E0; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #FFE0B2;">
                 <h3 style="text-align: center; color: #333; margin-top: 0; font-size: 18px;">114年度勞工體格與健康檢查認可醫療機構檢查品質及管理分級訪查結果列A級之醫療機構</h3>
                 
                 <div style="display: flex; margin-top: 20px; font-size: 13px; color: #444; line-height: 1.8;">
                   <div style="flex: 1;">
                     <div style="font-weight: bold; margin-bottom: 5px;">特殊 (含一般) 體格及健康檢查：</div>
                     <div>1.國立臺灣大學醫學院附設醫院新竹臺大分院生醫醫院</div>
                     <div>2.亞洲大學附屬醫院</div>
                   </div>
                   <div style="flex: 1;">
                     <div style="font-weight: bold; margin-bottom: 5px;">特殊(含巡迴) 特殊體格及健康檢查<br>(特殊(含一般)類及巡迴特殊類訪查結果均為A級者)：</div>
                     <div>1.柳營奇美醫院</div>
                     <div>2.聯新國際醫院</div>
                     <div>3.大安醫院</div>
                     <div>4.中國醫藥大學北港附設醫院</div>
                   </div>
                 </div>
              </div>

              <!-- Search Section -->
              <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 18px;">勞工體格及健康檢查認可醫療機構查詢</h3>
              
              <p style="color: #D32F2F; font-size: 13px; font-weight: bold; margin-bottom: 25px;">系統僅會顯示「同時符合所有查詢條件」的資料，請確認各項條件設定正確，以避免查無資料。</p>

              <div style="display: flex; flex-direction: column; gap: 20px; max-width: 600px;">
                <div style="display: flex; align-items: center;">
                  <div style="width: 120px; text-align: right; padding-right: 20px; font-weight: bold; color: #555; font-size: 14px;">縣市別</div>
                  <div style="flex: 1; border: 1px solid #ccc; padding: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fff;">
                    <span style="color: #999; font-size: 14px;">請選擇</span>
                    <span style="font-size: 12px; color: #666;">▼</span>
                  </div>
                </div>
                <div style="display: flex; align-items: center;">
                  <div style="width: 120px; text-align: right; padding-right: 20px; font-weight: bold; color: #555; font-size: 14px;">鄉鎮市區</div>
                  <div style="flex: 1; border: 1px solid #ccc; padding: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fff;">
                    <span style="color: #999; font-size: 14px;">請選擇</span>
                    <span style="font-size: 12px; color: #666;">▼</span>
                  </div>
                </div>
              </div>
          </div>
      </div>
    </main>
  </div>
</div>

<script>
  // Script for Quest 5 Step 4 Checklist
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const q5s4Page = document.getElementById('page-task-quest5-step4');
      if (!q5s4Page) return;
      
      const stepItems = q5s4Page.querySelectorAll('.q5s4-step');
      const progressNum = q5s4Page.querySelector('#q5s4-progress-num');
      const nextBtn = document.getElementById('td-btn-next-quest5-step4');
      
      stepItems.forEach((item) => {
        item.addEventListener('click', () => {
          item.classList.toggle('done');
          
          const doneCount = q5s4Page.querySelectorAll('.q5s4-step.done').length;
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
              alert("自行預約手續完成！任務大成功！");
              showPage(document.getElementById('page-home'));
           }
         });
      }
    }, 1000);
  });
</script>
`;

// Insert before the closing body tag
content = content.replace('</body>', step4HTML + '\n</body>');

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully added Step 4 and updated Step 2 card.");
