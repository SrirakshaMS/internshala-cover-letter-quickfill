document.addEventListener('focus', (event) => {
  if (event.target.classList.contains('ql-editor')) {
    // Check if the button already exists
    if (!document.querySelector('#openPopupButton')) {
      const button = document.createElement('button');
      button.id = 'openPopupButton';
      button.textContent = 'Open Internshala Autofill';
      button.style.position = 'fixed';
      button.style.bottom = '10px';
      button.style.right = '10px';
      button.style.zIndex = '1000';
      button.onclick = () => {
        // Trigger click on extension icon to open the popup
        chrome.runtime.sendMessage({ action: 'triggerPopup' });
      };
      document.body.appendChild(button);
    }
  }
}, true);
