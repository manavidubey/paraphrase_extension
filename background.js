// background.js

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item for Paraphrase
  chrome.contextMenus.create({
    id: "paraphraseText",
    title: "Paraphrase Text (ChatGPT)",
    contexts: ["selection"], // Appears when text is selected
    documentUrlPatterns: ["https://chatgpt.com/*"] // Only on ChatGPT
  });

  // Create context menu item for Grammar Check
  chrome.contextMenus.create({
    id: "grammarCheck",
    title: "Grammar Check (ChatGPT)",
    contexts: ["selection"], // Appears when text is selected
    documentUrlPatterns: ["https://chatgpt.com/*"] // Only on ChatGPT
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab.url.startsWith("https://chatgpt.com/")) {
    if (info.menuItemId === "paraphraseText" || info.menuItemId === "grammarCheck") {
      if (info.selectionText) {
        chrome.tabs.sendMessage(tab.id, {
          action: info.menuItemId, // 'paraphraseText' or 'grammarCheck'
          text: info.selectionText
        });
      }
    }
  }
});

// Listen for messages from content script (e.g., API responses)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processText") {
    const originalText = request.text;
    const operation = request.operation; // 'paraphrase' or 'grammarCheck'

    if (operation === 'paraphrase') {
      // --- INTEGRATE WITH A PARAPHRASING API HERE ---
      // For demonstration, we'll just prepend 'Paraphrased: '
      const paraphrasedText = "Paraphrased: " + originalText;
      sendResponse({ result: paraphrasedText });

      // In a real scenario, you'd make an API call:
      /*
      fetch("YOUR_PARAPHRASING_API_ENDPOINT", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer YOUR_API_KEY" // If required
          },
          body: JSON.stringify({ text: originalText })
      })
      .then(response => response.json())
      .then(data => {
          sendResponse({ result: data.paraphrasedText }); // Adjust based on API response
      })
      .catch(error => {
          console.error("Paraphrasing API error:", error);
          sendResponse({ error: "Failed to paraphrase text." });
      });
      return true; // Indicate that sendResponse will be called asynchronously
      */

    } else if (operation === 'grammarCheck') {
      // --- INTEGRATE WITH A GRAMMAR CHECKING API HERE ---
      // For demonstration, we'll just prepend 'Grammar Checked: '
      const checkedText = "Grammar Checked: " + originalText;
      sendResponse({ result: checkedText });

      // In a real scenario, you'd make an API call (e.g., LanguageTool):
      /*
      fetch("https://api.languagetool.org/v2/check", {
          method: "POST",
          headers: {
              "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `language=en-US&text=${encodeURIComponent(originalText)}`
      })
      .then(response => response.json())
      .then(data => {
          let correctedText = originalText;
          // Apply corrections from LanguageTool response
          data.matches.reverse().forEach(match => { // Apply from end to start to avoid index issues
              const replacement = match.replacements && match.replacements.length > 0 ? match.replacements[0].value : '';
              correctedText = correctedText.substring(0, match.offset) + replacement + correctedText.substring(match.offset + match.length);
          });
          sendResponse({ result: correctedText });
      })
      .catch(error => {
          console.error("Grammar Check API error:", error);
          sendResponse({ error: "Failed to check grammar." });
      });
      return true; // Indicate that sendResponse will be called asynchronously
      */
    }
  }
});