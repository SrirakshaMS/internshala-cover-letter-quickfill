chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'autofill') {
      // Try to identify the role from the page
      const roleElement = document.querySelector('h3.job-internship-name');
      let role = roleElement ? roleElement.textContent.trim() : null;
  
      // If the role is found, fetch the appropriate cover letter
      if (role) {
        fetch(chrome.runtime.getURL('cover_letters.js'))
          .then(response => response.text())
          .then(scriptText => {
            eval(scriptText); // Load the coverLetters object
            if (coverLetters[role]) {
              // Autofill the cover letter
              const coverLetterElement = document.querySelector('#cover_letter');
              const coverLetterVisibleElement = document.querySelector('.ql-editor[contenteditable="true"]');
              if (coverLetterElement) {
                coverLetterElement.value = coverLetters[role];
                // Trigger input event to ensure any form validation is updated
                coverLetterElement.dispatchEvent(new Event('input'));
              }
              if (coverLetterVisibleElement) {
                coverLetterVisibleElement.innerHTML = coverLetters[role];
              }
            } else {
              // If no matching cover letter, show the popup
              chrome.runtime.sendMessage({ action: 'showPopup' });
            }
          });
      } else {
        // If role not found, show the popup
        chrome.runtime.sendMessage({ action: 'showPopup' });
      }
    }
  });
  