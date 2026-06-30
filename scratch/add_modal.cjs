const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Create the Modal HTML
const modalHTML = `
<!-- Quest 5 Reminder Modal -->
<div id="quest5-reminder-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(8px); opacity: 0; transition: opacity 0.3s ease;">
  <div style="background: white; border-radius: 32px; padding: 60px 50px; max-width: 650px; width: 90%; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.15); position: relative; transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);" id="quest5-reminder-modal-content">
     
     <!-- Blue Badge -->
     <div style="position: absolute; top: -25px; left: -25px; background: #0056b3; color: white; width: 90px; height: 90px; border-radius: 24px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; border: 6px solid #fff; box-shadow: 0 10px 20px rgba(0,86,179,0.2); transform: rotate(-5deg);">
       標示用
     </div>

     <h2 style="font-size: 32px; font-weight: 800; color: #1e293b; margin-bottom: 40px; letter-spacing: 1px;">溫馨提醒：結束健檢後記得....</h2>
     
     <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 40px; text-align: left; padding: 0 20px;">
       
       <div style="display: flex; align-items: center; justify-content: space-between; background: #f1f5f9; padding: 20px 30px; border-radius: 20px; transition: all 0.2s; border: 2px solid transparent;" onmouseover="this.style.transform='scale(1.02)'; this.style.borderColor='#fbbf24'; this.style.boxShadow='0 10px 25px rgba(251,191,36,0.1)';" onmouseout="this.style.transform='scale(1)'; this.style.borderColor='transparent'; this.style.boxShadow='none';">
         <div style="display: flex; align-items: center; gap: 20px;">
           <div style="width: 30px; height: 30px; border-radius: 50%; background: #fbbf24; box-shadow: 0 4px 12px rgba(251,191,36,0.5);"></div>
           <span style="font-size: 22px; font-weight: 700; color: #334155;">繳費收據寫學號</span>
         </div>
         <button onclick="this.innerText='已加入 ✓'; this.style.background='#22c55e'; this.style.color='white'; this.style.boxShadow='0 4px 12px rgba(34,197,94,0.3)';" style="background: #cbd5e1; border: none; padding: 10px 24px; border-radius: 30px; font-size: 16px; font-weight: 800; color: #475569; cursor: pointer; transition: all 0.3s;">加入待辦</button>
       </div>

       <div style="display: flex; align-items: center; justify-content: space-between; background: #f1f5f9; padding: 20px 30px; border-radius: 20px; transition: all 0.2s; border: 2px solid transparent;" onmouseover="this.style.transform='scale(1.02)'; this.style.borderColor='#fbbf24'; this.style.boxShadow='0 10px 25px rgba(251,191,36,0.1)';" onmouseout="this.style.transform='scale(1)'; this.style.borderColor='transparent'; this.style.boxShadow='none';">
         <div style="display: flex; align-items: center; gap: 20px;">
           <div style="width: 30px; height: 30px; border-radius: 50%; background: #fbbf24; box-shadow: 0 4px 12px rgba(251,191,36,0.5);"></div>
           <span style="font-size: 22px; font-weight: 700; color: #334155;">至衛生保健組繳交收據</span>
         </div>
         <button onclick="this.innerText='已加入 ✓'; this.style.background='#22c55e'; this.style.color='white'; this.style.boxShadow='0 4px 12px rgba(34,197,94,0.3)';" style="background: #cbd5e1; border: none; padding: 10px 24px; border-radius: 30px; font-size: 16px; font-weight: 800; color: #475569; cursor: pointer; transition: all 0.3s;">加入待辦</button>
       </div>

     </div>

     <p style="color: #64748b; font-size: 18px; font-weight: 500; margin-bottom: 40px;">看完記得按加入待辦喔！</p>

     <button onclick="closeReminderModalAndGoHome()" style="background: linear-gradient(to right, #f59e0b, #fbbf24); color: white; border: none; padding: 18px 80px; border-radius: 40px; font-size: 22px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 25px rgba(245,158,11,0.4); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(245,158,11,0.5)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 25px rgba(245,158,11,0.4)';">下一步</button>
     
  </div>
</div>

<script>
  function showReminderModal() {
    const modal = document.getElementById('quest5-reminder-modal');
    const content = document.getElementById('quest5-reminder-modal-content');
    modal.style.display = 'flex';
    // Trigger reflow
    void modal.offsetWidth;
    modal.style.opacity = '1';
    content.style.transform = 'translateY(0)';
  }

  function closeReminderModalAndGoHome() {
    const modal = document.getElementById('quest5-reminder-modal');
    const content = document.getElementById('quest5-reminder-modal-content');
    modal.style.opacity = '0';
    content.style.transform = 'translateY(20px)';
    setTimeout(() => {
      modal.style.display = 'none';
      showPage(document.getElementById('page-home'));
    }, 300);
  }
</script>
`;

if (!content.includes('Quest 5 Reminder Modal')) {
   content += '\n' + modalHTML;
}

// 2. Replace the alert in step 3 script with showReminderModal()
const oldStep3Script = `alert("恭喜完成掛號！任務大成功！");
              showPage(document.getElementById('page-home'));`;
const newStep3Script = `showReminderModal();`;

content = content.replace(oldStep3Script, newStep3Script);

// Also replace for Step 4 just in case they click Next there
const oldStep4Script = `alert("自行預約手續完成！任務大成功！");
              showPage(document.getElementById('page-home'));`;
const newStep4Script = `showReminderModal();`;

content = content.replace(oldStep4Script, newStep4Script);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully added reminder modal and updated Next buttons.");
