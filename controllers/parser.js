const request = require('request');
const low = require("lowdb");
const dataDb = low('./data/datadb.json');
const Requester = require('../controllers/requester');

var processJson = function processJson(data) {
  return formatData(extractData(data))
},

extractData = function extractData(jsonData) {
  let ivleModules = jsonData["Results"],
      numOfAnnouncements = 0;

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
},

formatData = function formatData(announcements) {
  return announcements.sort(function (a, b) {
    return (a.CreatedDate_js < b.CreatedDate_js) ? 1 : -1;
  })
};


var Parser = {
  getAnnouncements: function() {
      console.log("Requeting remotely");
      this.getAnnouncementsFromIvle(function(body) {
        let announcements = processJson(body);
        dataDb.set('data.lastUpdate', Date.now()).value();

        console.log("New update found");
        dataDb.set('data.announcements', announcements).value();
      });
  },
  //
  getAnnouncementsFromIvle: function(callback) {
    let requestObject = {
      Duration: 0,
      IncludeAllInfo: true
    }
    Requester.requestJson("Modules", requestObject, callback);
  },
  //
  getAnnouncementsFromDB: function(callback) {
    callback(dataDb.get('data.announcements').value());
  },
};

module.exports = Parser;
