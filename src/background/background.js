console.log("Background script loaded");

// Обработчик установки расширения
chrome?.runtime?.onInstalled?.addListener(() => {
  console.log("Extension installed");
});

// Context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "aiExplain",
    title: "Пояснить (Gemini)",
    contexts: ["selection"], // показывать только при выделении текста
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "aiExplain") {
    const selectedText = info.selectionText?.trim();

    if (selectedText) {
      console.log("Выделенный текст:", selectedText);

      await chrome.storage.local.set({ selectedText });
    } else {
      console.log("Текст не выделен");
    }
  }
});

function getSelectedText() {
  console.log(window.getSelection().toString().trim());
  return window.getSelection().toString().trim();
}

chrome?.action?.onClicked?.addListener((tab) => {
  console.log("Extension icon clicked on tab:", tab.id);
});

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Слушаем сообщения от popup
chrome?.runtime?.onMessage?.addListener((message, sender, sendResponse) => {
  console.log("[v0] Background received message:", message);

  if (message.type === "SUMMARIZE") {
    console.log(message.text);
    return true; // Указываем, что ответ будет асинхронным
  }
});
