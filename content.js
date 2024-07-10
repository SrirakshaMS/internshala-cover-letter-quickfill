document.addEventListener('focus', (event) => {
    if (event.target.classList.contains('ql-editor')) {
      chrome.action.openPopup();
    }
  }, true);
  