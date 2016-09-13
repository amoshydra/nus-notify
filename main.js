const electron = require('electron');
const {app, BrowserWindow, Tray, Menu, shell} = electron;
const path = require('path');
const low = require('lowdb');
const db = low('./data/userdb.json');

const LAPI_KEY = require('./data/config');
const APP_TITLE = "Notify";

let tray = null;
var isRunningState = true;

app.on('ready', () => {
  // Set up windows
  let backgroundProcess = new BrowserWindow({show: false});
  let mainWindow = new BrowserWindow({width: 800, height: 600, show: true, icon: `${__dirname}/app.ico`});
  let authWindow = new BrowserWindow({width: 400, height: 400, show: false, icon: `${__dirname}/app.ico`, parent: mainWindow});

    // Check variable
  /*
    1. Init
      1. if (auth token) ? pass : retrieve
  */
      let hasAuthToken = db.has('user.authToken').value();
      if (!hasAuthToken) retrieveAuthToken(authWindow);

  /*
      2. Check moduleIds
      3. pass / update / create modulesIds
      4. Download and parse data

    2. Pull update
      1. Download and parse data

  */

  backgroundProcess.on('closed', function(e) {
    tray.destroy();
    isRunningState = false;
    mainWindow.close();
  });

  mainWindow.loadURL(`${__dirname}/views/index.html`);
  mainWindow.on('show', () => {
    mainWindow.setSkipTaskbar(false);
  });
  mainWindow.on('close', (e) => {
    if (isRunningState) {
      e.preventDefault();
      mainWindow.hide();
      mainWindow.setSkipTaskbar(true);
    }
  });

  var handleRedirect = (e, url) => {
  if(url != mainWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }

  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);



  // Set up tray
  tray = new Tray(`${__dirname}/app.ico`);
  tray.setToolTip(APP_TITLE);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show inbox',
      click() { mainWindow.show() }
    },{ label: 'Hide inbox',
      click() { mainWindow.hide() }
    },{ label: 'Exit',
      click() { backgroundProcess.close() }
    }
  ]); tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
})



function retrieveAuthToken(authWindow) {
  authWindow.loadURL(`https://ivle.nus.edu.sg/api/login/?apikey=${LAPI_KEY}&url=token`);
  authWindow.once('ready-to-show', () => {
    authWindow.webContents.insertCSS("body > table {display: none;}");
    authWindow.show()
  })
  authWindow.webContents.on('did-navigate', function (event, urlStr) {
      if (urlStr.indexOf("token?token=") > -1) {
        let regexStr = /\?token=([0-9a-zA-Z]*)/g;
        let match = regexStr.exec(urlStr);

        if (match[1]) {
          db.set('user.authToken', match[1]).value();
          setImmediate(function() {
            authWindow.close();
          });
        } else {
          // TODO: handle possible error
        }
      }
  });
  authWindow.on('closed', function() {
    authWindow = null;
  });
}
