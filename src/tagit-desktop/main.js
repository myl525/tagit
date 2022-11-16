const { app, BrowserWindow, shell, dialog, ipcMain } = require('electron')
const path = require('path');


// functions
async function handleDirOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog(
        {properties: ['openFile']}
    )
    if(canceled) {
        return;
    }else {
        console.log(filePaths);
        shell.openPath(filePaths[0]);
        return(filePaths);
    }
}

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
    ipcMain.handle('dialog: openDir', handleDirOpen);
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