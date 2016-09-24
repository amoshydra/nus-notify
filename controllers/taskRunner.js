const low = require("lowdb");
const Parser = require('../controllers/parser');
const Requester = require('../controllers/requester');

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
    filterModuleIds,
    function(error) {
      console.error(error);
    }
  );

  function filterModuleIds(data) {
    const userDb = low('./data/userdb.json');
    let modulesArray = data["Results"];
    let modules = {};

    modulesArray.forEach(function(moduleObj, index, array) {
        userDb.set(`modules.${moduleObj["ID"]}`, {}).value();
    });
  }
}

module.exports = TaskRunner;
