const remote = require('electron').remote;
const request = require('request');
const low = require("lowdb");
const dataDb = low('./data/datadb.json');
const Requester = require('../controllers/requester');

var Parser = function () {};

// Run two trips to get announcement
Parser.prototype.getAnnouncements = function(callback) {

  // Always get cache version first
  if (this.hasLocalData()) {
    console.log("Requeting locally");
    this.getObjFromDB(callback);
  }

  // Then asynchronously request update from IVLE
  if (!(this.hasLocalData()) || this.hasTimeExceeded(60)) {
    console.log("Requeting remotely");
    this.getDataFromIvle(function(body) {
      let announcements = processJson(body);
      dataDb.set('data.lastUpdate', Date.now()).value();

      console.log("New update found");
      dataDb.set('data.announcements', announcements).value();
      callback(announcements);
    });
  }
}

Parser.prototype.getDataFromIvle = function(callback) {
  let requestObject = {
    Duration: 0,
    IncludeAllInfo: true
  }

  Requester.requestJson("Modules", requestObject, callback);
}

Parser.prototype.getObjFromDB = function(callback) {
  callback(dataDb.get('data.announcements').value());
}

Parser.prototype.getUpdateInterval = function() {
  let lastUpdate = dataDb.get('data.lastUpdate').value();
  let currentTime = Date.now();
  return currentTime - lastUpdate;
}

Parser.prototype.hasTimeExceeded = function(seconds) {
  return this.getUpdateInterval() > (seconds * 1000);
}

Parser.prototype.hasLocalData = function() {
  return dataDb.has('data.announcements').value();
}

function processJson(data) {
  return formatData(extractData(data))
}

function extractData(jsonData) {
  let ivleModules = jsonData["Results"];
  let numOfAnnouncements = 0;
  for (let i = 0; i < ivleModules.length; i++) {
    numOfAnnouncements += ivleModules[i]["Announcements"].length;
  }

  let announcements = new Array(numOfAnnouncements);
  for (let i = 0, k = 0; i < ivleModules.length; i++) {
    let announcementArray = ivleModules[i]["Announcements"];
    for (let j = 0; j < announcementArray.length; j++) {
      announcements[k] = announcementArray[j];
      k++;
    }
  }
  return announcements;
}

function formatData(announcements) {
  return announcements.sort(function (a, b) {
    return (a.CreatedDate_js < b.CreatedDate_js) ? 1 : -1;
  })
}

module.exports = new Parser();
