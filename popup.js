
const API_KEY = 'AIzaSyAJYSMNx_pFcm4E5htn4M3ZMdwksHNYL5k';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

document.getElementById('paraphraseBtn').addEventListener('click', async () => {
  const inputText = document.getElementById('inputText').value.trim();
  const loadingDiv = document.getElementById('loading');
  const responseDiv = document.getElementById('response');

  if (!inputText) {
    alert('Please enter some text first!');
    return;
  }

  try {
    loadingDiv.style.display = 'block';
    responseDiv.textContent = '';

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Fix the grammar, check for spelling mistakes(dont change spellings of Proper Nouns) it should sound formal and smart and remove repetitions in this text. Return only the corrected version without any explanations or additional text: "${inputText}"`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 1,
          topP: 0.95,
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get response from the API');
    }

    const data = await response.json();
    console.log('Raw API Response:', data);
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const resultText = data.candidates[0].content.parts[0].text.trim();
      responseDiv.textContent = resultText;
      document.getElementById('copyBtn').style.display = 'block';
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Could not extract text from the model response');
    }
  } catch (error) {
    console.error('Error:', error);
    responseDiv.textContent = 'Error: ' + error.message;
    document.getElementById('copyBtn').style.display = 'none';
  } finally {
    loadingDiv.style.display = 'none';
  }
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const responseText = document.getElementById('response').textContent;
  navigator.clipboard.writeText(responseText).then(() => {
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    alert('Failed to copy text to clipboard');
  });
});
