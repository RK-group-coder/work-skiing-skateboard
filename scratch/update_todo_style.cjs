const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Locate existing sidebar todo list
const startHTML = '<!-- Sidebar To-Do List -->';
const endScript = '</script>';

const idxStart = content.indexOf(startHTML);
if (idxStart !== -1) {
    const scriptStart = content.indexOf('<script>', idxStart);
    const idxEnd = content.indexOf(endScript, scriptStart) + endScript.length;

    const newTodoContent = `
    <!-- Sidebar To-Do List -->
    <div id="global-todo-list" style="background: rgba(30, 20, 15, 0.95); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: flex; flex-direction: column; margin-bottom: 12px; box-sizing: border-box; overflow: hidden; transition: all 0.3s ease;">
      <div id="todo-header" style="display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'" onclick="toggleTodoList()">
        <div style="color: #FFFDF8; font-weight: 800; font-size: 16px; letter-spacing: 1px; font-family: 'Outfit', sans-serif;">待辦清單</div>
        <div style="color: #fbbf24; font-size: 13px; font-weight: 600;"><span id="todo-count">0</span> 項</div>
      </div>
      <div id="todo-items-wrapper" style="display: none; border-top: 1px solid rgba(255,255,255,0.1);">
        <div id="todo-items-container" style="display: flex; flex-direction: column; gap: 12px; padding: 16px 18px; min-height: 20px;">
          <!-- Empty state text initially -->
          <div id="todo-empty-state" style="color: rgba(255,255,255,0.4); font-size: 13px; text-align: center; padding: 5px 0; font-weight: 500;">目前無待辦事項</div>
        </div>
      </div>
    </div>

    <!-- Custom Confirm Modal -->
    <div id="todo-confirm-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000000; align-items: center; justify-content: center; backdrop-filter: blur(4px); opacity: 0; transition: opacity 0.2s;">
      <div style="background: white; border-radius: 16px; padding: 24px; width: 300px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3); transform: scale(0.9); transition: transform 0.2s;">
        <div style="width: 48px; height: 48px; background: #FEF3C7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1e293b;">雙重確認</h3>
        <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b;">是否確認已完成此待辦事項？</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button id="todo-confirm-cancel" style="padding: 8px 24px; border: 1px solid #e2e8f0; background: white; border-radius: 8px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='white'">取消</button>
          <button id="todo-confirm-ok" style="padding: 8px 24px; border: none; background: #fbbf24; border-radius: 8px; font-weight: 600; color: white; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#f59e0b'" onmouseout="this.style.background='#fbbf24'">確定</button>
        </div>
      </div>
    </div>

<script>
  let todoCount = 0;

  function toggleTodoList() {
    const wrapper = document.getElementById('todo-items-wrapper');
    if (wrapper.style.display === 'none' || wrapper.style.display === '') {
      wrapper.style.display = 'block';
    } else {
      wrapper.style.display = 'none';
    }
  }

  function updateTodoCount() {
    const countSpan = document.getElementById('todo-count');
    const emptyState = document.getElementById('todo-empty-state');
    if (countSpan) countSpan.innerText = todoCount;
    
    if (todoCount === 0 && emptyState) {
       emptyState.style.display = 'block';
    } else if (emptyState) {
       emptyState.style.display = 'none';
    }
  }

  function showTodoConfirm(onConfirm) {
      const modal = document.getElementById('todo-confirm-modal');
      const box = modal.children[0];
      modal.style.display = 'flex';
      void modal.offsetWidth; // trigger reflow
      modal.style.opacity = '1';
      box.style.transform = 'scale(1)';

      const btnCancel = document.getElementById('todo-confirm-cancel');
      const btnOk = document.getElementById('todo-confirm-ok');

      const cleanup = () => {
          modal.style.opacity = '0';
          box.style.transform = 'scale(0.9)';
          setTimeout(() => modal.style.display = 'none', 200);
          btnCancel.onclick = null;
          btnOk.onclick = null;
      };

      btnCancel.onclick = cleanup;
      btnOk.onclick = () => {
          cleanup();
          onConfirm();
      };
  }

  function addTodoItem(text, buttonElement) {
    // Change button state if provided
    if (buttonElement) {
       buttonElement.innerText = '已加入 ✓';
       buttonElement.style.background = '#22c55e';
       buttonElement.style.color = 'white';
       buttonElement.style.boxShadow = '0 4px 12px rgba(34,197,94,0.3)';
       buttonElement.style.pointerEvents = 'none'; // Prevent double clicking
    }

    todoCount++;
    updateTodoCount();

    const container = document.getElementById('todo-items-container');
    const wrapper = document.getElementById('todo-items-wrapper');
    
    // Automatically open the list if it's closed when adding
    if (wrapper.style.display === 'none' || wrapper.style.display === '') {
        wrapper.style.display = 'block';
    }

    const itemDiv = document.createElement('div');
    itemDiv.style.display = 'flex';
    itemDiv.style.alignItems = 'flex-start';
    itemDiv.style.gap = '12px';
    itemDiv.style.cursor = 'pointer';
    itemDiv.style.transition = 'all 0.3s ease';
    
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

    itemDiv.onclick = () => {
      // Use custom confirmation modal
      showTodoConfirm(() => {
          const box = itemDiv.querySelector('.todo-checkbox');
          const icon = itemDiv.querySelector('.todo-check-icon');
          const txt = itemDiv.querySelector('.todo-text');
          
          // Show checkmark
          box.style.background = 'rgba(251,191,36,0.15)';
          icon.style.opacity = '1';
          txt.style.textDecoration = 'line-through';
          txt.style.opacity = '0.4';

          // Wait a bit, then fade out and remove
          setTimeout(() => {
              itemDiv.style.opacity = '0';
              itemDiv.style.transform = 'translateX(20px)';
              setTimeout(() => {
                  itemDiv.remove();
                  todoCount--;
                  updateTodoCount();
                  // Check if list is empty, close it maybe? Or just show empty state
                  if(todoCount === 0) {
                      setTimeout(()=> toggleTodoList(), 500); // optional auto-close
                  }
              }, 300);
          }, 500);
      });
    };

    container.appendChild(itemDiv);

    // Add a slight pop animation to the todo list to show something was added
    const todoList = document.getElementById('global-todo-list');
    todoList.style.transform = 'scale(1.02)';
    setTimeout(() => {
        todoList.style.transform = 'scale(1)';
    }, 200);
  }
</script>
`;

    content = content.substring(0, idxStart) + newTodoContent + content.substring(idxEnd);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully updated to-do list to accordion style with custom modal.");
} else {
    console.log("Could not find the Sidebar To-Do List marker.");
}
