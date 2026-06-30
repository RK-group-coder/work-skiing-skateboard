const fs = require('fs');
const path = 'C:/Users/User/Documents/success new student/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add the CSS styles
const styleBlock = `
  <style>
    #page-task-quest5-step2.has-dynamic-bg h1, 
    #page-task-quest5-step2.has-dynamic-bg p {
      color: #FFFDF8 !important;
      text-shadow: 0 4px 15px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.5);
      transition: color 0.5s ease, text-shadow 0.5s ease;
    }
    #page-task-quest5-step2 h1, 
    #page-task-quest5-step2 p {
      transition: color 0.5s ease, text-shadow 0.5s ease;
    }
    #page-task-quest5-step2.has-dynamic-bg .card-link-text {
      color: #FFFDF8 !important;
      border-bottom-color: #FFFDF8 !important;
      text-shadow: 0 2px 10px rgba(0,0,0,0.8);
    }
    #page-task-quest5-step2.has-dynamic-bg .card-link-text span {
      color: #FFD180 !important;
    }
  </style>
`;
content = content.replace('<!-- Dynamic Backgrounds -->', styleBlock + '  <!-- Dynamic Backgrounds -->');

// 2. NCKU Card (Left)
const oldLeftWrapper = '<div style="display: flex; flex-direction: column; align-items: center;">\n          <div style="position: relative; width: 442px; height: 286px; border-radius: 24px; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(\'ncku_hospital_card.png\') center/cover; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;" \n               onmouseover="this.style.transform=\'translateY(-10px) scale(1.02)\'; document.getElementById(\'dynamic-bg-left\').style.opacity=\'1\';" onmouseout="this.style.transform=\'translateY(0) scale(1)\'; document.getElementById(\'dynamic-bg-left\').style.opacity=\'0\';">';

const newLeftWrapper = `<div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" 
             onmouseover="document.getElementById('ncku-card-inner').style.transform='translateY(-10px) scale(1.02)'; document.getElementById('dynamic-bg-left').style.opacity='1'; document.getElementById('page-task-quest5-step2').classList.add('has-dynamic-bg');" 
             onmouseout="document.getElementById('ncku-card-inner').style.transform='translateY(0) scale(1)'; document.getElementById('dynamic-bg-left').style.opacity='0'; document.getElementById('page-task-quest5-step2').classList.remove('has-dynamic-bg');">
          <div id="ncku-card-inner" style="position: relative; width: 442px; height: 286px; border-radius: 24px; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('ncku_hospital_card.png') center/cover; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px;">`;

content = content.replace(oldLeftWrapper, newLeftWrapper);


// 3. Right Card
const oldRightWrapper = '<div style="display: flex; flex-direction: column; align-items: center;">\n          <div style="position: relative; width: 442px; height: 286px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px; overflow: hidden;"\n               onmouseover="this.style.transform=\'translateY(-10px) scale(1.02)\'; document.getElementById(\'dynamic-bg-right\').style.opacity=\'1\';" onmouseout="this.style.transform=\'translateY(0) scale(1)\'; document.getElementById(\'dynamic-bg-right\').style.opacity=\'0\';">';

const newRightWrapper = `<div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" 
             onmouseover="document.getElementById('other-card-inner').style.transform='translateY(-10px) scale(1.02)'; document.getElementById('dynamic-bg-right').style.opacity='1'; document.getElementById('page-task-quest5-step2').classList.add('has-dynamic-bg');" 
             onmouseout="document.getElementById('other-card-inner').style.transform='translateY(0) scale(1)'; document.getElementById('dynamic-bg-right').style.opacity='0'; document.getElementById('page-task-quest5-step2').classList.remove('has-dynamic-bg');">
          <div id="other-card-inner" style="position: relative; width: 442px; height: 286px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 24px; overflow: hidden;">`;

content = content.replace(oldRightWrapper, newRightWrapper);


// 4. Update the <p> links to add the class
// We can use regex to find `<p style="font-size: 16px; font-weight: 700; color: #444...` and add `class="card-link-text"`
content = content.replace(/<p style="font-size: 16px; font-weight: 700; color: #444;/g, '<p class="card-link-text" style="font-size: 16px; font-weight: 700; color: #444;');

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully updated text colors on hover.");
