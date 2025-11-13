<script>
  import { onMount } from "svelte";
  let text = $state("");

  function handleClick() {
    console.log("Button clicked!");
  }

  function summarizeText() {
    // Отправляем запрос в background worker
    chrome.runtime.sendMessage({
      type: "SUMMARIZE",
      text: "test",
    });
  }

  onMount(() => {
    chrome.storage.local.get("selectedText", (data) => {
      text = data.selectedText || "";
      console.log(data);
    });
  });
</script>

<div class="popup">
  <h1>My Extension</h1>
  <button onclick={summarizeText}> Click me! </button>
  <p>текст {text}</p>
</div>

<style>
  * {
    cursor:
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="%234CAF50" stroke="%23ffffff" stroke-width="2"/><text x="16" y="20" text-anchor="middle" fill="white" font-size="12">✓</text></svg>')
        16 16,
      auto !important;
  }

  .popup {
    width: 300px;
    padding: 20px;
    text-align: center;
  }

  h1 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
  }

  button {
    padding: 10px 20px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #45a049;
  }
</style>
