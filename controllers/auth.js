const electron = require('electron');
const EventEmitter = require('events').EventEmitter;

const { BrowserWindow } = electron;

const Storage = require('../controllers/storage');
const LAPI_KEY = require('../data/config');

const Auth = {

  emitter: new EventEmitter(),

  authenticate: function authenticate(parentWindow) {
    const hasAuthToken = Storage.user.db.has('user.authToken').value();
    if (!hasAuthToken) {
      AuthWindows.init(parentWindow);
    } else {
      this.notifySuccess();
    }
  },

  notifySuccess: function notifySuccess() {
    this.emitter.emit('authenticated');
  },
};


const AuthWindows = {
  authWindow: null,
  authUrlPath: `https://ivle.nus.edu.sg/api/login/?apikey=${LAPI_KEY}&url=token`,
  windowProps: {
    width: 400,
    height: 400,
    show: false,
    icon: `${__dirname}/app.ico`,
    parent: null
  },

  init: function init(parentWindow) {
    this.windowProps.parent = parentWindow;
    this.authWindow = new BrowserWindow(this.windowProps);
    if (this.authWindow) {
      this.loadAuthPage();
      this.bindEventListener();
    } else {
      console.error('Problem creating auth window');
    }
  },

  bindEventListener: function bindEventListener() {
    const self = this;
    this.authWindow.once('ready-to-show', () => {
      self.authWindow.webContents.insertCSS('body > table {display: none;}');
      self.authWindow.show();
    });

    this.authWindow.webContents.on('did-navigate', handleToken);

    this.authWindow.on('closed', () => {
      this.authWindow = null;
    });
  },

  loadAuthPage: function loadAuthPage() {
    this.authWindow.loadURL(this.authUrlPath);
  }
};

function handleToken(event, urlStr) {
  const token = getAuthToken(urlStr);

  if (token) {
    Storage.user.db.set('user.authToken', token).value();

    Auth.notifySuccess();
    AuthWindows.authWindow.hide();
    setTimeout(() => {
      // closing the window too fast may interupt the event emitter
      AuthWindows.authWindow.close();
    }, 800);
  } else if (urlStr !== AuthWindows.authUrlPath) {
    AuthWindows.loadAuthPage();
  }
}

function getAuthToken(urlStr) {
  let token = null;

  if (urlStr.indexOf('token?token=') > -1) {
    const regexStr = /\?token=([0-9a-zA-Z]*)/g;
    const match = regexStr.exec(urlStr);

    token = match[1];
  }
  return token;
}


module.exports = Auth;
