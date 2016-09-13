const remote = require('electron').remote;
const request = require('request');
const Mustache = require('mustache');
const fs = require('fs');
const $ = require("jquery");
const low = require("lowdb");

const LAPI_KEY = require('../data/config');
const db = low('./data/userdb.json');

const TIME_SECOND = 1000;
const TIME_MIN = 60 * TIME_SECOND;
const TIME_HOUR = 60 * TIME_MIN;

/*
  TODO:
  [] Use MV Framework
  [] Do partial updates
  [] Process webcast, forums, files
  [] Modularise codes
*/


let lapiReq = {
  service: "Modules",
  apikey: LAPI_KEY,
  token: db.get('user.authToken').value(),
  duration: 0,
  allInfo: true
}
let requesturl = `https://ivle.nus.edu.sg/api/Lapi.svc/${lapiReq.service}?APIKey=${lapiReq.apikey}&AuthToken=${lapiReq.token}&Duration=${lapiReq.duration}&IncludeAllInfo=${lapiReq.allInfo}`

function requestData() {
  let nowTime = db.get('data.lastUpdate').value();
  let hasBigTimeDiff = ((Date.now() - nowTime) > (1 * TIME_MIN))
  let hasLocalData = db.has('data.announcements').value();

  if (hasLocalData) {
    console.log("Requesting locally")
    displayData(db.get('data.announcements').value());
  }
  if (!hasLocalData || hasBigTimeDiff) {
    console.log("Requesting remotely")
    request(requesturl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        processAnnouncement(body)
        console.log("done!");
      } else {
        console.log(error);
      }
    })
  }
  setTimeout(requestData, 5 * TIME_MIN);
} requestData();

function processAnnouncement(body) {
  let data = JSON.parse(body)
  let announcements = extractData(data)
  announcements = formatData(announcements)
  db.set('data.lastUpdate', Date.now()).value();
  db.set('data.announcements', announcements).value();
  displayData(announcements);
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
function displayData(announcements) {
  // fetch tbody and row template
  var list = document.getElementById("announcements");
  list.innerHTML = "";

  let template = document.getElementById('announcement').innerHTML;
  Mustache.parse(template);   // optional, speeds up future uses

  for (let i = 0; i < announcements.length; i++) {
    let announcement = announcements[i];
    let htmlStr = Mustache.render(template, announcement);
    let htmlDom = document.createElement('li');
    htmlDom.innerHTML = htmlStr;

    // clone row and insert into table
    list.appendChild(htmlDom);
  }

  //attachListener
  $(".js-collapsible-toggle").click(function() {
    let $toggler = $(this.parentNode.children[1]);
    let toggleSpeed = "fast";

    if ($toggler.css("display") === "none") {
      $(".js-collapsible-target").hide(toggleSpeed);
      $toggler.show(toggleSpeed);
    } else {
      $toggler.hide(toggleSpeed);
    }

  });
}
