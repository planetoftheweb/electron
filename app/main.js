var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var app = electron.app
var ipc = electron.ipcMain
var appWindow, infoWindow;


var env = process.env.NODE_ENV || 'production';

if (env !== 'production') {
  require('electron-reload')(__dirname);
}

function createWindow () {

  function toggleWindow(whichWindow) {
    if (whichWindow.isVisible()) {
      whichWindow.hide();
    } else {
      whichWindow.show();
    }
  }

  appWindow = new BrowserWindow({});
  infoWindow = new BrowserWindow({
    parent: appWindow,
    width: 400,
    height: 300,
    transparent: true,
    frame: false
  });

  appWindow.loadURL(`file://${__dirname}/index.html`);
  infoWindow.loadURL(`file://${__dirname}/info.html`);

  ipc.on('closeInfoWindow', function (event, arg) {
    event.returnValue = '';
    infoWindow.hide();
  });

  ipc.on('openInfoWindow', function (event, arg) {
    event.returnValue = '';
    infoWindow.show();
  });

  // appWindow.loadURL('http://raybo.org');


  if (env !== 'production') {
    appWindow.webContents.openDevTools()
  }

  var template = [
    { label: 'Wisdom Pet',
      submenu: [
        {role: 'close'},
        {
          label: 'About this App',
          accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
          click (item) {
            toggleWindow(infoWindow);
          }
        },

        { label: 'Add Appoinmtment',
          accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.send('toggleAddEvent')
          }
        },
        {role: 'quit'}
      ]
    },
    { label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'selectall'}
      ]
    },
    { label: 'View',
      submenu: [
        { label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          }
        },
        { label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'},
        {type: 'separator'},
        {
          role: 'help',
          label: `Visit author's Website`,
          click () { electron.shell.openExternal('http://raybo.org') }
        }
      ]
    }
  ]

  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);
