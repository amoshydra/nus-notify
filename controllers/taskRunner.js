const DataProcessor = require('../controllers/dataProcessor');

const TIME_SECOND = 1000;
const TIME_MIN = 60 * TIME_SECOND;
// const TIME_HOUR = 60 * TIME_MIN;

const UPDATE_INTERVAL = 5 * TIME_MIN;

const TaskRunner = {
  init: function init() {
    DataProcessor.updateModuleIds().then(() => {
      updateLoop(DataProcessor.updateDatabase);
      return;
    }).catch((error) => {
      console.error(error);
    });
  },
};

const updateLoop = function updateLoop(functionToRun) {
  functionToRun();
  setTimeout(updateLoop, UPDATE_INTERVAL, functionToRun);
};

module.exports = TaskRunner;
