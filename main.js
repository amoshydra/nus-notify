const electron = require('electron');
const {app, BrowserWindow, shell} = electron;

const Auth = require('./controllers/auth');
const Tray = require('./controllers/tray');
const TaskRunner = require('./controllers/taskRunner');

app.on('ready', () => {
  AppWindows.init();

  Tray.init(AppWindows.mainWindow, AppWindows.backgroundProcess);

  Auth.emitter.once("authenticated", function() {
    TaskRunner.init();
    TaskRunner.run();
  });
  Auth.authenticate(AppWindows.mainWindow);
});


var AppWindows = {
  backgroundProcess: null,
  mainWindow: null,
  isRunningState: true,

  init: function() {
    this.backgroundProcess = new BrowserWindow({show: false});
    this.mainWindow = new BrowserWindow({width: 800, height: 600, show: true, icon: `${__dirname}/app.ico`});
    this.mainWindow.loadURL(`${__dirname}/views/index.html`);

    this.bindEventListener();
  },

  bindEventListener: function() {
    // Window event handler and creation
    this.backgroundProcess.on('closed', function(e) {
      this.isRunningState = false;
      this.mainWindow.close();
    });

    this.mainWindow.on('show', () => {
      this.mainWindow.setSkipTaskbar(false);
    });
    this.mainWindow.on('close', (e) => {
      if (this.isRunningState) {
        e.preventDefault();
        this.mainWindow.hide();
        this.mainWindow.setSkipTaskbar(true);
      }
    });

    this.mainWindow.webContents.on('will-navigate', this.handleRedirect.bind(this));
    this.mainWindow.webContents.on('new-window', this.handleRedirect.bind(this));
  },

  handleRedirect: function(e, url) {
    if(url != this.mainWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }
}
