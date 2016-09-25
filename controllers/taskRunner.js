const DataProcessor = require('../controllers/dataProcessor');

const TIME_SECOND = 1000;
const TIME_MIN = 60 * TIME_SECOND;
const TIME_HOUR = 60 * TIME_MIN;

const UPDATE_INTERVAL = 5 * TIME_MIN;

var TaskRunner = {
  init: function() {
    DataProcessor.updateModuleIds().then(
      // success
      function() {
        // poll data
        updateLoop(DataProcessor.updateDatabase);
      },

      // error
      function(error) {
        console.error(error);
      }
    );
  },
};

var updateLoop = function updateLoop(functionToRun) {
  functionToRun();
  setTimeout(updateLoop, UPDATE_INTERVAL, functionToRun);
}

module.exports = TaskRunner;
