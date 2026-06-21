// Coach Beurt V51.63 - local state storage domain
(function(){
  var api = window.CoachState = window.CoachState || {};
  var STATE_KEY = "coachBertinState";
  var LEGACY_STATE_KEYS = ["coachBertinV46", "coachBertinV43", "coachBertinV41"];
  var CHARGE_KEY = "coachBertinCustomCharges";
  var LEGACY_CHARGE_KEYS = ["coachBertinCustomChargesV46"];

  function readFirst(keys){
    for(var i = 0; i < keys.length; i++){
      var key = keys[i];
      var raw = localStorage.getItem(key);
      if(raw !== null && raw !== undefined && raw !== "") return {key:key, raw:raw};
    }
    return null;
  }

  function readJson(keys){
    var found = readFirst(keys);
    if(!found) return {key:null, raw:"", data:null, migrated:false};
    try{
      return {key:found.key, raw:found.raw, data:JSON.parse(found.raw), migrated:found.key !== keys[0]};
    }catch(e){
      return {key:found.key, raw:found.raw, data:null, migrated:false, error:e};
    }
  }

  function writeJson(key, value){
    localStorage.setItem(key, JSON.stringify(value || {}));
  }

  api.readState = function(){ return readJson([STATE_KEY].concat(LEGACY_STATE_KEYS)); };
  api.writeState = function(state){ writeJson(STATE_KEY, state); };
  api.readCustomCharges = function(){ return readJson([CHARGE_KEY].concat(LEGACY_CHARGE_KEYS)); };
  api.writeCustomCharges = function(charges){ writeJson(CHARGE_KEY, charges); };
  api.storageKeys = {
    state: STATE_KEY,
    stateLegacy: LEGACY_STATE_KEYS.slice(),
    customCharges: CHARGE_KEY,
    customChargesLegacy: LEGACY_CHARGE_KEYS.slice()
  };
})();
