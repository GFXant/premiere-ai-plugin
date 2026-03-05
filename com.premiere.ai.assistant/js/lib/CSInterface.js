/* Minimal CSInterface shim. Replace with official Adobe CSInterface.js for production. */
(function () {
  if (typeof window.CSInterface !== "undefined") return;

  function CSInterface() {}

  CSInterface.prototype.evalScript = function (script, callback) {
    if (window.__adobe_cep__ && typeof window.__adobe_cep__.evalScript === "function") {
      window.__adobe_cep__.evalScript(script, callback || function () {});
      return;
    }

    if (callback) callback("CSInterface unavailable");
  };

  window.CSInterface = CSInterface;
})();
