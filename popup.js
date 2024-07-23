document.getElementById('usePrecodedButton').addEventListener('click', () => {
  const selectedRole = document.getElementById('coverLetterSelect').value;
  if (selectedRole) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: autofillCoverLetter,
        args: [selectedRole, true]  // true for pre-coded
      });
    });
  }
});

document.getElementById('generateButton').addEventListener('click', () => {
  const selectedRole = document.getElementById('coverLetterSelect').value;
  if (selectedRole) {
    generateCoverLetterFromGemini(selectedRole);
  }
});

document.getElementById('copyButton').addEventListener('click', () => {
  const coverLetterContent = document.getElementById('coverLetterOutput').innerText;
  navigator.clipboard.writeText(coverLetterContent).then(() => {
      alert('Cover letter copied to clipboard!');
  });
});

function autofillCoverLetter(role, usePrecoded) {
  if (usePrecoded) {
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
              if (coverLetter) {
                  coverLetterElement.innerHTML = coverLetter;
              } else {
                  coverLetterElement.innerHTML = 'Cover letter content not found for this role.';
              }
            } else {
              console.error('Cover letter element not found.');
            }
          });
        })
        .catch(error => {
          console.error('Error importing cover_letters.js:', error);
        });
  } else {
      // Handle gemini content
  }
}

// Add event listener to the 'Generate from Gemini' button
document.getElementById('generateButton').addEventListener('click', () => {
  const selectedRole = document.getElementById('coverLetterSelect').value;
  if (selectedRole) {
      console.log('Generate from Gemini button clicked, role selected:', selectedRole);
      generateCoverLetterFromGemini(selectedRole);
  }
});

// Add event listener to the 'Copy to Clipboard' button
document.getElementById('copyButton').addEventListener('click', () => {
  const coverLetterContent = document.getElementById('coverLetterOutput').innerText;
  if (coverLetterContent) {
      navigator.clipboard.writeText(coverLetterContent)
          .then(() => {
              console.log('Cover letter copied to clipboard');
              alert('Cover letter copied to clipboard!');
          })
          .catch(err => {
              console.error('Failed to copy cover letter: ', err);
              alert('Failed to copy cover letter.');
          });
  } else {
      alert('No cover letter to copy.');
  }
});

// Function to generate cover letter from Google Gemini model
function generateCoverLetterFromGemini(role) {
  // Define prompts for different roles
  const prompts = {
      web_development: "Generate a cover letter for a web development internship.",
      machine_learning: "Generate a cover letter for a machine learning internship.",
      flutter_development: "Generate a cover letter for a Flutter development internship.",
      software_development: "Generate a cover letter for a software development internship."
      // Add more prompts as needed
  };

  // Get the prompt based on the selected role
  const prompt = prompts[role];
  if (!prompt) {
      console.log('Invalid role selected:', role);
      document.getElementById('coverLetterOutput').innerText = 'Invalid role selected.';
      return;
  }

  console.log('Sending request to Gemini API with prompt:', prompt);

  // Make the API request
  fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          contents: [
              {
                  role: 'user',
                  parts: [
                      { text: prompt }
                  ]
              }
          ]
      })
  })
  .then(response => {
      console.log('Received response from API:', response);
      return response.json(); // Parse the JSON from the response
  })
  .then(data => {
      console.log('API Response:', data);

      // Check if the response has the expected structure
      if (data && data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0) {
          console.log('Candidates:', data.candidates);

          // Extract content from the candidates array
          const candidate = data.candidates[0];
          console.log('Candidate content:', candidate);

          // Assuming the text might be under `content` or similar
          const coverLetterContent = candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text
              ? candidate.content.parts[0].text
              : 'No text found in candidate';
              
          document.getElementById('coverLetterOutput').innerText = coverLetterContent.trim();
          document.getElementById('copyButton').style.display = 'block';
      } else {
          console.error('Unexpected API response format:', data);
          document.getElementById('coverLetterOutput').innerText = 'Failed to generate cover letter.';
      }
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById('coverLetterOutput').innerText = 'Failed to generate cover letter.';
  });
}
