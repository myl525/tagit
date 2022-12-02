const { app, BrowserWindow, shell, dialog, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');

const MainController = require('./controllers/controller-main.js');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadURL('http://localhost:3000');

  win.webContents.openDevTools()
}

app.whenReady().then(() => {
    ipcMain.handle('dialog: openDir', MainController.handleDirOpen);
    ipcMain.handle('add-file-tag', MainController.handleAddFileTag);
    ipcMain.handle('delete-file-tag', MainController.handleDeleteFileTag);
    ipcMain.handle('search-file', MainController.handleSearchFile);
    ipcMain.handle('open-file', MainController.handleOpenFile);
    createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})