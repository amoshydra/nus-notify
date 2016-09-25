const electron = require('electron');
const {Tray, Menu} = electron;
const platform = require('os').platform();

const APP_TITLE = "Notify";
const ICON_PATH = `${__dirname}/../`;
const ICON_WINDOWS = 'app.ico';
const ICON_OSX = 'app.png';
let mainWindow, backgroundProcess, tray;

var SysTray = function () {};

SysTray.prototype.init = function(_mainWindow, _backgroundProcess) {
  tray = null;
  mainWindow = _mainWindow;
  backgroundProcess = _backgroundProcess;
  setupTray();
}

function setupTray() {
  tray = new Tray(getIconFilepathForPlatform());
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
}

function getIconFilepathForPlatform() {
  var filePath = undefined;
  if (platform === 'darwin') {  
    filePath = ICON_PATH + ICON_OSX;
  }
  else if (platform === 'win32') {  
    filePath = ICON_PATH + ICON_WINDOWS;
  }
  return filePath;
}

module.exports = new SysTray();
