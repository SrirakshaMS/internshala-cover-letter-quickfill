document.getElementById('saveButton').addEventListener('click', () => {
    const selectedRole = document.getElementById('roleSelect').value;
    chrome.storage.local.set({ selectedRole }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'autofill' });
      });
      window.close();
    });
  });
  