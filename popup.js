document.getElementById('saveButton').addEventListener('click', () => {
    const selectedRole = document.getElementById('roleSelect').value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'autofill', role: selectedRole });
    });
    window.close();
  });
  