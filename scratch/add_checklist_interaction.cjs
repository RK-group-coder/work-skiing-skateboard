const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add cursor: pointer to td-step-item
content = content.replace('.td-step-item {', '.td-step-item {\n      cursor: pointer;\n      transition: transform 0.2s;\n    }\n    .td-step-item:hover {\n      transform: translateX(5px);');

// 2. Modify td-btn-next CSS to have a disabled state
content = content.replace('.td-btn-next {', '.td-btn-next {\n      transition: all 0.3s;\n    }\n    .td-btn-next.disabled {\n      opacity: 0.4;\n      cursor: not-allowed;\n      background: #ccc;\n      color: #888;\n    }\n    .td-btn-next {');

// 3. Add initial 'disabled' class to the '下一步' button
//   <button class="td-btn-next">
//     下一步 &rarr;
//   </button>
content = content.replace('<button class="td-btn-next">', '<button class="td-btn-next disabled" id="td-btn-next-quest5">');

// 4. Add the interactive script at the end of td-main (or just before </div><!-- /page-task-quest5 -->)
const scriptContent = `
    <script>
      // Interactive logic for Quest 5 Checklist
      document.addEventListener('DOMContentLoaded', () => {
        // We will bind events later when the page is loaded or just inline
      });
      
      // Inline initialization to be safe in this SPA setup
      setTimeout(() => {
        const quest5Page = document.getElementById('page-task-quest5');
        if (!quest5Page) return;
        
        const stepItems = quest5Page.querySelectorAll('.td-step-item');
        const progressNum = quest5Page.querySelector('.td-sb-progress-num');
        const nextBtn = document.getElementById('td-btn-next-quest5');
        
        stepItems.forEach((item, index) => {
          item.addEventListener('click', () => {
            const isDone = item.classList.toggle('done');
            
            // Toggle checkmark SVG vs Number
            const marker = item.querySelector('.td-step-marker');
            if (isDone) {
              marker.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
              
              // Change description to "已完成"
              const desc = item.querySelector('.td-step-desc');
              item.dataset.origDesc = desc.innerText;
              desc.innerText = '已完成';
            } else {
              marker.innerHTML = index + 1;
              const desc = item.querySelector('.td-step-desc');
              if (item.dataset.origDesc) {
                desc.innerText = item.dataset.origDesc;
              }
            }
            
            // Update progress
            const doneCount = quest5Page.querySelectorAll('.td-step-item.done').length;
            progressNum.innerText = doneCount;
            
            // Enable/Disable next button
            if (doneCount === stepItems.length) {
              nextBtn.classList.remove('disabled');
            } else {
              nextBtn.classList.add('disabled');
            }
          });
        });
        
        // Add click listener to nextBtn to show completion or go somewhere
        if(nextBtn) {
           nextBtn.addEventListener('click', () => {
             if(!nextBtn.classList.contains('disabled')) {
                // Example action when completed
                alert('任務五完成！即將返回任務地圖並解鎖最終任務！');
                // You can add actual logic to mark the node complete on the map here
                showPage(document.getElementById('page-home'));
             }
           });
        }
      }, 500);
    </script>
`;

// Insert the script right before the closing div of page-task-quest5
// Since it's appended right before </body>, we can just insert before the last </div> of quest5.
const quest5EndIdx = content.indexOf('</div>\n\n\n</body>');
if (quest5EndIdx !== -1) {
    // Actually the page is `</div>` then maybe `<!-- App JS -->` or `</body>`. 
    // Let's use regex to replace the end of page-task-quest5.
    
    // The structure:
    //      <div class="td-hint-box">...</div>
    //    </main>
    //  </div>
    //</div>
    
    // We can insert after td-hint-box
    content = content.replace('      <div class="td-hint-box">', scriptContent + '\n      <div class="td-hint-box">');
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully added checklist interaction script.");
} else {
    // Fallback
    content = content.replace('      <div class="td-hint-box">', scriptContent + '\n      <div class="td-hint-box">');
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully added checklist interaction script (fallback).");
}
