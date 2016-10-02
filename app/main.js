var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var app = electron.app;
var ipc = electron.ipcMain;
var myAppMenu, menuTemplate;

function toggleWindow(whichWindow) {
  if (whichWindow.isVisible()) {
    whichWindow.hide();
  } else {
    whichWindow.show();
  }
}

app.on('ready', function() {
  var appWindow, infoWindow;
  appWindow = new BrowserWindow({
    show: false
  }); //appWindow

  appWindow.loadURL('file://' + __dirname + '/index.html');

  infoWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    show: false,
    frame: false
  }); //infoWindow

  infoWindow.loadURL('file://' + __dirname + '/info.html');

  appWindow.once('ready-to-show', function() {
    appWindow.show();
  }); //ready-to-show

  ipc.on('openInfoWindow', function(event, arg){
    event.returnValue='';
    infoWindow.show();
  }); //closeInfoWindow

  ipc.on('closeInfoWindow', function(event, arg){
    event.returnValue='';
    infoWindow.hide();
  }); //closeInfoWindow

  menuTemplate = [
    {
      label: 'Wisdom Pet',
      submenu: [
        {
          label: 'About this App',
          accelerator: process.platform === 'darwin' ? 'Command+I': 'Ctrl+I',
          click(item) { toggleWindow(infoWindow)}
        },{
          label: 'Add Appointment',
          accelerator: process.platform === 'darwin' ? 'Command+N':'Ctrl+N',
          click(item,focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.send('addAppointment');
          }
        },{
          role: 'help',
          label: 'Our Website',
          click() { electron.shell.openExternal('http://raybo.org')}
        },
        {role: 'close'},
        {role: 'quit'}
      ]
    },{
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'selectall'}
      ]
    },{
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click (item, focusedWindow) {
              if (focusedWindow) focusedWindow.reload()
            }
          },
          {
            label: 'Toggle Developer Tools',
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
          {role: 'togglefullscreen'}
        ]
      },
  ];

  myAppMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(myAppMenu);

}); //app is ready
