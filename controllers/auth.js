const electron = require('electron');
const {BrowserWindow} = electron;
const EventEmitter = require('events').EventEmitter;

const Storage = require('../controllers/storage');
const LAPI_KEY = require('../data/config');

var Auth = {

  emitter: new EventEmitter(),

  authenticate: function(parentWindow) {
    let hasAuthToken = Storage.userDb.has('user.authToken').value();
    if (!hasAuthToken) {
      AuthWindows.init(parentWindow);
    } else {
      this.notifySuccess();
    }
  },

  notifySuccess: function() {
    this.emitter.emit("authenticated");
  },
};


var AuthWindows = {
  authWindow: null,
  authUrlPath: `https://ivle.nus.edu.sg/api/login/?apikey=${LAPI_KEY}&url=token`,
  windowProps: {
    width: 400,
    height: 400,
    show: false,
    icon: `${__dirname}/app.ico`,
    parent: null
  },

  init: function(parentWindow) {
    this.windowProps.parent = parentWindow;
    this.authWindow = new BrowserWindow(this.windowProps);
    if (this.authWindow) {

      this.loadAuthPage();
      this.bindEventListener();

    } else {
      console.error("Problem creating auth window");
    }
  },

  bindEventListener: function() {
    let self = this;
    this.authWindow.once('ready-to-show', function() {
      self.authWindow.webContents.insertCSS("body > table {display: none;}");
      self.authWindow.show()
    });

    this.authWindow.webContents.on('did-navigate', handleToken);

    this.authWindow.on('closed', function() {
      this.authWindow = null;
    });
  },

  loadAuthPage: function() {
    this.authWindow.loadURL(this.authUrlPath);
  }
}

function handleToken(event, urlStr) {
  let token = getAuthToken(urlStr);

  if (token) {
    Storage.userDb.set('user.authToken', token).value();

    Auth.notifySuccess();
    AuthWindows.authWindow.hide();
    setTimeout(function(){
      // closing the window too fast may interupt the event emitter
      AuthWindows.authWindow.close();
    }, 800);

  } else if (urlStr !== AuthWindows.authUrlPath) {
    AuthWindows.loadAuthPage();
  }
}

function getAuthToken(urlStr) {
  let token = null;

  if (urlStr.indexOf("token?token=") > -1) {
    let regexStr = /\?token=([0-9a-zA-Z]*)/g;
    let match = regexStr.exec(urlStr);

    token = match[1];
  }
  return token;
}


module.exports = Auth;
