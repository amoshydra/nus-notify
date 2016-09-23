const low = require("lowdb");
const dataDb = low('./data/datadb.json');
const Requester = require('../controllers/requester');
const Parser = require('../controllers/parser');

const TIME_SECOND = 1000;
const TIME_MIN = 60 * TIME_SECOND;
const TIME_HOUR = 60 * TIME_MIN;

var initialiseDataSet = function initialiseDataSet() {

  // Initialise app
  // obtains ids
  // announcements, forum, webcast, files
}

var retrieveDataSet = function retrieveDataSet() {
  updateLoop(function() {
    console.log("fetching data");
    Parser.getAnnouncements();
  });
}

var updateLoop = function updateLoop(functionToRun) {
  functionToRun();
  setTimeout(requestLoop, 5 * TIME_MIN);
}

var TaskRunner = {
  init: function() {
    initialiseDataSet();
  },

  run: function() {
    retrieveDataSet();
  }

};


module.exports = TaskRunner;
