const electron = require('electron');
const {app, BrowserWindow, shell} = electron;

const Auth = require('./controllers/auth');
const Tray = require('./controllers/tray');
const TaskRunner = require('./controllers/taskRunner');

var isRunningState = true;
var backgroundProcess, mainWindow;


app.on('ready', () => {

  initialiseBrowserWindows();

  Tray.init(mainWindow, backgroundProcess);
  Auth.init(mainWindow);
  Auth.authenticate();
  TaskRunner.init();
  TaskRunner.run();
  bindEventListenerToBrowserWindows();
});


var initialiseBrowserWindows = function initialiseWindows() {
  backgroundProcess = new BrowserWindow({show: false});
  mainWindow = new BrowserWindow({width: 800, height: 600, show: true, icon: `${__dirname}/app.ico`});
  mainWindow.loadURL(`${__dirname}/views/index.html`);
},

bindEventListenerToBrowserWindows = function configureBrowserWindows() {
  // Window event handler and creation
  backgroundProcess.on('closed', function(e) {
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

  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);
},

handleRedirect = function handleRedirect (e, url) {
    if(url != mainWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }
