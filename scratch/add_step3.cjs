const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add onclick to the NCKU Hospital card
const nckuCardSearch = `<div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" 
             onmouseover="document.getElementById('ncku-card-inner').style.transform='translateY(-10px) scale(1.02)'; document.getElementById('dynamic-bg-left').style.opacity='1'; document.getElementById('page-task-quest5-step2').classList.add('has-dynamic-bg');" 
             onmouseout="document.getElementById('ncku-card-inner').style.transform='translateY(0) scale(1)'; document.getElementById('dynamic-bg-left').style.opacity='0'; document.getElementById('page-task-quest5-step2').classList.remove('has-dynamic-bg');">`;

const nckuCardReplace = `<div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" 
             onclick="showPage(document.getElementById('page-task-quest5-step3'))"
             onmouseover="document.getElementById('ncku-card-inner').style.transform='translateY(-10px) scale(1.02)'; document.getElementById('dynamic-bg-left').style.opacity='1'; document.getElementById('page-task-quest5-step2').classList.add('has-dynamic-bg');" 
             onmouseout="document.getElementById('ncku-card-inner').style.transform='translateY(0) scale(1)'; document.getElementById('dynamic-bg-left').style.opacity='0'; document.getElementById('page-task-quest5-step2').classList.remove('has-dynamic-bg');">`;

content = content.replace(nckuCardSearch, nckuCardReplace);

// 2. The HTML for Step 3
const step3HTML = `
<!-- Quest 5 Step 3 Page -->
<div class="page" id="page-task-quest5-step3" style="display: none; background: #FCF8F5; min-height: 100vh;">
  <!-- Top Navigation -->
  <header class="top-nav">
    <div class="nav-left">
      <img src="icon_health_check.png" alt="NCKU" class="nav-logo" style="width: 48px; height: 48px; filter: brightness(0) invert(1);">
      <span class="nav-title" style="color: white; font-weight: 700; font-size: 20px;">成大新手教學系統</span>
      <div class="nav-divider"></div>
      <div class="nav-breadcrumbs" style="color: rgba(255,255,255,0.8);">
        <span>首頁</span> / <span>任務地圖</span> / <span>健康檢查</span> / <span style="color: white; font-weight: bold;">預約掛號</span>
      </div>
    </div>
    <div class="nav-right">
      <div class="user-profile">
        <div class="user-avatar"></div>
        <span class="user-name" style="color: white;">新生同學</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      <div class="user-level" style="background: rgba(255,255,255,0.2); color: white;">
        <span class="level-badge" style="background: white; color: #8B1A1A;">LV.1</span> 新手村居民
        <div class="level-bar-bg"><div class="level-bar-fill" style="width: 40%; background: white;"></div></div>
        <span class="level-text">120 / 300 XP 🏆</span>
      </div>
      <button class="nav-icon-btn" style="color: white;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></button>
      <button class="nav-icon-btn" style="color: white;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
    </div>
  </header>
  <style>
    #page-task-quest5-step3 .top-nav {
      background: #8B1A1A; /* Match NCKU red */
    }
  </style>

  <div style="display: flex; max-width: 1400px; margin: 40px auto; gap: 32px; padding: 0 40px;">
    <!-- Left Sidebar -->
    <aside class="td-sidebar" style="background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); padding: 32px; width: 340px; display: flex; flex-direction: column;">
      <div class="td-sidebar-header" style="border-bottom: 2px dashed #eee; padding-bottom: 24px; margin-bottom: 24px;">
        <div class="td-sb-header-top" style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
          <div class="td-sb-icon" style="background: transparent; width: 60px; height: 60px;"><img src="icon_health_check_correct.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: contain;"></div>
          <div>
            <h2 class="td-sb-title" style="margin: 0; font-size: 24px; color: #1a1a1a;">成大醫院掛號</h2>
            <div class="td-sb-subtitle" style="color: #666; font-size: 14px; margin-top: 4px;">依序完成以下步驟</div>
          </div>
        </div>
        <div class="td-sb-progress" style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <span class="td-sb-progress-num" id="q5s3-progress-num" style="font-size: 32px; font-weight: 800; color: #d97706;">0</span> 
            <span class="td-sb-progress-total" style="color: #999; font-size: 16px;">/ 5</span><br>
            <span class="td-sb-progress-text" style="color: #666; font-size: 14px;">已完成</span>
          </div>
        </div>
      </div>

      <div class="td-steps" id="q5s3-steps">
        <!-- Step 1 -->
        <div class="td-step-item q5s3-step">
          <div class="td-step-left">
            <div class="td-step-check"><span class="td-check-icon"></span></div>
            <div class="td-step-line"></div>
          </div>
          <div class="td-step-marker">1</div>
          <div class="td-step-content">
            <div class="td-step-title">點選「掛號(依科別)」</div>
          </div>
        </div>
        <!-- Step 2 -->
        <div class="td-step-item q5s3-step">
          <div class="td-step-left">
            <div class="td-step-check"><span class="td-check-icon"></span></div>
            <div class="td-step-line"></div>
          </div>
          <div class="td-step-marker">2</div>
          <div class="td-step-content">
            <div class="td-step-title">選擇「成功大學入學新生體檢診」</div>
          </div>
        </div>
        <!-- Step 3 -->
        <div class="td-step-item q5s3-step">
          <div class="td-step-left">
            <div class="td-step-check"><span class="td-check-icon"></span></div>
            <div class="td-step-line"></div>
          </div>
          <div class="td-step-marker">3</div>
          <div class="td-step-content">
            <div class="td-step-title">登入系統</div>
          </div>
        </div>
        <!-- Step 4 -->
        <div class="td-step-item q5s3-step">
          <div class="td-step-left">
            <div class="td-step-check"><span class="td-check-icon"></span></div>
            <div class="td-step-line"></div>
          </div>
          <div class="td-step-marker">4</div>
          <div class="td-step-content">
            <div class="td-step-title">完成掛號</div>
          </div>
        </div>
        <!-- Step 5 -->
        <div class="td-step-item q5s3-step">
          <div class="td-step-left">
            <div class="td-step-check"><span class="td-check-icon"></span></div>
            <div class="td-step-line" style="display:none;"></div>
          </div>
          <div class="td-step-marker">5</div>
          <div class="td-step-content">
            <div class="td-step-title">列印健檢同意書</div>
          </div>
        </div>
      </div>

      <div class="td-sidebar-footer" style="margin-top: auto; padding-top: 32px;">
        <button class="td-btn-next disabled" id="td-btn-next-quest5-step3" style="width: 100%; background: #fbbf24; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer; transition: 0.3s; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);">
          下一步
        </button>
        <button class="td-btn-outline" onclick="showPage(document.getElementById('page-task-quest5-step2'))" style="width: 100%; background: white; color: #666; border: 2px solid #eee; padding: 14px; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s;">
          返回上一步
        </button>
      </div>
    </aside>

    <!-- Right Browser Area -->
    <main class="td-main" style="flex: 1; min-width: 0;">
      <div class="td-browser" style="background: white; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; height: 100%;">
        <div class="td-browser-header" style="background: #f1f5f9; padding: 16px 20px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e2e8f0;">
          <div class="td-browser-dots" style="display: flex; gap: 8px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #eab308;"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #22c55e;"></div>
          </div>
          <div class="td-browser-nav" style="display: flex; gap: 12px; color: #94a3b8;">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.6-6.3L2 8"/></svg>
          </div>
          <div class="td-browser-url" style="flex: 1; background: white; border-radius: 20px; padding: 8px 16px; font-size: 14px; color: #475569; display: flex; align-items: center; gap: 8px; border: 1px solid #e2e8f0;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            https://tandem.hosp.ncku.edu.tw/Tandem/Login/Schedule
          </div>
        </div>
        
        <!-- Mock Browser Content -->
        <div class="td-browser-content" style="flex: 1; padding: 30px 40px; text-align: left; background: #fff;">
            
            <!-- Tandem Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0056b3; padding-bottom: 12px; margin-bottom: 10px;">
               <div style="display: flex; align-items: center; gap: 15px;">
                 <img src="ncku_emblem.png" style="width: 40px; height: 40px;">
                 <div>
                   <h3 style="margin: 0; color: #0056b3; font-size: 22px; font-weight: bold; letter-spacing: 1px;">國立成功大學醫學院附設醫院</h3>
                   <div style="color: #666; font-size: 12px; margin-top: 2px;">National Cheng Kung University Hospital</div>
                 </div>
               </div>
               <div style="color: #0056b3; font-size: 12px;">
                 English | 回首頁 | 預約掛號 | 健康存摺 | 服務信箱
               </div>
            </div>
            
            <!-- Tandem Nav -->
            <div style="background: #006699; color: white; padding: 10px 20px; font-size: 14px; display: flex; gap: 25px; font-weight: bold;">
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
            <div style="display: flex; margin-top: 40px; gap: 60px; padding: 0 20px;">
               
               <!-- Left Images & QR -->
               <div style="width: 220px; text-align: center;">
                 <div style="width: 180px; height: 160px; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); margin: 0 auto; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 2px 10px rgba(255,255,255,0.5), 0 4px 10px rgba(0,0,0,0.1);">
                   <span style="font-size: 80px;">🖥️</span>
                 </div>
                 <div style="color: #666; font-size: 14px; margin-top: 15px;">成大 e 療通</div>
                 
                 <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                   <div>
                     <div style="width: 90px; height: 90px; background: white; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                       📱
                     </div>
                     <div style="font-size: 12px; color: #555; margin-top: 5px;">Android</div>
                   </div>
                   <div>
                     <div style="width: 90px; height: 90px; background: white; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                       🍏
                     </div>
                     <div style="font-size: 12px; color: #555; margin-top: 5px;">iOS</div>
                   </div>
                 </div>
               </div>
               
               <!-- Right Form -->
               <div style="flex: 1; padding-top: 20px;">
                 <h4 style="color: #0056b3; margin-top: 0; border-bottom: 1px dotted #ccc; padding-bottom: 10px; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                   <span style="background: #0056b3; color: white; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border-radius: 2px;">!</span>
                   使用者確認
                 </h4>
                 
                 <p style="font-weight: bold; margin-bottom: 30px; color: #333;">為確認您的身分，請輸入以下資訊：</p>
                 
                 <div style="margin-bottom: 20px; padding-left: 20px;">
                   <label style="display: block; font-size: 14px; margin-bottom: 8px; color: #555;">帳號 (身分證號或居留證號)</label>
                   <input type="text" style="width: 280px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); outline: none;">
                 </div>
                 
                 <div style="margin-bottom: 30px; padding-left: 20px;">
                   <label style="display: block; font-size: 14px; margin-bottom: 8px; color: #555;">姓名</label>
                   <input type="text" style="width: 280px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); outline: none;">
                 </div>
                 
                 <div style="padding-left: 20px;">
                   <button style="background: #006699; color: white; border: none; padding: 10px 30px; border-radius: 4px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,102,153,0.3); transition: background 0.2s;" onmouseover="this.style.background='#004d73'" onmouseout="this.style.background='#006699'">
                     送出
                   </button>
                 </div>
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
      
      stepItems.forEach((item, index) => {
        item.addEventListener('click', () => {
          const isDone = item.classList.toggle('done');
          
          // Update progress
          const doneCount = q5s3Page.querySelectorAll('.q5s3-step.done').length;
          progressNum.innerText = doneCount;
          
          // Custom styles for done state to match the wireframe orange circles
          const checkIconContainer = item.querySelector('.td-step-check');
          if(isDone) {
             checkIconContainer.style.background = '#fbbf24'; // yellow/orange
             checkIconContainer.style.borderColor = '#fbbf24';
          } else {
             checkIconContainer.style.background = 'white';
             checkIconContainer.style.borderColor = '#cbd5e1';
          }
          
          // Enable/Disable next button
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
              // Action when completely finished. E.g., go to success page or back to home.
              alert("恭喜完成掛號！即將返回任務地圖...");
              showPage(document.getElementById('page-home'));
           }
         });
      }
    }, 1000);
  });
</script>
`;

content = content.replace('</body>', step3HTML + '\n</body>');

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully created Step 3 and linked it from the card.");
