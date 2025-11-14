# AI Text Assistant

Chrome extension for AI-powered text analysis and processing. Select text on any webpage, right-click and choose from AI actions: explanation or summarization in a side panel.

## Install

### Option 1: Pre-built (easiest)
1. Download `ai-text-assistant-v1.0.0.zip`
2. Unpack it
3. Load unpacked in chrome://extensions/

### Option 2: From source
1. Clone the repo
2. Run `npm install`
3. Run `npm run build`
4. Load the `dist` folder as unpacked extension

## Usage

1. Select text on any webpage
2. Right-click → Choose "Explain text" or "Summarize text"
3. **OR use hotkeys:**
   - `Alt+Shift+E` (Mac: `Alt+Shift+E`) → Explain selected text
   - `Ctrl+Shift+S` (Mac: `Cmd+Shift+S`) → Summarize selected text
4. Results appear in side panel
5. Click extension icon to open/close panel

Built with Svelte & Vite.
