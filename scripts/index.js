const $ = require('jquery');
const Mustache = require('mustache');
const JsonWatch = require('jsonwatch');
const Storage = require('../controllers/storage');

const dataDbListener = new JsonWatch('./data/datadb.json');

const indexView = {
  render: function render(announcements) {
    if (!announcements || announcements.length <= 0) return;

    // fetch tbody and row template
    const list = document.getElementById('announcements');
    list.innerHTML = '';

    const template = document.getElementById('announcement').innerHTML;
    Mustache.parse(template);   // optional, speeds up future uses

    const templateWebCast = document.getElementById('webcast').innerHTML;
    Mustache.parse(templateWebCast);

    let htmlStr = '';
    for (let i = 0; i < announcements.length; i++) {
      const announcement = announcements[i];
      if (announcement.dataType === 'Webcasts' || announcement.dataType === 'Multimedia') {
        htmlStr = Mustache.render(templateWebCast, announcement);
      } else {
        htmlStr = Mustache.render(template, announcement);
      }
      const htmlDom = document.createElement('li');
      htmlDom.innerHTML = htmlStr;

      // clone row and insert into table
      list.appendChild(htmlDom);
    }
    $('#loading').hide();

    // attachListener
    $('.js-collapsible-toggle').click(indexView.handleClick);
  },

  handleClick: function handleClick() {
    const parentContainer = $(this).parent()[0];
    const $toggler = $(this).next();
    const toggleSpeed = 'fast';
    $toggler.slideToggle(toggleSpeed, () => {
      $(parentContainer).toggleClass('is-expanded');
    });
  }
};

indexView.render(Storage.dataDb.get('list').value());
dataDbListener.on('add', renderAnnouncementsOnAdd);
dataDbListener.on('cng', renderAnnouncementsOnCng);

function renderAnnouncementsOnCng(path, oldData, newData) {
  renderAnnouncementsOnAdd(path, newData);
}

function renderAnnouncementsOnAdd(path, data) {
  if (path === '/list') {
    indexView.render(data);
  }
}
