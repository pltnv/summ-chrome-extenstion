let lastSelection = "";

document.addEventListener("mouseup", () => {
  const text = window.getSelection().toString().trim();
  if (text) {
    lastSelection = text;
    console.log("[v0] Text selected:", text);
  }
});

// Также отслеживаем при изменении выделения
document.addEventListener("selectionchange", () => {
  const text = window.getSelection().toString().trim();
  if (text) {
    lastSelection = text;
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_SELECTION") {
    const currentSelection = getSelection().toString().trim();

    const textToSend = currentSelection || lastSelection;

    console.log("[v0] Sending selected text:", textToSend);

    sendResponse({ text: textToSend });

    return true;
  }
});

console.log("[v0] Content script loaded");
