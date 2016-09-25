const Storage = require('../controllers/storage');
const Requester = require('../controllers/requester');


var DataProcessor = {

  nodeToStore: [
    "CourseCode", "CourseName", "Forums", "Workbins", "Webcasts", "Gradebooks", "Multimedia"
  ],
  serviceToRetrieve: [
    "Announcements", "Webcasts"
  ],

  updateModuleIds: function() {

    return new Promise(function (fulfill, reject) {
      Requester.requestJson("Modules", {
        "Duration": "0",
        "IncludeAllInfo": "true"})
        .then(
          // sucess
          function(data) {
            let modulesObj = filterModuleIds(data);
            storeModulesIds(modulesObj);

            fulfill();
          },

          // error
          function(error) {
            reject(error);
          }
        );
      });
  },

  updateDatabase: function() {

    let courses = Storage.userDb.get("modules").value();

    let elementArray = [];
    let DataTypePromisesArray = [];

    // Loop through all the modules in the database
    for (let course in courses) {

      if (courses.hasOwnProperty(course)) {
        let courseId = course;
        let courseObj = courses[course];

        // for each module, loop through all the ID
        DataProcessor.serviceToRetrieve.forEach(function(dataType) {
          let requestPromise = retrieveData(dataType, courseId, courseObj);
          DataTypePromisesArray.push(requestPromise);
        });
      }
    }

    // Wait until all function is done, then perform
    let count = 0;

    DataTypePromisesArray.forEach(function(dataPromise, index) {
      dataPromise.then(
        function(dataArray) {
          Array.prototype.push.apply(elementArray, dataArray);
          count += 1;

          if (count === (DataTypePromisesArray.length)) { //last element
            finaliseData(elementArray);
          }
        },
        function(error) {
          console.log(`Error processing returned promise: ${error}`);
        }
      );
    });
  }
}


function filterModuleIds(data) {

  let nodesToStore = DataProcessor.nodeToStore;

  let modulesArray = data["Results"];
  let modulesObj = {};

  modulesArray.forEach(function(moduleObj) {

    let moduleInformation = {};
    nodesToStore.forEach(function(nodeName) {
      moduleInformation[String(nodeName)] = moduleObj[String(nodeName)];
    });

    modulesObj[String(moduleObj["ID"])] = moduleInformation;
  });

  return modulesObj;
}

function storeModulesIds(data) {
  Storage.userDb
         .set(`modules`, data)
         .value();
}

var finaliseData = function finaliseData(dataArray) {
  dataArray = formatData(dataArray);
  Storage.dataDb.set("date", Date.now()).value();
  Storage.dataDb.set("list", dataArray).value();
}

var formatData = function formatData(dataArray) {
  return dataArray.sort(function (a, b) {
    if (a.ExpiryDate_js) {
      return (a.ExpiryDate_js < b.ExpiryDate_js) ? 1 : -1;
    } else {
      return (a.CreatedDate_js < b.CreatedDate_js) ? 1 : -1;
    }


  });
}

function retrieveData(dataType, courseId, courseObj) {
  return new Promise(function (fulfill, reject) {
    let requestParams = {
      "Duration": 0,
      "ShowTitleOnly": false,
      "CourseID": courseId
    };

    Requester.requestJson(dataType, requestParams).then(
      // success
      function(data) {
        let dataArray = data["Results"];
        dataArray = handleDataType(dataType, dataArray);
        dataArray = appendIdentifierTag(dataType, courseObj, dataArray);

        fulfill(dataArray);
      },

      // error
      function(error) {
        console.log(`Error requesting ${dataName}`);
        reject(error);
      }
    );
  });
}

function handleDataType(dataType, dataArray) {

  switch (dataType.toLowerCase()) {
    case "webcasts":
      let itemArray = [];

      dataArray.forEach(function(webcastCategory) {
        let itemGroups = webcastCategory["ItemGroups"];

        itemGroups.forEach(function(item) {
          let files = item["Files"];

          files.forEach(function(item) {
            itemArray.push(item);
          });
        });
      });

      return itemArray;
    case "announcement":
    default:
      return dataArray;
  }
}

function appendIdentifierTag(dataType, courseObj, dataArray) {
  dataArray.forEach(function(dataObj) {
    dataObj["CourseCode"] = courseObj["CourseCode"];
    dataObj["CourseName"] = courseObj["CourseName"];
    dataObj["_dataType"] = dataType;
  });

  return dataArray;
}

module.exports = DataProcessor;
