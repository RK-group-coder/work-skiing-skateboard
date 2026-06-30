const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add floating todo list HTML
const todoHTML = `
<!-- Global Floating To-Do List -->
<div id="global-todo-list" style="position: fixed; bottom: 40px; right: 40px; z-index: 99999; background: rgba(30, 20, 15, 0.95); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; width: 320px; padding: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; flex-direction: column; transform: translateY(0); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px;">
    <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(245,158,11,0.3);">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E1414" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>
    <div style="color: #FFFDF8; font-weight: 900; font-size: 18px; letter-spacing: 1px; font-family: 'Outfit', sans-serif; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">To Do List 待辦清單</div>
  </div>
  <div id="todo-items-container" style="display: flex; flex-direction: column; gap: 16px; min-height: 40px;">
    <!-- Empty state text initially -->
    <div id="todo-empty-state" style="color: rgba(255,255,255,0.4); font-size: 14px; text-align: center; padding: 10px 0; font-weight: 500;">目前無待辦事項</div>
  </div>
</div>

<script>
  function addTodoItem(text, buttonElement) {
    // Change button state if provided
    if (buttonElement) {
       buttonElement.innerText = '已加入 ✓';
       buttonElement.style.background = '#22c55e';
       buttonElement.style.color = 'white';
       buttonElement.style.boxShadow = '0 4px 12px rgba(34,197,94,0.3)';
       buttonElement.style.pointerEvents = 'none'; // Prevent double clicking
    }

    const container = document.getElementById('todo-items-container');
    const emptyState = document.getElementById('todo-empty-state');
    if (emptyState) {
        emptyState.style.display = 'none';
    }

    const itemDiv = document.createElement('div');
    itemDiv.style.display = 'flex';
    itemDiv.style.alignItems = 'flex-start';
    itemDiv.style.gap = '12px';
    itemDiv.style.cursor = 'pointer';
    itemDiv.style.transition = 'all 0.2s';
    
    // Simple hover effect
    itemDiv.onmouseover = () => itemDiv.style.opacity = '0.8';
    itemDiv.onmouseout = () => itemDiv.style.opacity = '1';

    itemDiv.innerHTML = \`
      <div style="width: 20px; height: 20px; border: 2.5px solid #fbbf24; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; transition: all 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);" class="todo-checkbox">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0; transition: opacity 0.2s; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));" class="todo-check-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div style="color: rgba(255,255,255,0.95); font-size: 15px; font-weight: 500; line-height: 1.5; transition: all 0.2s;" class="todo-text">
        \${text}
      </div>
    \`;

    let isChecked = false;
    itemDiv.onclick = () => {
      isChecked = !isChecked;
      const box = itemDiv.querySelector('.todo-checkbox');
      const icon = itemDiv.querySelector('.todo-check-icon');
      const txt = itemDiv.querySelector('.todo-text');
      
      if (isChecked) {
         box.style.background = 'rgba(251,191,36,0.15)';
         icon.style.opacity = '1';
         txt.style.textDecoration = 'line-through';
         txt.style.opacity = '0.4';
      } else {
         box.style.background = 'transparent';
         icon.style.opacity = '0';
         txt.style.textDecoration = 'none';
         txt.style.opacity = '1';
      }
    };

    container.appendChild(itemDiv);

    // Add a slight pop animation to the todo list to show something was added
    const todoList = document.getElementById('global-todo-list');
    todoList.style.transform = 'scale(1.05)';
    setTimeout(() => {
        todoList.style.transform = 'scale(1)';
    }, 200);
  }
</script>
`;

if (!content.includes('id="global-todo-list"')) {
    content = content.replace('</body>', todoHTML + '\n</body>');
}

// 2. Update buttons to use addTodoItem
// Replace text 1: 繳費收據寫學號
content = content.replace(
  /(<span[^>]*>繳費收據寫學號<\/span>[\s\S]*?<button )onclick="[^"]*"/,
  `$1onclick="addTodoItem('繳費收據寫學號', this)"`
);

// Replace text 2: 至衛生保健組繳交收據
content = content.replace(
  /(<span[^>]*>至衛生保健組繳交收據<\/span>[\s\S]*?<button )onclick="[^"]*"/,
  `$1onclick="addTodoItem('至衛生保健組繳交收據', this)"`
);

// Replace text 3: 將健康檢查紀錄表、健康檢查同意書<br>繳交到衛保組(郵寄掛號、親送擇一)
content = content.replace(
  /(<span[^>]*>將健康檢查紀錄表、健康檢查同意書<br>繳交到衛保組\(郵寄掛號、親送擇一\)<\/span>[\s\S]*?<button )onclick="[^"]*"/,
  `$1onclick="addTodoItem('繳交體檢紀錄表及同意書至衛保組', this)"`
);

// Replace grey "加入待辦" button inside the Step 5 task list itself (not the modal, but the side menu item)
// Wait, the user has a "加入待辦" in the side menu too:
// <button onclick="event.stopPropagation(); this.innerText='已加入 ✓'; this.style.color='#22c55e'; this.style.background='rgba(34,197,94,0.1)';" style="margin-top: 8px; ...
content = content.replace(
  /onclick="event\.stopPropagation\(\); this\.innerText='已加入 ✓'; this\.style\.color='#22c55e'; this\.style\.background='rgba\(34,197,94,0\.1\)';"/g,
  `onclick="event.stopPropagation(); addTodoItem('列印並攜帶健康檢查紀錄卡', this)"`
);


fs.writeFileSync(path, content, 'utf8');
console.log("Successfully added floating To-Do List and bound all buttons.");
