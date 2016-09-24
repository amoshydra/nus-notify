const low = require("lowdb");
const userDb = low('./data/userdb.json');
const dataDb = low('./data/datadb.json');
const Requester = require('../controllers/requester');
const Parser = require('../controllers/parser');


const TIME_SECOND = 1000;
const TIME_MIN = 60 * TIME_SECOND;
const TIME_HOUR = 60 * TIME_MIN;


var updateLoop = function updateLoop(functionToRun) {
  functionToRun();
  setTimeout(updateLoop, 5 * TIME_MIN, functionToRun);
}

var TaskRunner = {
  init: function() {
    updateModuleIds();
    // Initialise app
    // obtains ids
    // announcements, forum, webcast, files
  },

  run: function() {
    updateLoop(Parser.getAnnouncements);
  }
};

var updateModuleIds = function updateModuleIds() {
  // Obtain data from IVLE
  Requester.requestJson("Modules", {
    "Duration": "0",
    "IncludeAllInfo": "false"
  }).then(
    function(data) {
      let modulesObj = filterModuleIds(data);
      storeModuleIds(modulesObj);
    },
    function(error) {
      console.error(error);
    }
  );

  function filterModuleIds(data) {
    let modulesArray = data["Results"];
    let modulesObj = {};

    modulesArray.forEach(function(moduleObj, index, array) {
      let moduleId = moduleObj["ID"];
      modulesObj[moduleId] = {};
    });

    return modulesObj;
  }

  function storeModuleIds(modulesObj) {
    userDb.set("modules", modulesObj);
  }
}

module.exports = TaskRunner;
