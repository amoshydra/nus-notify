;
const electron = require('electron');
const {Tray, Menu} = electron;

const APP_TITLE = "Notify";
const ICON_PATH = `${__dirname}/../app.ico`;
let mainWindow, backgroundProcess, tray;

var SysTray = function () {};

SysTray.prototype.init = function(_mainWindow, _backgroundProcess) {
  tray = null;
  mainWindow = _mainWindow;
  backgroundProcess = _backgroundProcess;
  setupTray();
}

function setupTray() {
  tray = new Tray(ICON_PATH);
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

module.exports = new SysTray();
