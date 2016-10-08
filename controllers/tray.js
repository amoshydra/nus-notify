const electron = require('electron');
const platform = require('os').platform();

const { Tray, Menu } = electron;

const APP_TITLE = 'Notify';
const ICON_PATH = `${__dirname}/../`;
const ICON_WINDOWS = 'app.ico';
const ICON_OSX = 'app.png';
let mainWindow;
let backgroundProcess;
let tray;

const SysTray = function SysTray() {};

SysTray.prototype.init = function init(_mainWindow, _backgroundProcess) {
  tray = null;
  mainWindow = _mainWindow;
  backgroundProcess = _backgroundProcess;
  setupTray();
};

function setupTray() {
  tray = new Tray(getIconFilepathForPlatform());
  tray.setToolTip(APP_TITLE);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show inbox',
      click() { mainWindow.show(); }
    }, { label: 'Hide inbox',
      click() { mainWindow.hide(); }
    }, { label: 'Exit',
      click() { backgroundProcess.close(); }
    }
  ]); tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

function getIconFilepathForPlatform() {
  let filePath;
  if (platform === 'darwin') {
    filePath = ICON_PATH + ICON_OSX;
  } else if (platform === 'win32') {
    filePath = ICON_PATH + ICON_WINDOWS;
  }
  return filePath;
}

module.exports = new SysTray();
