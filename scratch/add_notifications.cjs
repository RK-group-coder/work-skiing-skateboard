const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Hide the dot by default and add ID
content = content.replace(
  /<span class="hm-bell-dot"><\/span>/g,
  '<span class="hm-bell-dot" id="bell-unread-dot" style="display: none;"></span>'
);

// 2. Add onclick to hm-bell and inject the dropdown HTML
const bellHtml = '<div class="hm-bell">';
const bellHtmlReplacement = `<div class="hm-bell" style="position: relative; cursor: pointer;" onclick="toggleNotifications(event)">`;

content = content.replace(bellHtml, bellHtmlReplacement);

const dropdownHtml = `
  <!-- Notification Dropdown -->
  <div id="notification-dropdown" style="display: none; position: absolute; top: 110%; right: -10px; width: 280px; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.05); z-index: 100000; cursor: default; overflow: hidden; transition: opacity 0.2s, transform 0.2s; opacity: 0; transform: translateY(-10px);">
    <div style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #1e293b; display: flex; justify-content: space-between; align-items: center; font-family: 'Outfit', sans-serif;">
      <span>系統通知</span>
      <span style="font-size: 12px; font-weight: 500; color: #64748b; cursor: pointer;" onclick="clearNotifications()">清除全部</span>
    </div>
    <div id="notification-list" style="max-height: 300px; overflow-y: auto; padding: 8px 0; display: flex; flex-direction: column;">
      <div style="padding: 16px; text-align: center; color: #94a3b8; font-size: 13px; font-weight: 500;">目前沒有新通知</div>
    </div>
  </div>
`;

// Insert the dropdown inside the hm-bell div, right before it closes
content = content.replace(
  /<span class="hm-bell-dot" id="bell-unread-dot" style="display: none;"><\/span>\s*<\/div>/g,
  '<span class="hm-bell-dot" id="bell-unread-dot" style="display: none;"></span>' + dropdownHtml + '\n        </div>'
);

// 3. Inject JS Logic
const jsLogic = `
<script>
  let notifications = [];
  let unreadCount = 0;

  function toggleNotifications(e) {
      if (e) e.stopPropagation();
      const dropdown = document.getElementById('notification-dropdown');
      if (dropdown.style.display === 'none' || dropdown.style.display === '') {
          dropdown.style.display = 'block';
          // trigger reflow
          void dropdown.offsetWidth;
          dropdown.style.opacity = '1';
          dropdown.style.transform = 'translateY(0)';
          
          // clear unread dot
          const dot = document.getElementById('bell-unread-dot');
          if (dot) dot.style.display = 'none';
          unreadCount = 0;
      } else {
          dropdown.style.opacity = '0';
          dropdown.style.transform = 'translateY(-10px)';
          setTimeout(() => {
              dropdown.style.display = 'none';
          }, 200);
      }
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('notification-dropdown');
      const bell = document.querySelector('.hm-bell');
      if (dropdown && dropdown.style.display === 'block' && bell && !bell.contains(e.target)) {
          toggleNotifications();
      }
  });

  function addNotification(type, message) {
      const now = new Date();
      const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      
      notifications.unshift({ type, message, time: timeStr });
      unreadCount++;
      
      const dot = document.getElementById('bell-unread-dot');
      if (dot) dot.style.display = 'block';
      renderNotifications();
  }

  function renderNotifications() {
      const list = document.getElementById('notification-list');
      if (!list) return;
      if (notifications.length === 0) {
          list.innerHTML = '<div style="padding: 16px; text-align: center; color: #94a3b8; font-size: 13px; font-weight: 500;">目前沒有新通知</div>';
          return;
      }
      
      list.innerHTML = notifications.map(n => {
          const icon = n.type === 'add' ? '✨' : '✔️';
          return \`
          <div style="padding: 12px 16px; border-bottom: 1px solid #f8fafc; display: flex; align-items: flex-start; gap: 12px; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
             <div style="font-size: 16px; margin-top: 1px; flex-shrink: 0;">\${icon}</div>
             <div style="flex: 1; min-width: 0;">
               <div style="font-size: 13px; color: #334155; line-height: 1.4; font-weight: 600; text-align: left; overflow: hidden; text-overflow: ellipsis;">\${n.message}</div>
               <div style="font-size: 11px; color: #94a3b8; margin-top: 4px; text-align: left;">\${n.time}</div>
             </div>
          </div>
          \`;
      }).join('');
  }

  function clearNotifications() {
      notifications = [];
      unreadCount = 0;
      const dot = document.getElementById('bell-unread-dot');
      if (dot) dot.style.display = 'none';
      renderNotifications();
  }
</script>
`;

// Inject JS logic before </body>
content = content.replace('</body>', jsLogic + '\n</body>');

// 4. Update addTodoItem and completion logic
// In addTodoItem, right after todoCount++
content = content.replace(
  /todoCount\+\+;\s*updateTodoCount\(\);/g,
  "todoCount++; updateTodoCount(); if(typeof addNotification === 'function') addNotification('add', '新增待辦任務：' + text);"
);

// In the custom modal completion callback
// Look for txt.style.opacity = '0.4';
content = content.replace(
  /txt\.style\.opacity = '0\.4';/g,
  "txt.style.opacity = '0.4'; if(typeof addNotification === 'function') addNotification('complete', '已完成任務：' + txt.innerText.trim());"
);

fs.writeFileSync(path, content, 'utf8');
console.log("Added notification system.");
