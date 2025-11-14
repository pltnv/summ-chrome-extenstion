<script>
  let { text = "", actionType = "" } = $props();
</script>

<div class="text-display">
  {#if text}
    <div class="text-block">
      <div class="text-content">
        {text}
      </div>
    </div>
  {/if}
</div>

<style>
  .text-display {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding: 15px;
  }

  .text-block {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .text-content {
    padding: 15px;
    font-size: 14px;
    line-height: 1.6;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #4caf50 #f1f1f1;
  }

  .text-content::-webkit-scrollbar {
    width: 8px;
  }

  .text-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .text-content::-webkit-scrollbar-thumb {
    background: #4caf50;
    border-radius: 4px;
    border: 1px solid #f1f1f1;
  }

  .text-content::-webkit-scrollbar-thumb:hover {
    background: #45a049;
  }
</style>
