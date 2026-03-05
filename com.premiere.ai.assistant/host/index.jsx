$._PremiereAIAssistant = {
  insertMarker: function (text) {
    try {
      if (!app.project || !app.project.activeSequence) {
        return "No active sequence.";
      }

      var seq = app.project.activeSequence;
      var now = seq.getPlayerPosition();
      if (!now || !now.ticks) {
        return "Could not read playhead position.";
      }

      var marker = seq.markers.createMarker(now.ticks);
      marker.name = "AI Assistant";
      marker.comments = text;
      return "OK";
    } catch (e) {
      return "Exception: " + e;
    }
  }
};
