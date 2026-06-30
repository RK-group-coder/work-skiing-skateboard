const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const step5ModalHTML = `
<!-- Quest 5 Step 5 Reminder Modal -->
<div id="quest5-step5-reminder-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(8px); opacity: 0; transition: opacity 0.3s ease;">
  <div style="background: linear-gradient(rgba(255, 253, 248, 0.9), rgba(255, 253, 248, 0.9)), url('ncku_emblem.png') no-repeat center center / 60% white; border: 6px solid #6E1414; border-radius: 32px; padding: 60px 50px; max-width: 650px; width: 90%; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.15); position: relative; transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);" id="quest5-step5-reminder-modal-content">
     
     <h2 style="font-size: 32px; font-weight: 800; color: #1e293b; margin-bottom: 40px; letter-spacing: 1px;">溫馨提醒：結束健檢後記得....</h2>
     
     <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 40px; text-align: left; padding: 0 20px;">
       
       <div style="display: flex; align-items: center; justify-content: space-between; background: #6E1414; padding: 20px 30px; border-radius: 20px; transition: all 0.2s; border: 2px solid transparent; box-shadow: 0 10px 20px rgba(110,20,20,0.2);" onmouseover="this.style.transform='scale(1.02)'; this.style.borderColor='#fbbf24';" onmouseout="this.style.transform='scale(1)'; this.style.borderColor='transparent';">
         <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
           <div style="width: 30px; height: 30px; border-radius: 50%; background: #fbbf24; box-shadow: 0 4px 12px rgba(251,191,36,0.5); flex-shrink: 0;"></div>
           <span style="font-size: 20px; font-weight: 700; color: #FFFDF8; line-height: 1.5;">將健康檢查紀錄表、健康檢查同意書<br>繳交到衛保組(郵寄掛號、親送擇一)</span>
         </div>
         <button onclick="this.innerText='已加入 ✓'; this.style.background='#22c55e'; this.style.color='white'; this.style.boxShadow='0 4px 12px rgba(34,197,94,0.3)';" style="background: #cbd5e1; border: none; padding: 10px 24px; border-radius: 30px; font-size: 16px; font-weight: 800; color: #475569; cursor: pointer; transition: all 0.3s; flex-shrink: 0; margin-left: 20px;">加入待辦</button>
       </div>

     </div>

     <p style="color: #64748b; font-size: 18px; font-weight: 500; margin-bottom: 40px;">看完記得按加入待辦喔！</p>

     <button onclick="closeStep5ReminderModalAndGoHome()" style="background: linear-gradient(to right, #f59e0b, #fbbf24); color: white; border: none; padding: 18px 80px; border-radius: 40px; font-size: 22px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 25px rgba(245,158,11,0.4); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(245,158,11,0.5)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 25px rgba(245,158,11,0.4)';">下一步</button>
     
  </div>
</div>

<script>
  function showStep5ReminderModal() {
    const modal = document.getElementById('quest5-step5-reminder-modal');
    const content = document.getElementById('quest5-step5-reminder-modal-content');
    modal.style.display = 'flex';
    void modal.offsetWidth;
    modal.style.opacity = '1';
    content.style.transform = 'translateY(0)';
  }

  function closeStep5ReminderModalAndGoHome() {
    const modal = document.getElementById('quest5-step5-reminder-modal');
    const content = document.getElementById('quest5-step5-reminder-modal-content');
    modal.style.opacity = '0';
    content.style.transform = 'translateY(20px)';
    setTimeout(() => {
      modal.style.display = 'none';
      showPage(document.getElementById('page-home'));
    }, 300);
  }
</script>
`;

if (!content.includes('id="quest5-step5-reminder-modal"')) {
    content += '\n' + step5ModalHTML;
}

// Now replace the script inside Step 5 to call showStep5ReminderModal() instead of showReminderModal()
// The Step 5 script is identified by: const q5s5Page = document.getElementById('page-task-quest5-step5');
const step5ScriptStart = content.indexOf(`const q5s5Page = document.getElementById('page-task-quest5-step5');`);
if (step5ScriptStart !== -1) {
    const nextBtnListenerStart = content.indexOf(`nextBtn.addEventListener('click',`, step5ScriptStart);
    if (nextBtnListenerStart !== -1) {
        const replaceOld = `showReminderModal();`;
        const replaceNew = `showStep5ReminderModal();`;
        const targetIndex = content.indexOf(replaceOld, nextBtnListenerStart);
        if (targetIndex !== -1 && targetIndex < nextBtnListenerStart + 300) {
            content = content.substring(0, targetIndex) + replaceNew + content.substring(targetIndex + replaceOld.length);
        }
    }
}

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully added Step 5 Modal and updated transition logic.");
