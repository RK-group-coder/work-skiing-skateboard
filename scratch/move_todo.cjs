const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the old floating To-Do List from the bottom
const todoStart = content.indexOf('<!-- Global Floating To-Do List -->');
const scriptStart = content.indexOf('<script>', todoStart);
if (todoStart !== -1 && scriptStart !== -1) {
    // Only remove the HTML part, keep the <script> part because the logic is still needed
    content = content.substring(0, todoStart) + content.substring(scriptStart);
}

// 2. The new To-Do List HTML for the Sidebar
const newTodoHTML = `
    <!-- Sidebar To-Do List -->
    <div id="global-todo-list" style="background: rgba(30, 20, 15, 0.95); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; width: 100%; padding: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: flex; flex-direction: column; margin-bottom: 12px; box-sizing: border-box;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
        <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(245,158,11,0.3);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6E1414" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div style="color: #FFFDF8; font-weight: 900; font-size: 16px; letter-spacing: 1px; font-family: 'Outfit', sans-serif; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">待辦清單</div>
      </div>
      <div id="todo-items-container" style="display: flex; flex-direction: column; gap: 12px; min-height: 20px;">
        <!-- Empty state text initially -->
        <div id="todo-empty-state" style="color: rgba(255,255,255,0.4); font-size: 13px; text-align: center; padding: 5px 0; font-weight: 500;">目前無待辦事項</div>
      </div>
    </div>
`;

// 3. Insert the new To-Do List into the sidebar, right at the top of the menu options
const sidebarMenuOptionsStart = content.indexOf(`<div style="padding: 24px 16px; display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1;">`);
if (sidebarMenuOptionsStart !== -1) {
    const insertPosition = sidebarMenuOptionsStart + `<div style="padding: 24px 16px; display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1;">`.length;
    content = content.substring(0, insertPosition) + '\n' + newTodoHTML + content.substring(insertPosition);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully moved To-Do List into the sidebar.");
