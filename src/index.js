const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
app.on('ready', () => {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    title: 'tictactoe',
    frame: false,
    icon: path.join(__dirname, 'src/mainWindow/assets/img/icon.png')
  });
  window.loadURL(
    url.format({
      slashes: true,
      protocol: 'file:',
      pathname: path.join(__dirname, 'mainWindow/mainWindow.html')
  }));
})