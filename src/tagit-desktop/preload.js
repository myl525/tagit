const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

//apis for sides component
contextBridge.exposeInMainWorld('sidesAPIs', {
  openDir: () => ipcRenderer.invoke('dialog: openDir'),
});

//apis for main component
contextBridge.exposeInMainWorld('mainAPIs', {
  addFileTag: (files, fileId, newTag) => ipcRenderer.invoke('add-file-tag', {files, fileId, newTag}),
  deleteFileTag: (files, fileId, tag) => ipcRenderer.invoke('delete-file-tag', {files, fileId, tag}),
  searchFile: (filter) => ipcRenderer.invoke('search-file', filter),
  openFile: (filepath) => ipcRenderer.invoke('open-file', filepath)
})
