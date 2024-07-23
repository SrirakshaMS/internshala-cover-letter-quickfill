chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'triggerPopup') {
      // Since we can't programmatically open the popup, we can show a message or handle the action another way
      // Here we just log a message
      console.log('Button clicked, user should open the popup manually.');
    }
  });
  