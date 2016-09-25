var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var app = electron.app
var infoWindow;
var env = process.env.NODE_ENV || 'production';

if (env !== 'production') {
  require('electron-reload')(__dirname);
}

function createWindow () {
  infoWindow = new BrowserWindow();
  infoWindow.loadURL(`file://${__dirname}/info.html`);
}

app.on('ready', createWindow);
