const electron = require('electron');
const {app, BrowserWindow, shell} = electron;

const Auth = require('./controllers/auth');
const Tray = require('./controllers/tray');

var isRunningState = true;

app.on('ready', () => {
  // Set up windows
  let backgroundProcess = new BrowserWindow({show: false});
  let mainWindow = new BrowserWindow({width: 800, height: 600, show: true, icon: `${__dirname}/app.ico`});
  mainWindow.loadURL(`${__dirname}/views/index.html`);

  // Process
  Tray.init(mainWindow, backgroundProcess);
  Auth.init(mainWindow);
  Auth.authenticate();

  /*
      2. Check moduleIds
      3. pass / update / create modulesIds
      4. Download and parse data

    2. Pull update
      1. Download and parse data

  */

  // Window event handler and creation
  backgroundProcess.on('closed', function(e) {
    tray.destroy();
    isRunningState = false;
    mainWindow.close();
  });

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


})
