const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const loadingScreenHTML = `
<!-- Fullscreen Loading Overlay -->
<div id="ncku-loading-screen" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; flex-direction: column;">
  <!-- Background with sunset filter -->
  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('ncku_campus.png'); background-size: cover; background-position: center; filter: sepia(0.6) hue-rotate(-20deg) brightness(0.6) contrast(1.2); z-index: -1;"></div>
  
  <!-- Top Bar -->
  <div style="height: 60px; background: #6E1414; display: flex; align-items: center; padding: 0 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
    <div style="display: flex; align-items: center; gap: 12px;">
       <div style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fbbf24; display: flex; align-items: center; justify-content: center;">
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
       </div>
       <div>
         <div style="color: white; font-weight: 800; font-size: 16px; letter-spacing: 1px;">頁面轉換中</div>
         <div style="color: #fbbf24; font-size: 11px;">正在前往下一個關卡頁面，請稍候...</div>
       </div>
    </div>
  </div>

  <!-- Center Content -->
  <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
     <div style="width: 800px; background: rgba(50, 30, 20, 0.65); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 40px; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.5);">
        
        <!-- Top Tab -->
        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 60px; height: 30px; background: rgba(50, 30, 20, 0.8); border: 1px solid rgba(255,255,255,0.15); border-bottom: none; border-radius: 30px 30px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <img src="ncku_emblem.png" style="width: 16px; height: 16px;">
          <div style="font-size: 8px; color: #fbbf24; margin-top: 2px;">1901</div>
        </div>

        <!-- Ad Banner -->
        <div style="background: linear-gradient(135deg, #FFFDF8, #F3E5D8); border-radius: 12px; display: flex; overflow: hidden; margin-bottom: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
           <!-- Image Area (Simulated) -->
           <div style="width: 35%; background: #dcd0c0; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;">
              <div style="width: 100%; height: 100%; background: url('ncku_campus.png') center/cover; filter: brightness(0.8) blur(2px);"></div>
              <div style="position: absolute; top: 10px; left: 10px; background: #6E1414; color: white; padding: 4px 8px; font-size: 11px; font-weight: bold; writing-mode: vertical-rl; letter-spacing: 2px;">學生會<br>特別推薦</div>
              <div style="position: absolute; background: #6E1414; padding: 15px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                 <img src="ncku_emblem.png" style="width: 40px; filter: brightness(0) invert(1);">
              </div>
           </div>
           
           <!-- Middle Info -->
           <div style="flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
              <div style="display: flex; align-items: center; gap: 8px; color: #8B5A2B; font-size: 12px; font-weight: bold; margin-bottom: 8px;">
                 <span>《</span><span style="color: #fbbf24; font-size: 16px;">♛</span><span>專為新生準備的入住好夥伴</span><span>》</span>
              </div>
              <h3 style="margin: 0 0 20px 0; font-size: 32px; color: #3E2723; font-weight: 900; letter-spacing: 2px;">新生入住組合</h3>
              <div style="display: flex; gap: 30px;">
                 <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #8B5A2B; display: flex; align-items: center; justify-content: center; color: #8B5A2B;">🛏️</div>
                    <span style="font-size: 11px; color: #5D4037; font-weight: bold;">舒適床墊</span>
                 </div>
                 <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #8B5A2B; display: flex; align-items: center; justify-content: center; color: #8B5A2B;">📦</div>
                    <span style="font-size: 11px; color: #5D4037; font-weight: bold;">收納好物</span>
                 </div>
                 <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #8B5A2B; display: flex; align-items: center; justify-content: center; color: #8B5A2B;">🛍️</div>
                    <span style="font-size: 11px; color: #5D4037; font-weight: bold;">入學必備</span>
                 </div>
              </div>
           </div>

           <!-- Right Discount -->
           <div style="width: 25%; background: #6E1414; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; text-align: center; position: relative;">
              <div style="color: #fbbf24; font-size: 14px; margin-bottom: 8px;">♛</div>
              <div style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">新生專屬優惠</div>
              <div style="font-size: 42px; font-weight: 900; margin-bottom: 8px; line-height: 1;">8<span style="font-size: 20px;">折起</span></div>
              <div style="font-size: 10px; color: #fbbf24; margin-bottom: 16px;">限時組合優惠中！</div>
              <button style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; cursor: pointer;">查看優惠 &gt;</button>
           </div>
        </div>

        <!-- Progress Area -->
        <div style="text-align: center; color: #E5E5E5; margin-bottom: 12px; letter-spacing: 4px; font-size: 14px; font-weight: bold;">✦ LOADING...</div>
        <div style="display: flex; align-items: center; gap: 16px;">
           <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; position: relative;">
             <div id="loading-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(to right, #fbbf24, #f59e0b); border-radius: 3px; transition: width 0.1s linear;"></div>
           </div>
           <div id="loading-progress-text" style="color: #fbbf24; font-weight: bold; font-size: 18px; width: 45px; text-align: right;">0%</div>
        </div>
     </div>
  </div>

  <div style="position: absolute; bottom: 40px; width: 100%; text-align: center; color: #fbbf24; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
    載入期間可先查看學生會推薦優惠
  </div>
</div>

<script>
  function transitionWithLoading(targetPageElement) {
    const loadingScreen = document.getElementById('ncku-loading-screen');
    if(!loadingScreen) {
        showPage(targetPageElement);
        return;
    }
    const progressBar = document.getElementById('loading-progress-bar');
    const progressText = document.getElementById('loading-progress-text');
    
    // Reset
    progressBar.style.width = '0%';
    progressText.innerText = '0%';
    loadingScreen.style.display = 'flex';
    
    let progress = 0;
    const duration = 2700; // 2.7 seconds
    const interval = 30; // update every 30ms
    const steps = duration / interval;
    const increment = 100 / steps;
    
    const timer = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          showPage(targetPageElement);
        }, 200); // short delay after reaching 100%
      }
      progressBar.style.width = progress + '%';
      progressText.innerText = Math.floor(progress) + '%';
    }, interval);
  }
</script>
`;

if (!content.includes('id="ncku-loading-screen"')) {
    content += '\n' + loadingScreenHTML;
}

// Update the onclick handlers in Step 2 to use transitionWithLoading
// Only replace the ones inside page-task-quest5-step2
const step2Start = content.indexOf(`id="page-task-quest5-step2"`);
if (step2Start !== -1) {
    const step2End = content.indexOf(`id="page-task-quest5-step3"`, step2Start);
    let step2Section = content.substring(step2Start, step2End !== -1 ? step2End : undefined);
    
    // Replace showPage(document.getElementById('page-task-quest5-step3'))
    step2Section = step2Section.replace(
        /onclick="showPage\(document\.getElementById\('page-task-quest5-step3'\)\)"/g, 
        `onclick="transitionWithLoading(document.getElementById('page-task-quest5-step3'))"`
    );
    
    // Replace showPage(document.getElementById('page-task-quest5-step4'))
    step2Section = step2Section.replace(
        /onclick="showPage\(document\.getElementById\('page-task-quest5-step4'\)\)"/g, 
        `onclick="transitionWithLoading(document.getElementById('page-task-quest5-step4'))"`
    );
    
    if (step2End !== -1) {
        content = content.substring(0, step2Start) + step2Section + content.substring(step2End);
    } else {
        content = content.substring(0, step2Start) + step2Section;
    }
}

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully added the loading screen and updated transition links.");
