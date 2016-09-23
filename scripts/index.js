;
const Parser = require('../controllers/parser');
const request = require('request');
const Mustache = require('mustache');
const $ = require("jquery");

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

function requestLoop() {
  Parser.getAnnouncements(displayData);
  setTimeout(requestLoop, 5 * TIME_MIN);
} requestLoop();


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
    $("#loading").hide();
  }

  //attachListener
  $(".js-collapsible-toggle").click(function() {
    let parentContainer = $(this).parent()[0];
    let $toggler = $(this).next();
    let toggleSpeed = "fast";
    $toggler.slideToggle(toggleSpeed,function(){
      $(parentContainer).toggleClass("is-expanded");
    })
  });
}
