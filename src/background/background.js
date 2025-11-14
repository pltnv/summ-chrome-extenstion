console.log("Background script loaded");

// Обработчик установки расширения
chrome?.runtime?.onInstalled?.addListener(() => {
  console.log("Extension installed");
});

// Context menu
chrome.runtime.onInstalled.addListener(() => {
  // Explain action
  chrome.contextMenus.create({
    id: "explainText",
    title: "Explain text",
    contexts: ["selection"],
  });

  // Summarize action
  chrome.contextMenus.create({
    id: "summarizeText",
    title: "Summarize text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (
    info.menuItemId === "explainText" ||
    info.menuItemId === "summarizeText"
  ) {
    const selectedText = info.selectionText?.trim();

    if (selectedText) {
      console.log(
        `Text action: ${info.menuItemId}, Selected text:`,
        selectedText
      );

      // Сохраняем тип действия и текст
      await chrome.storage.local.set({
        selectedText,
        actionType: info.menuItemId, // "explainText" or "summarizeText"
      });

      // Открыть side panel
      try {
        await chrome.sidePanel.open({ tabId: tab.id });
        console.log("Side panel opened");
      } catch (error) {
        console.error("Failed to open side panel:", error);
      }
    } else {
      console.log("Текст не выделен");
    }
  }
});

function getSelectedText() {
  console.log(window.getSelection().toString().trim());
  return window.getSelection().toString().trim();
}

chrome?.action?.onClicked?.addListener(async (tab) => {
  console.log("Extension icon clicked on tab:", tab.id);

  // Открыть side panel при клике на иконку расширения
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
    console.log("Side panel opened from action click");
  } catch (error) {
    console.error("Failed to open side panel:", error);
  }
});

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Обработчик горячих клавиш
chrome.commands.onCommand.addListener(async (command) => {
  console.log("[v0] Command received:", command);

  try {
    let actionType;

    if (command === "summary") {
      actionType = "summarizeText";
    } else if (command === "explain") {
      actionType = "explainText";
    } else {
      return; // Неизвестная команда
    }

    // Получаем активную вкладку
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Проверяем что вкладка допустима для content script
    if (
      !tab.url ||
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://")
    ) {
      console.log("[v0] Hotkey not available on this page:", tab.url);
      return;
    }

    let selectedText = "";

    try {
      // Попытка получить выделенный текст через content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "getSelection",
      });
      selectedText = response?.text || "";
    } catch (error) {
      // Don't use fallback for now - content script should be available
      console.log("[v0] Content script not available for tab:", tab.id);
      return;
    }

    if (selectedText) {
      console.log(`[v0] Hotkey ${command} with text:`, selectedText);

      // Сохраняем в storage
      await chrome.storage.local.set({
        selectedText,
        actionType,
      });

      // Открываем side panel
      await chrome.sidePanel.open({ tabId: tab.id });
      console.log("[v0] Side panel opened via hotkey");
    } else {
      console.log("[v0] No text selected for hotkey command");
    }
  } catch (error) {
    console.error("[v0] Error processing hotkey command:", error);
  }
});

// Слушаем сообщения от popup
chrome?.runtime?.onMessage?.addListener(
  async (message, sender, sendResponse) => {
    console.log("[v0] Background received message:", message);

    if (message.type === "SUMMARIZE") {
      console.log(message.text);
      return true; // Указываем, что ответ будет асинхронным
    }
  }
);
