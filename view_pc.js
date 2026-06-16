// Coach Beurt V51.52 — API publique du domaine session
// app.js reste chef d’orchestre; CoachSession regroupe les points d’entrée terrain.
(function(){
  window.CoachSession = Object.assign(window.CoachSession || {}, {
    open: function(){ return typeof openGuidedSession === 'function' ? openGuidedSession.apply(this, arguments) : null; },
    close: function(){ return typeof closeGuidedSession === 'function' ? closeGuidedSession.apply(this, arguments) : null; },
    render: function(){ return typeof renderGuidedSession === 'function' ? renderGuidedSession.apply(this, arguments) : null; },
    renderResults: function(){ return typeof renderSessionEntry === 'function' ? renderSessionEntry.apply(this, arguments) : null; },
    collectResults: function(){ return typeof collectSessionResults === 'function' ? collectSessionResults.apply(this, arguments) : {}; },
    setupSave: function(){ return typeof setupSessionSave === 'function' ? setupSessionSave.apply(this, arguments) : null; },
    returnToWod: function(){ return typeof returnFromResultsToWod === 'function' ? returnFromResultsToWod.apply(this, arguments) : null; },
    startTimer: function(){ return typeof startGuidedTimer === 'function' ? startGuidedTimer.apply(this, arguments) : null; },
    pauseTimer: function(){ return typeof pauseGuidedTimer === 'function' ? pauseGuidedTimer.apply(this, arguments) : null; },
    stopTimer: function(){ return typeof stopGuidedTimer === 'function' ? stopGuidedTimer.apply(this, arguments) : null; }
  });
})();
