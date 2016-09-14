const remote = require('electron').remote;
const request = require('request');
const low = require("lowdb");
const db = low('./data/userdb.json');
const LAPI_KEY = require('../data/config');

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
      db.set('data.lastUpdate', Date.now()).value();

      console.log("New update found");
      db.set('data.announcements', announcements).value();
      callback(announcements);
    });
  }
}

Parser.prototype.getDataFromIvle = function(callback) {
  let requesturl = getModulesURL();
  request(requesturl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    } else {
      console.log(error);
    }
  })
}

Parser.prototype.getObjFromDB = function(callback) {
  callback(db.get('data.announcements').value());
}

Parser.prototype.getUpdateInterval = function() {
  let lastUpdate = db.get('data.lastUpdate').value();
  let currentTime = Date.now();
  return currentTime - lastUpdate;
}

Parser.prototype.hasTimeExceeded = function(seconds) {
  return this.getUpdateInterval() > (seconds * 1000);
}

Parser.prototype.hasLocalData = function() {
  return db.has('data.announcements').value();
}

function getModulesURL() {
  let lapiReq = {
    service: "Modules",
    apikey: LAPI_KEY,
    token: db.get('user.authToken').value(),
    duration: 0,
    allInfo: true
  }
  return `https://ivle.nus.edu.sg/api/Lapi.svc/${lapiReq.service}?APIKey=${lapiReq.apikey}&AuthToken=${lapiReq.token}&Duration=${lapiReq.duration}&IncludeAllInfo=${lapiReq.allInfo}`;
}

function processJson(body) {
  let data = JSON.parse(body)
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
