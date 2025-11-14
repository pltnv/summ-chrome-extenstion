<script>
  import { onMount } from "svelte";
  import TextDisplay from "@/components/TextDisplay.svelte";

  // Reactive state
  let textHistory = $state([]); // History of all selected texts
  let currentText = $state("");

  // Computed properties with $derived
  const hasHistory = $derived(textHistory.length > 0);
  const historyCount = $derived(textHistory.length);

  // Functions for history management
  function addTextToHistory(newText, actionType) {
    if (newText && newText !== currentText) {
      const historyItem = {
        id: Date.now(),
        text: newText,
        actionType,
        timestamp: new Date(),
      };

      textHistory = [...textHistory, historyItem];
      currentText = newText;

      console.log("New text added to history:", historyItem);
      console.log("History updated:", textHistory.length, "items");
    }
  }

  function clearHistory() {
    console.log("Clearing history, items removed:", textHistory.length);
    textHistory = [];
    currentText = "";
  }

  function updateFromStorage() {
    console.log("[v0] Popup: Updating from storage...");
    chrome.storage.local.get(["selectedText", "actionType"], (data) => {
      const newText = data.selectedText || "";
      const actionType = data.actionType || "";
      console.log("[v0] Popup: Got from storage:", { newText, actionType });
      addTextToHistory(newText, actionType);
    });
  }

  function handleClick() {
    console.log("Button clicked!");
  }

  function summarizeText() {
    chrome.runtime.sendMessage({
      type: "SUMMARIZE",
      text: "test",
    });
  }

  onMount(() => {
    console.log("Popup/SidePanel mounted, loading initial text...");

    // Загружаем начальный текст
    updateFromStorage();

    // Слушаем изменения в storage
    function onStorageChanged(changes, area) {
      if (area === "local" && (changes.selectedText || changes.actionType)) {
        console.log("Storage changed, updating data...");
        updateFromStorage();
      }
    }

    chrome.storage.onChanged.addListener(onStorageChanged);

    // Cleanup
    return () => {
      chrome.storage.onChanged.removeListener(onStorageChanged);
    };
  });
</script>

<div class="popup">
  <h1>AI Text Assistant</h1>

  <!-- Action buttons -->
  <div class="action-buttons">
    {#if hasHistory}
      <button onclick={clearHistory} class="clear-btn">
        Clear History ({historyCount})
      </button>
    {/if}
  </div>

  <!-- History items -->
  {#each textHistory as item (item.id)}
    <TextDisplay text={item.text} actionType={item.actionType} />
  {/each}
</div>

<style>
  :global(body, html) {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
  }

  :global(#app) {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Main container takes full height with scrolling */
  .popup {
    flex: 1; /* Takes available space */
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Content from top */
    max-width: 100%;
    overflow-y: auto; /* Allow scrolling of entire popup content */
    max-height: 100vh; /* Ensure it doesn't grow beyond viewport */

    /* Custom scrollbar for main popup */
    scrollbar-width: thin;
    scrollbar-color: #4caf50 #f1f1f1;
  }

  .popup::-webkit-scrollbar {
    width: 8px;
  }

  .popup::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .popup::-webkit-scrollbar-thumb {
    background: #4caf50;
    border-radius: 4px;
    border: 1px solid #f1f1f1;
  }

  .popup::-webkit-scrollbar-thumb:hover {
    background: #45a049;
  }

  h1 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
    flex-shrink: 0; /* Don't shrink title */
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    flex-wrap: wrap;
  }

  button {
    padding: 8px 16px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 14px;
    transition: background 0.3s ease;
  }

  button:hover {
    background: #45a049;
  }

  .clear-btn {
    background: #f44336;
  }

  .clear-btn:hover {
    background: #d32f2f;
  }
</style>
