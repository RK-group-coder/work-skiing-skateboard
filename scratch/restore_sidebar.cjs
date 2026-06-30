const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const restoredSidebarHTML = `
      <div style="padding: 14px 18px; border-radius: 12px; font-weight: 700; color: #8B1A1A; background: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; transition: all 0.2s; box-shadow: 0 2px 8px rgba(139,26,26,0.05); border: 1px solid #f0e6e6;" onclick="document.getElementById('auth-modal').style.display='flex'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 12px;"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        登入 / 註冊帳號
      </div>
      <div style="padding: 14px 18px; border-radius: 12px; font-weight: 700; color: white; background: #0f172a; cursor: pointer; font-size: 16px; display: flex; align-items: center; transition: all 0.2s; box-shadow: 0 4px 12px rgba(15,23,42,0.2);" onclick="window.location.href='admin.html'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 12px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        進入後台管理
      </div>
      <div style="padding: 14px 18px; border-radius: 12px; font-weight: 600; color: #475569; cursor: pointer; font-size: 15px; display: flex; align-items: center; transition: all 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.03)'" onmouseout="this.style.background='transparent'">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 12px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        隱私條款與政策
      </div>
      <div style="padding: 14px 18px; border-radius: 12px; font-weight: 600; color: #8B1A1A; background: #FAF5F5; cursor: pointer; font-size: 15px; display: flex; align-items: center; transition: all 0.2s;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 12px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        成大商城規則
      </div>
      
      <div style="margin-top: 16px; font-size: 14px; color: #333; line-height: 1.6; padding: 0 8px;">
        💡<br>
        • 若忘記密碼，可點選「忘記密碼」進行重設。<br>
        • 完成右側操作後，回到左側勾選完成，繼續下一步！
      </div>
`;

// Insert the restored HTML right after the To-Do list div closes
const todoListHtml = 'id="global-todo-list"';
const todoListStartIdx = content.indexOf(todoListHtml);

if (todoListStartIdx !== -1) {
    // Find the end of the global-todo-list div
    // It has: 
    // <div id="global-todo-list"...>
    //   <div id="todo-header"...>...</div>
    //   <div id="todo-items-wrapper"...>...</div>
    // </div>
    // So we look for the next "<!-- Custom Confirm Modal -->" to inject before it
    const modalStartIdx = content.indexOf('<!-- Custom Confirm Modal -->');
    if(modalStartIdx !== -1) {
        content = content.substring(0, modalStartIdx) + restoredSidebarHTML + '\n' + content.substring(modalStartIdx);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Successfully restored missing sidebar options.");
    } else {
        console.log("Could not find modal index.");
    }
}
