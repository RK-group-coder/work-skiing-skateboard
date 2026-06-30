const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// Fix Node 04:
// From <div class="hm-node-status hm-status-active">進行中</div> 
// to   <div class="hm-node-status hm-status-locked">0/1 完成</div>
const node04Regex = /(<span>學雜費繳費<\/span>\s*)<div class="hm-node-status hm-status-active">進行中<\/div>/g;
content = content.replace(node04Regex, '$1<div class="hm-node-status hm-status-locked">0/1 完成</div>');

// Fix Node 05:
// Change `<div class="hm-node hm-node-locked" style="left:65%; top:56%">` 
// to `<div class="hm-node hm-node-active" style="left:65%; top:56%; cursor: pointer;" onclick="showPage(document.getElementById(\'page-cover-quest5\'))">`
const node05Line1 = '<!-- Node 05: 健康檢查 (鎖定) -->\r\n        <div class="hm-node hm-node-locked" style="left:65%; top:56%">';
const node05Line1_nl = '<!-- Node 05: 健康檢查 (鎖定) -->\n        <div class="hm-node hm-node-locked" style="left:65%; top:56%">';
const node05New1 = '<!-- Node 05: 健康檢查 (進行中) -->\n        <div class="hm-node hm-node-active" style="left:65%; top:56%; cursor: pointer;" onclick="showPage(document.getElementById(\'page-cover-quest5\'))">';

if (content.includes(node05Line1)) {
    content = content.replace(node05Line1, node05New1);
} else if (content.includes(node05Line1_nl)) {
    content = content.replace(node05Line1_nl, node05New1);
}

// Remove the lock icon from node 05
const lockIconRegex = /(<div class="hm-node hm-node-active" style="left:65%; top:56%; cursor: pointer;" onclick="showPage\(document.getElementById\('page-cover-quest5'\)\)">[\s\S]*?)<div class="hm-node-badge-lock"><svg[\s\S]*?<\/svg><\/div>/;
content = content.replace(lockIconRegex, '$1');

// Change Node 05 label to active
const node05LabelRegex = /(<span>健康檢查<\/span>\s*)<div class="hm-node-status hm-status-locked">0\/1 完成<\/div>/g;
content = content.replace(node05LabelRegex, '$1<div class="hm-node-status hm-status-active">進行中</div>');

// Change Node 05 disk class
const node05DiskRegex = /(<!-- Node 05: 健康檢查 \(進行中\) -->[\s\S]*?)<div class="hm-node-icon-disk">/;
content = content.replace(node05DiskRegex, '$1<div class="hm-node-icon-disk hm-disk-active">');


fs.writeFileSync(path, content, 'utf8');
console.log("Successfully fixed Node 04 and Node 05");
