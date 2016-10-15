const electron = require('electron');
const EventEmitter = require('events').EventEmitter;

const { BrowserWindow } = electron;

const Storage = require('../controllers/storage');
const LAPI_KEY = require('../data/config');

const Auth = {

  emitter: new EventEmitter(),

  authenticate: function authenticate(parentWindow) {
    const hasAuthToken = Storage.user.has('user.authToken');
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
      self.authWindow.webContents.insertCSS(authCSS);
      self.authWindow.show();
    });

    this.authWindow.webContents.on('did-navigate', handleToken);

    this.authWindow.on('closed', () => {
      this.authWindow = null;
    });
  },

  loadAuthPage: function loadAuthPage() {
    this.authWindow.loadURL(this.authUrlPath);
    this.authWindow.setMenu(null);
  }
};

function handleToken(event, urlStr) {
  const token = getAuthToken(urlStr);
  if (token) {
    Storage.user.set('user.authToken', token);

    Auth.notifySuccess();
    AuthWindows.authWindow.hide();
    setTimeout(() => {
      // closing the window too fast may interupt the event emitter
      AuthWindows.authWindow.close();
    }, 800);
  } else if (urlStr !== AuthWindows.authUrlPath) {
    AuthWindows.loadAuthPage();
  }
  AuthWindows.authWindow.webContents.insertCSS(authCSS);
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


const authCSS = `

  * {
    font-family: sans-serif !important;
  }

  body {
    padding-top: 20px;
  }

  body > table,
  #frm > table > tbody > tr:nth-child(1) > td:nth-child(1),
  #frm > table > tbody > tr:nth-child(1) > td:nth-child(2),
  #frm > table > tbody > tr:nth-child(2) > td:nth-child(1),
  #frm > table > tbody > tr:nth-child(2) > td:nth-child(2) {
    display: none;
  }

  #frm > table {
    width: 100%;
  }

  #frm > table > tbody > tr > td {
    text-align: center;
    padding: 4px 10px;
  }

  #password, #userid {
    width: 100%;
    padding: 6px 10px;
    box-sizing: border-box;
    text-align: center;
    margin-bottom: 12px;
    border: none;
    border-bottom: 1px solid rgba(0,0,0,0.2);
    letter-spacing: 0.8px;
  } #password:focus, #userid:focus {
    outline: none;
    border-bottom: 1.8px solid rgba(30,90,150,1);
  }

  #frm > table > tbody > tr:nth-child(1) > td:nth-child(3)::before,
  #frm > table > tbody > tr:nth-child(2) > td:nth-child(3)::before {
    position: absolute;
    opacity: 0.5;
    font-family: sans-serif;
    font-size: 0.9em;
    left: 35px;
    padding-top: 4px;
  }

  #frm > table > tbody > tr:nth-child(3) > td {
    padding: 0;
    font-size: 0.9em;
    color: rgba(255,0,0,0.7);
    top: -10px;
    position: relative;
  }
  #frm > table > tbody > tr:nth-child(3) > td::before {
    position: absolute;
    text-align: center;
    width: 110px;
    left: 0;
    right: 0;
    margin: 50px auto;
    background-color: rgba(30,90,150,1);
    color: white;
    padding: 10p;
    font-size: 1.25em;
    padding: 10px 10px 8px 10px;
    content: "LOGIN";
    font-weight: 500;
    letter-spacing: 1.2px;
    font-family: sans-serif;
  }

  #frm > table > tbody > tr:nth-child(1) > td:nth-child(3)::before {
    content: "Login";
  }
  #frm > table > tbody > tr:nth-child(2) > td:nth-child(3)::before {
    content: "Password";
  }

  #loginimg1 {
    margin-bottom: 40px;
    opacity: 0;
    position: fixed;
    left: 0;
    right: 0;
    margin: auto;
    top: 160px;
    width: 130px;
  }

`;
