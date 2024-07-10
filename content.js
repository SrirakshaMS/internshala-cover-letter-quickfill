chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'autofill') {
      const coverLetterElement = document.querySelector('textarea#coverLetter'); // Change this selector as per the actual DOM structure
  
      if (coverLetterElement) {
        const role = document.querySelector('input#role').value; // Change this selector as per the actual DOM structure
        chrome.storage.local.get([role], (result) => {
          if (result[role]) {
            coverLetterElement.value = result[role];
          } else {
            chrome.runtime.sendMessage({ action: 'showPopup' });
          }
        });
      }
    }
  });
  