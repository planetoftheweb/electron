var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var app = electron.app;


app.on('ready', function() {
  var appWindow;
  appWindow = new BrowserWindow();
  appWindow.loadURL('http://raybo.org');
});
