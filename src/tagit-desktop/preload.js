const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

//apis for sides component
contextBridge.exposeInMainWorld('sidesAPIs', {
  openDir: () => ipcRenderer.invoke('dialog: openDir')
});

//apis for main component
contextBridge.exposeInMainWorld('mainAPIs', {
  addFileTag: (fileId, newTag) => ipcRenderer.send('add-file-tag', {fileId, newTag})
})
