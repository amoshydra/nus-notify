const $ = require("jquery");
const Mustache = require('mustache');
const JsonWatch = require('jsonwatch');
const dataDbListener = new JsonWatch('./data/datadb.json');
const Storage = require('../controllers/storage');

var indexView = {
  render: function(announcements) {

    if (!announcements || announcement.length <= 0) return;

    // fetch tbody and row template
    var list = document.getElementById("announcements");
    list.innerHTML = "";

    let template = document.getElementById('announcement').innerHTML;
    Mustache.parse(template);   // optional, speeds up future uses

    let templateWebCast = document.getElementById('webcast').innerHTML;
    Mustache.parse(templateWebCast);

    let htmlStr = "";
    for (let i = 0; i < announcements.length; i++) {
      let announcement = announcements[i];
      if (announcement._dataType === "Webcasts" || announcement._dataType === "Multimedia") {
        htmlStr = Mustache.render(templateWebCast, announcement);
      } else {
        htmlStr = Mustache.render(template, announcement);
      }
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

indexView.render(Storage.dataDb.get('list').value());
dataDbListener.on("add", renderAnnouncementsOnAdd);
dataDbListener.on("cng", renderAnnouncementsOnCng);

function renderAnnouncementsOnCng(path, oldData, newData) {
  renderAnnouncementsOnAdd(path, newData);
}

function renderAnnouncementsOnAdd(path, data) {
  if (path === "/list") {
    indexView.render(data);
  }
}
