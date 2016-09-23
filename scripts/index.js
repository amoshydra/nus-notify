const Parser = require('../controllers/parser');
const request = require('request');
const Mustache = require('mustache');
const JsonWatch = require('jsonwatch');
const dataDbListener = new JsonWatch('./data/datadb.json');
const $ = require("jquery");

var indexView = {
  render: function(announcements) {
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
    $("#loading").hide();

    //attachListener
    $(".js-collapsible-toggle").click(indexView.handleClick);
  },

  handleClick: function() {
    let parentContainer = $(this).parent()[0];
    let $toggler = $(this).next();
    let toggleSpeed = "fast";
    $toggler.slideToggle(toggleSpeed,function(){
      $(parentContainer).toggleClass("is-expanded");
    });
  }
}

Parser.getAnnouncementsFromDB(indexView.render);
dataDbListener.on("cng", function(path, oldData, newData) {
  indexView.render(newData);
});
