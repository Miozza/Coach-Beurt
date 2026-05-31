// Coach Bertin V48.0 — configuration programme extraite de app.js
// Ne contient pas de données personnelles vivantes comme resultats.json.

var defaultProfile = {bench:300,frontSquat:215,strictPress:185,powerClean:225,backSquat5RM:235,hipThrust8RM:315,bulgarianDb:50,dbRdl:70,row8RM:185,chestRow8RM:160,latPulldown10RM:140,inclineDb10RM:55};

var movements = {
  bench:        {name:"Bench press",           profile:"bench"},
  inclineDb:    {name:"Incline DB press",       profile:"inclineDb10RM"},
  strictPress:  {name:"Strict press",           profile:"strictPress"},
  chestRow:     {name:"Chest-supported row",    profile:"chestRow8RM"},
  barbellRow:   {name:"Barbell row",            profile:"row8RM"},
  latPulldown:  {name:"Weighted pull-up",       profile:null},
  frontSquat:   {name:"Front squat",            profile:"frontSquat"},
  backSquat:    {name:"Back Squat",             profile:"backSquat5RM"},
  hipThrust:    {name:"Hip thrust",             profile:"hipThrust8RM"},
  bulgarian:    {name:"Bulgarian split squat",  profile:"bulgarianDb"},
  powerClean:   {name:"Power clean",            profile:"powerClean"},
  dbSnatch:     {name:"DB snatch",              profile:null},
  farmerCarry:  {name:"Farmer carry",           profile:null},
  lateralRaise: {name:"Lateral raise",          profile:null},
  rearDeltFly:  {name:"Rear delt fly",          profile:null},
  ropePushdown: {name:"Triceps rope pushdown",  profile:null},
  facePull:     {name:"Face pull",              profile:null},
  pushPress:    {name:"Push press léger",        profile:"strictPress"}
};

var estimatedDailyLoads = {lateralRaise:25,rearDeltFly:25,ropePushdown:70,facePull:70,latPulldown:20,dbSnatch:50,farmerCarry:50};

var baseDays = {
  lundi:   {label:"Lundi",   base:"Push",      focus:"Pectoraux, épaules, triceps, serratus.", progress:["bench","inclineDb"],      warmup:"Bike 3 min + band pull-aparts + wall slides + activation serratus.", accessory:"Incline DB press + lateral raise + serratus cable punch.", wod:"10 cal row + 10 DB push press léger + 8 burpees"},
  mardi:   {label:"Mardi",   base:"Pull",      focus:"Dos, biceps, scapula, posture.",         progress:["chestRow","latPulldown"], warmup:"Row 3 min + dead hang + scap pull-ups + band rows.", accessory:"Weighted pull-up + face pull + DB curls.", wod:"12 cal SkiErg + 12 ring rows stricts"},
  jeudi:   {label:"Jeudi",   base:"Legs",      focus:"Jambes, fessiers, chaîne postérieure.",  progress:["frontSquat","bulgarian"], warmup:"Bike 3 min + air squats + glute bridge + mobilité hanches.", accessory:"Bulgarian split squat + DB RDL.", wod:"12 cal bike + 12 KB swings + 10 box step-ups"},
  vendredi:{label:"Vendredi",base:"Full body", focus:"Moteur, transitions, puissance.",         progress:["powerClean","strictPress"],warmup:"Row 3 min + mobilité hanches/épaules + ramp-up technique.", accessory:"Farmer carry + reverse fly + hollow hold.", wod:"30 wall balls + 30 cal row + 30 DB snatch alternés"}
};

var wodBanks = {
  push:         ["10 cal row + 10 DB push press + 8 burpees","12 cal row + 10 push-ups + 12 sit-ups","10 cal bike + 8 DB thrusters + 8 burpees"],
  pull:         ["12 cal SkiErg + 12 ring rows","10 cal row + 10 KB high pulls + 10 ring rows","40 cal row + 30 ring rows + 20 DB snatch"],
  legs:         ["12 cal bike + 12 KB swings + 10 box step-ups","14 cal bike + 12 goblet squats","50 cal bike + 40 KB swings + 30 step-ups"],
  weightlifting:["EMOM 10 : 2 power cleans légers","10 min qualité : 3 hang power clean + 6 burpees","8 min technique : clean pull + front squat léger"],
  engine:       ["AMRAP 14 : 10 wall balls + 12 cal row + 8 DB snatch","EMOM 16 : row/bike/ski/bodyweight","12 min pacing : bike + step-ups + ring rows"],
  lowimpact:    ["10 min bike zone 2","10 min row zone 2","AMRAP facile : 8 cal row + 8 air squats + 8 ring rows"]
};
