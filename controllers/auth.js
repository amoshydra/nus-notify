const electron = require('electron');
const {BrowserWindow} = electron;
const request = require('request');
const low = require("lowdb");
const db = low('./data/userdb.json');
const LAPI_KEY = require('../data/config');

var Auth = function () {};
let mainWindow, authWindow;

Auth.prototype.init = function(parentWindow) {
  mainWindow = parentWindow;
}

Auth.prototype.authenticate = function() {
  let hasAuthToken = db.has('user.authToken').value();
  if (!hasAuthToken)
    retrieveAuthToken();
}

// Set up profile
function retrieveAuthToken() {
  authWindow = new BrowserWindow({width: 400, height: 400, show: false, icon: `${__dirname}/app.ico`, parent: mainWindow});
  authWindow.loadURL(`https://ivle.nus.edu.sg/api/login/?apikey=${LAPI_KEY}&url=token`);
  authWindow.once('ready-to-show', () => {
    authWindow.webContents.insertCSS("body > table {display: none;}");
    authWindow.show()
  })
  authWindow.webContents.on('did-navigate', function (event, urlStr) {
      checkAuthToken(urlStr);
  });
  authWindow.on('closed', function() {
    authWindow = null;
  });


  function checkAuthToken(urlStr) {
    if (urlStr.indexOf("token?token=") > -1) {
      let regexStr = /\?token=([0-9a-zA-Z]*)/g;
      let match = regexStr.exec(urlStr);

      if (match[1]) {
        db.set('user.authToken', match[1]).value();
        setImmediate(function() {
          authWindow.getParentWindow().reload();
          authWindow.close();
        });
      } else {
        // TODO: handle possible error
      }
    }
  }

}

module.exports = new Auth();
