document.getElementById('applyButton').addEventListener('click', () => {
    const selectedRole = document.getElementById('coverLetterSelect').value;
    if (selectedRole) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: autofillCoverLetter,
          args: [selectedRole]
        });
      });
    }
  });
  
  function autofillCoverLetter(role) {
    fetch(chrome.runtime.getURL('cover_letters.js'))
      .then(response => response.text())
      .then(text => {
        const script = document.createElement('script');
        script.type = 'module';
        script.textContent = text;
        document.head.appendChild(script);
  
        import(chrome.runtime.getURL('cover_letters.js')).then(module => {
          const coverLetter = module.default[role];
          const coverLetterElement = document.querySelector('#cover_letter_holder .ql-editor');
          if (coverLetterElement) {
            coverLetterElement.innerHTML = coverLetter;
          }
        });
      });
  }
  