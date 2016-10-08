const Storage = require('../controllers/storage');
const Requester = require('../controllers/requester');


const DataProcessor = {

  nodeToStore: [
    'CourseCode', 'CourseName', 'Forums', 'Workbins', 'Webcasts', 'Gradebooks', 'Multimedia'
  ],
  serviceToRetrieve: [
    'Announcements', 'Webcasts', 'Multimedia'
  ],

  updateModuleIds: function updateModuleIds() {
    return Requester.requestJson('Modules', {
      Duration: '0',
      IncludeAllInfo: 'true' })
      .then((data) => {
        const modulesObj = filterModuleIds(data);
        storeModulesIds(modulesObj);
        return modulesObj;
      }).catch((error) => {
        console.error(`Error requesting for module ids. ${error}`);
      });
  },

  updateDatabase: function updateDatabase() {
    const courses = Storage.userDb.get('modules').value();

    const elementArray = [];
    const DataTypePromisesArray = [];

    // Loop through all the modules in the database
    for (const course in courses) {
      if ({}.hasOwnProperty.call(courses, course)) {
        const courseId = course;
        const courseObj = courses[course];

        // for each module, loop through all the ID
        DataProcessor.serviceToRetrieve.forEach((dataType) => {
          const requestPromise = retrieveData(dataType, courseId, courseObj);
          DataTypePromisesArray.push(requestPromise);

          requestPromise.then((dataArray) => {
            Array.prototype.push.apply(elementArray, dataArray);
            return dataArray;
          }).catch((error) => {
            console.error(`Error processing returned promise: ${error}`);
          });
        });
      }
    }

    // Wait until all function is done, then perform
    Promise.all(DataTypePromisesArray).then(() =>
      finaliseData(elementArray)
    ).catch();
  }
};


function filterModuleIds(data) {
  const nodesToStore = DataProcessor.nodeToStore;

  const modulesArray = data.Results;
  const modulesObj = {};

  modulesArray.forEach((moduleObj) => {
    const moduleInformation = {};
    nodesToStore.forEach((nodeName) => {
      moduleInformation[String(nodeName)] = moduleObj[String(nodeName)];
    });

    modulesObj[String(moduleObj.ID)] = moduleInformation;
  });

  return modulesObj;
}

function storeModulesIds(data) {
  Storage.userDb
         .set('modules', data)
         .value();
}

const finaliseData = function finaliseData(dataArray) {
  dataArray = formatData(dataArray);
  Storage.dataDb.set('date', Date.now()).value();
  Storage.dataDb.set('list', dataArray).value();
};

const formatData = function formatData(dataArray) {
  return dataArray.sort((a, b) => {
    let aSort = (a.CreatedDate_js) ? 'CreatedDate_js' : 'CreateDate_js';
    let bSort = (b.CreatedDate_js) ? 'CreatedDate_js' : 'CreateDate_js';
    aSort = (a.ExpiryDate_js) ? 'ExpiryDate_js' : aSort;
    bSort = (b.ExpiryDate_js) ? 'ExpiryDate_js' : bSort;

    return (a[aSort] < b[bSort]) ? 1 : -1;
  });
};

function retrieveData(dataType, courseId, courseObj) {
  return new Promise((resolve, reject) => {
    const requestParams = {
      Duration: 0,
      ShowTitleOnly: false,
      CourseID: courseId
    };

    Requester.requestJson(dataType, requestParams).then((data) => {
      let dataArray = data.Results;
      dataArray = handleDataType(dataType, dataArray);
      dataArray = appendIdentifierTag(dataType, courseObj, dataArray);
      resolve(dataArray);
      return dataArray;
    }).catch((error) => {
      console.error(`Error requesting ${dataType}`);
      reject(error);
    });
  });
}

function handleDataType(dataType, dataArray) {
  switch (dataType.toLowerCase()) {
    case 'webcasts': {
      const itemArray = [];

      dataArray.forEach((webcastCategory) => {
        const itemGroups = webcastCategory.ItemGroups;

        itemGroups.forEach((item) => {
          const files = item.Files;

          files.forEach((file) => {
            file.ChannelID = webcastCategory.ID;
            itemArray.push(file);
          });
        });
      });

      return itemArray;
    }
    case 'multimedia': {
      const itemArray = [];
      dataArray.forEach((webcastCategory) => {
        const files = webcastCategory.Files;
        files.forEach((item) => {
          item.ChannelID = webcastCategory.ID;
          itemArray.push(item);
        });
      });

      return itemArray;
    }
    case 'announcement': // fallthrough
    default:
      return dataArray;
  }
}

function appendIdentifierTag(dataType, courseObj, dataArray) {
  dataArray.forEach((dataObj) => {
    dataObj.CourseCode = courseObj.CourseCode;
    dataObj.CourseName = courseObj.CourseName;
    dataObj.dataType = dataType;
  });

  return dataArray;
}

module.exports = DataProcessor;
