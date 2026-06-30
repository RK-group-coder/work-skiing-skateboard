const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

const startMarker = '<!-- ===== COVER PAGE ===== -->';
const endMarker = '<!-- ===== OVERVIEW PAGE (Steps) ===== -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  let coverPageCode = content.substring(startIndex, endIndex);
  
  // modify ID
  coverPageCode = coverPageCode.replace('id="page-cover"', 'id="page-cover-quest4"');
  
  // modify btn ids so they don't conflict (although the user said exact same, duplicated IDs in HTML is bad and might break JS for the first page)
  coverPageCode = coverPageCode.replace('id="btn-back-map"', 'id="btn-back-map-quest4" onclick="document.getElementById(\'page-cover-quest4\').classList.add(\'hidden\'); document.getElementById(\'page-cover-quest4\').style.display=\'none\'; document.getElementById(\'page-home\').style.display=\'flex\'; document.getElementById(\'page-home\').classList.remove(\'hidden\');"');
  coverPageCode = coverPageCode.replace('id="btn-start"', 'id="btn-start-quest4"');

  const newCode = '\n<!-- ===== QUEST 4 COVER PAGE ===== -->\n' + coverPageCode + '\n';
  
  const insertIndex = content.indexOf('<!-- ===== OVERVIEW PAGE (Steps) ===== -->');
  content = content.substring(0, insertIndex) + newCode + content.substring(insertIndex);
  
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully duplicated cover page for Quest 4');
} else {
  console.log('Markers not found');
}
