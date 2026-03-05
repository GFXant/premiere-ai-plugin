(function () {
  const cs = typeof CSInterface !== "undefined" ? new CSInterface() : null;

  const el = {
    provider: document.getElementById("provider"),
    model: document.getElementById("model"),
    apiKey: document.getElementById("apiKey"),
    customUrlWrap: document.getElementById("customUrlWrap"),
    customUrl: document.getElementById("customUrl"),
    prompt: document.getElementById("prompt"),
    sendBtn: document.getElementById("sendBtn"),
    insertMarkerBtn: document.getElementById("insertMarkerBtn"),
    output: document.getElementById("output"),
  };

  const STORAGE_KEY = "premiere_ai_assistant_settings_v1";

  function loadSettings() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      el.provider.value = data.provider || "openai";
      el.model.value = data.model || "gpt-4o-mini";
      el.apiKey.value = data.apiKey || "";
      el.customUrl.value = data.customUrl || "";
      toggleCustomUrl();
    } catch (_err) {
      // ignore corrupt local settings
    }
  }

  function saveSettings() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        provider: el.provider.value,
        model: el.model.value,
        apiKey: el.apiKey.value,
        customUrl: el.customUrl.value,
      })
    );
  }

  function toggleCustomUrl() {
    if (el.provider.value === "custom") {
      el.customUrlWrap.classList.remove("hidden");
    } else {
      el.customUrlWrap.classList.add("hidden");
    }
  }

  function setOutput(text) {
    el.output.textContent = text || "";
  }

  function headersWithKey(provider, apiKey) {
    if (provider === "anthropic") {
      return {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      };
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
  }

  async function callModel({ provider, model, apiKey, prompt, customUrl }) {
    if (!apiKey) {
      throw new Error("API key is required.");
    }

    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: headersWithKey(provider, apiKey),
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "OpenAI request failed");
      return data.choices?.[0]?.message?.content || "";
    }

    if (provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: headersWithKey(provider, apiKey),
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Claude request failed");
      return data.content?.map((c) => c.text).join("\n") || "";
    }

    if (provider === "google") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Google request failed");
      return (
        data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text)
          .filter(Boolean)
          .join("\n") || ""
      );
    }

    if (provider === "custom") {
      if (!customUrl) throw new Error("Custom URL is required.");
      const res = await fetch(customUrl, {
        method: "POST",
        headers: headersWithKey(provider, apiKey),
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Custom request failed");
      return data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);
    }

    throw new Error(`Unsupported provider: ${provider}`);
  }

  async function onSend() {
    const provider = el.provider.value;
    const model = el.model.value.trim();
    const apiKey = el.apiKey.value.trim();
    const prompt = el.prompt.value.trim();
    const customUrl = el.customUrl.value.trim();

    if (!model) return setOutput("Model is required.");
    if (!prompt) return setOutput("Prompt is required.");

    saveSettings();
    setOutput("Loading...");

    try {
      const response = await callModel({ provider, model, apiKey, prompt, customUrl });
      setOutput(response);
    } catch (err) {
      setOutput(`Error: ${err.message || err}`);
    }
  }

  function escapeForEvalScript(str) {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "");
  }

  function onInsertMarker() {
    if (!cs) {
      setOutput("CSInterface is not available. This must run inside Premiere Pro CEP.");
      return;
    }

    const text = el.output.textContent.trim();
    if (!text) {
      setOutput("No model output available to insert.");
      return;
    }

    const safeText = escapeForEvalScript(text);
    cs.evalScript(`$._PremiereAIAssistant.insertMarker("${safeText}")`, function (result) {
      if (result !== "OK") {
        setOutput(`Marker insert failed: ${result}`);
      }
    });
  }

  el.provider.addEventListener("change", () => {
    toggleCustomUrl();
    saveSettings();
  });

  [el.model, el.apiKey, el.customUrl].forEach((node) => {
    node.addEventListener("change", saveSettings);
    node.addEventListener("blur", saveSettings);
  });

  el.sendBtn.addEventListener("click", onSend);
  el.insertMarkerBtn.addEventListener("click", onInsertMarker);

  loadSettings();
  toggleCustomUrl();
})();
