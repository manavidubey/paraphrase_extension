// content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "paraphraseText" || request.action === "grammarCheck") {
    const textArea = document.querySelector('textarea[tabindex="0"][data-testid="multimodal-input-textarea"]'); // Adjust selector as needed
    if (textArea) {
      const selectedText = request.text; // Text from the background script

      // Request the background script to process the text
      chrome.runtime.sendMessage({
        action: "processText",
        text: selectedText,
        operation: request.action === "paraphraseText" ? "paraphrase" : "grammarCheck"
      }, (response) => {
        if (response && response.result) {
          // Replace the selected text in the textarea with the processed text
          const currentText = textArea.value;
          const start = textArea.selectionStart;
          const end = textArea.selectionEnd;

          // Replace the selected portion with the new text
          textArea.value = currentText.substring(0, start) + response.result + currentText.substring(end);

          // Manually dispatch an input event to trigger any React/Vue listeners
          // This is often necessary for frameworks like React which ChatGPT uses
          const event = new Event('input', {
            bubbles: true,
            cancelable: true,
          });
          textArea.dispatchEvent(event);

          // Focus and potentially reposition cursor (optional)
          textArea.focus();
          textArea.setSelectionRange(start + response.result.length, start + response.result.length);

        } else if (response && response.error) {
          alert("Error processing text: " + response.error);
        } else {
          alert("Failed to get a response from the extension.");
        }
      });
    } else {
      console.error("ChatGPT text area not found.");
      // Optionally send an alert to the user
      alert("Could not find the ChatGPT text area.");
    }
  }
});