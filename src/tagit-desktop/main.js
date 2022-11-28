const { app, BrowserWindow, shell, dialog, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');

/** functions */

// browse directory
function readFilesSync(dir) {
  const files = [];

  fs.readdirSync(dir).forEach(filename => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();

    if(ext){ //file
      files.push({ filepath, name, ext});
    }else if(!isFile){ //directory
      let tempFiles = [];
      tempFiles = readFilesSync(filepath);
      files.push(...tempFiles);
    }
  });

  return files;
}

async function handleDirOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    {properties: ['openDirectory']}
  )
  if(canceled) {
    return;
  }else {
    const files = readFilesSync(filePaths[0]);
    return files;
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