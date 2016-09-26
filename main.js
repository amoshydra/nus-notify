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
    let self = this;

    // Window event handler and creation
    self.backgroundProcess.on('closed', function(e) {
      self.isRunningState = false;
      self.mainWindow.close();
    });

    self.mainWindow.on('show', () => {
      self.mainWindow.setSkipTaskbar(false);
    });
    self.mainWindow.on('close', (e) => {
      if (self.isRunningState) {
        e.preventDefault();
        self.mainWindow.hide();
        self.mainWindow.setSkipTaskbar(true);
      }
    });

    self.mainWindow.webContents.on('will-navigate', this.handleRedirect.bind(this));
    self.mainWindow.webContents.on('new-window', this.handleRedirect.bind(this));
  },

  handleRedirect: function(e, url) {
    if(url != this.mainWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }
}
