# Premiere Pro AI Assistant Plugin (CEP)

Plugin panel for **Adobe Premiere Pro** that lets you prompt AI models directly inside Premiere and optionally drop the result into timeline markers.

Supported providers in this scaffold:
- OpenAI (ChatGPT family)
- Anthropic (Claude)
- Google (Gemini / Veo-compatible API endpoint style)
- Custom endpoint (for local/self-hosted models)

---

## What this plugin does

- Opens as a dockable Premiere Pro panel.
- Lets you choose provider + model + API key.
- Sends your prompt to the selected model.
- Displays response in-panel.
- Can insert response text into a marker at the current timeline playhead.

---

## Project structure

- `com.premiere.ai.assistant/CSXS/manifest.xml` — CEP extension manifest.
- `com.premiere.ai.assistant/index.html` — panel UI.
- `com.premiere.ai.assistant/css/panel.css` — panel styling.
- `com.premiere.ai.assistant/js/panel.js` — model/provider logic and Premiere bridge.
- `com.premiere.ai.assistant/js/lib/CSInterface.js` — CEP bridge helper.
- `com.premiere.ai.assistant/host/index.jsx` — ExtendScript utilities for Premiere.

---

## Install (developer mode)

1. Enable CEP debug mode for your OS.
2. Copy `com.premiere.ai.assistant` into your CEP extensions folder:
   - macOS: `~/Library/Application Support/Adobe/CEP/extensions/`
   - Windows: `%APPDATA%/Adobe/CEP/extensions/`
3. Restart Premiere Pro.
4. Open panel from `Window > Extensions > Premiere AI Assistant`.

> Note: This is a starter scaffold. You can harden key storage, add tool-calling, and map model outputs to editing actions.

---

## Security note

API keys are kept in panel local storage for convenience. For production use, route requests through your own secure backend and avoid storing raw keys client-side.
