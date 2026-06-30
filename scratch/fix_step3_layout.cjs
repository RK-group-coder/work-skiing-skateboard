const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const startIndex = content.indexOf('<!-- Quest 5 Step 3 Page -->');
if (startIndex === -1) {
    console.log("Could not find step 3 page");
    process.exit(1);
}

const newStep3 = `<!-- Quest 5 Step 3 Page -->
<div class="page" id="page-task-quest5-step3" style="display: none; background: #FCF8F5; min-height: 100vh; font-family: 'Noto Sans TC', sans-serif;">
  
  <!-- Top Navigation (Inline Styled) -->
  <header style="display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; background: #6E1414; color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="display: flex; align-items: center; gap: 20px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="icon_health_check.png" alt="NCKU" style="width: 40px; height: 40px; filter: brightness(0) invert(1);">
        <span style="font-weight: 700; font-size: 20px;">成大新手教學系統</span>
      </div>
      <div style="width: 1px; height: 24px; background: rgba(255,255,255,0.3);"></div>
      <div style="color: rgba(255,255,255,0.8); font-size: 14px;">
        <span>首頁</span> <span style="margin: 0 4px;">/</span> <span>任務地圖</span> <span style="margin: 0 4px;">/</span> <span>健康檢查</span> <span style="margin: 0 4px;">/</span> <span style="color: white; font-weight: bold;">預約掛號</span>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 20px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #ccc;"></div>
        <span style="font-weight: bold; font-size: 14px;">新生同學</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 20px; font-size: 12px;">
        <span style="background: white; color: #6E1414; padding: 2px 6px; border-radius: 10px; font-weight: bold;">LV.1</span>
        <span>新手村居民</span>
        <div style="width: 60px; height: 6px; background: rgba(255,255,255,0.3); border-radius: 3px; overflow: hidden;">
           <div style="width: 40%; height: 100%; background: white;"></div>
        </div>
        <span>120 / 300 XP 🏆</span>
      </div>
    </div>
  </header>

  <div style="display: flex; max-width: 1300px; margin: 40px auto; gap: 32px; padding: 0 20px; align-items: stretch;">
    <!-- Left Sidebar -->
    <aside style="background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); padding: 32px; width: 340px; display: flex; flex-direction: column; flex-shrink: 0;">
      <div style="border-bottom: 2px dashed #eee; padding-bottom: 24px; margin-bottom: 24px;">
        <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
          <div style="width: 60px; height: 60px;"><img src="icon_health_check_correct.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: contain;"></div>
          <div>
            <h2 style="margin: 0; font-size: 24px; color: #1a1a1a;">成大醫院掛號</h2>
            <div style="color: #666; font-size: 14px; margin-top: 4px;">依序完成以下步驟</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <span id="q5s3-progress-num" style="font-size: 32px; font-weight: 800; color: #fbbf24;">0</span> 
            <span style="color: #999; font-size: 16px;">/ 5</span><br>
            <span style="color: #666; font-size: 14px;">已完成</span>
          </div>
        </div>
      </div>

      <div id="q5s3-steps" style="display: flex; flex-direction: column; gap: 0;">
        <!-- Steps Template -->
        <style>
          .q5s3-step { display: flex; gap: 16px; position: relative; cursor: pointer; padding: 12px 0; }
          .q5s3-step:hover .td-step-title { color: #fbbf24; }
          .q5s3-step-left { display: flex; flex-direction: column; align-items: center; width: 24px; position: relative; }
          .q5s3-step-check { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #cbd5e1; background: white; z-index: 2; transition: all 0.3s; }
          .q5s3-step-line { width: 2px; height: calc(100% + 24px); background: dashed 2px #e2e8f0; position: absolute; top: 24px; z-index: 1; }
          .q5s3-step-marker { width: 24px; height: 24px; border-radius: 50%; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #94a3b8; font-weight: bold; }
          .q5s3-step-title { font-weight: 700; color: #334155; font-size: 16px; transition: color 0.2s; }
          
          /* Done State */
          .q5s3-step.done .q5s3-step-check { background: #fbbf24; border-color: #fbbf24; }
          .q5s3-step.done .q5s3-step-line { background: solid 2px #fbbf24; }
        </style>

        <div class="q5s3-step">
          <div class="q5s3-step-left"><div class="q5s3-step-check"></div><div class="q5s3-step-line"></div></div>
          <div class="q5s3-step-marker">1</div>
          <div class="td-step-content"><div class="q5s3-step-title">點選「掛號(依科別)」</div></div>
        </div>
        <div class="q5s3-step">
          <div class="q5s3-step-left"><div class="q5s3-step-check"></div><div class="q5s3-step-line"></div></div>
          <div class="q5s3-step-marker">2</div>
          <div class="td-step-content"><div class="q5s3-step-title">選擇「成功大學入學新生體檢診」</div></div>
        </div>
        <div class="q5s3-step">
          <div class="q5s3-step-left"><div class="q5s3-step-check"></div><div class="q5s3-step-line"></div></div>
          <div class="q5s3-step-marker">3</div>
          <div class="td-step-content"><div class="q5s3-step-title">登入系統</div></div>
        </div>
        <div class="q5s3-step">
          <div class="q5s3-step-left"><div class="q5s3-step-check"></div><div class="q5s3-step-line"></div></div>
          <div class="q5s3-step-marker">4</div>
          <div class="td-step-content"><div class="q5s3-step-title">完成掛號</div></div>
        </div>
        <div class="q5s3-step">
          <div class="q5s3-step-left"><div class="q5s3-step-check"></div></div> <!-- No line for last -->
          <div class="q5s3-step-marker">5</div>
          <div class="td-step-content"><div class="q5s3-step-title">列印健檢同意書</div></div>
        </div>
      </div>

      <div style="margin-top: auto; padding-top: 32px;">
        <button id="td-btn-next-quest5-step3" class="disabled" style="width: 100%; background: #fbbf24; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: not-allowed; transition: 0.3s; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3); opacity: 0.5;">
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
          https://tandem.hosp.ncku.edu.tw/Tandem/Login/Schedule
        </div>
      </div>
      
      <!-- Mock Browser Content -->
      <div style="flex: 1; padding: 40px; background: #fff; display: flex; flex-direction: column;">
          
          <!-- Tandem Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0056b3; padding-bottom: 12px; margin-bottom: 15px; flex-shrink: 0;">
             <div style="display: flex; align-items: center; gap: 15px;">
               <img src="ncku_emblem.png" style="width: 50px; height: 50px;">
               <div style="display: flex; flex-direction: column;">
                 <h3 style="margin: 0; color: #0056b3; font-size: 24px; font-weight: bold; letter-spacing: 1px; white-space: nowrap;">國立成功大學醫學院附設醫院</h3>
                 <div style="color: #666; font-size: 12px; margin-top: 4px;">National Cheng Kung University Hospital</div>
               </div>
             </div>
             <div style="color: #0056b3; font-size: 12px; white-space: nowrap;">
               English | 回首頁 | 預約掛號 | 健康存摺 | 服務信箱
             </div>
          </div>
          
          <!-- Tandem Nav -->
          <div style="background: #006699; color: white; padding: 12px 20px; font-size: 14px; display: flex; gap: 20px; font-weight: bold; flex-shrink: 0; white-space: nowrap; overflow-x: auto;">
             <span style="cursor: pointer;">掛號 [依科別]</span>
             <span style="cursor: pointer;">掛號 [依醫師]</span>
             <span style="cursor: pointer;">整合門診</span>
             <span style="cursor: pointer;">取消預約掛號</span>
             <span style="cursor: pointer;">預約掛號查詢</span>
             <span style="cursor: pointer;">看診進度</span>
             <span style="cursor: pointer;">預約領藥、代(停)診查詢</span>
             <span style="cursor: pointer;">就醫須知</span>
          </div>
          
          <!-- Tandem Body -->
          <div style="display: flex; margin-top: 40px; gap: 40px; align-items: flex-start;">
             
             <!-- Left Images & QR -->
             <div style="width: 200px; text-align: center; flex-shrink: 0;">
               <div style="width: 160px; height: 160px; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); margin: 0 auto; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 2px 10px rgba(255,255,255,0.5), 0 4px 10px rgba(0,0,0,0.1);">
                 <span style="font-size: 80px;">🖥️</span>
               </div>
               <div style="color: #666; font-size: 14px; margin-top: 15px; font-weight: bold;">成大 e 療通</div>
               
               <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                 <div>
                   <div style="width: 70px; height: 70px; background: white; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 32px;">📱</div>
                   <div style="font-size: 12px; color: #555; margin-top: 5px;">Android</div>
                 </div>
                 <div>
                   <div style="width: 70px; height: 70px; background: white; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 32px;">🍏</div>
                   <div style="font-size: 12px; color: #555; margin-top: 5px;">iOS</div>
                 </div>
               </div>
             </div>
             
             <!-- Right Form -->
             <div style="flex: 1; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
               <h4 style="color: #0056b3; margin-top: 0; border-bottom: 2px solid #bae6fd; padding-bottom: 12px; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                 <span style="background: #0056b3; color: white; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border-radius: 50%;">!</span>
                 使用者確認
               </h4>
               
               <p style="font-weight: bold; margin-bottom: 30px; color: #333; font-size: 16px;">為確認您的身分，請輸入以下資訊：</p>
               
               <div style="margin-bottom: 25px; padding-left: 10px;">
                 <label style="display: block; font-size: 14px; margin-bottom: 8px; color: #555; font-weight: bold;">帳號 <span style="font-weight: normal;">(身分證號或居留證號)</span></label>
                 <input type="text" style="width: 100%; max-width: 300px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); outline: none; font-size: 16px;">
               </div>
               
               <div style="margin-bottom: 35px; padding-left: 10px;">
                 <label style="display: block; font-size: 14px; margin-bottom: 8px; color: #555; font-weight: bold;">姓名</label>
                 <input type="text" style="width: 100%; max-width: 300px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); outline: none; font-size: 16px;">
               </div>
               
               <div style="padding-left: 10px;">
                 <button style="background: #006699; color: white; border: none; padding: 12px 40px; border-radius: 6px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,102,153,0.3); transition: background 0.2s, transform 0.1s; font-size: 16px;" onmouseover="this.style.background='#004d73'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#006699'; this.style.transform='translateY(0)'" onclick="this.style.transform='translateY(1px)'">
                   送出
                 </button>
               </div>
             </div>
             
          </div>
      </div>
    </main>
  </div>
</div>

<script>
  // Script for Quest 5 Step 3 Checklist
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const q5s3Page = document.getElementById('page-task-quest5-step3');
      if (!q5s3Page) return;
      
      const stepItems = q5s3Page.querySelectorAll('.q5s3-step');
      const progressNum = q5s3Page.querySelector('#q5s3-progress-num');
      const nextBtn = document.getElementById('td-btn-next-quest5-step3');
      
      stepItems.forEach((item) => {
        item.addEventListener('click', () => {
          item.classList.toggle('done');
          
          const doneCount = q5s3Page.querySelectorAll('.q5s3-step.done').length;
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
              alert("恭喜完成掛號！任務大成功！");
              showPage(document.getElementById('page-home'));
           }
         });
      }
    }, 1000);
  });
</script>
`;

content = content.substring(0, startIndex) + newStep3;

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully rebuilt Step 3 with proper inline styling.");
