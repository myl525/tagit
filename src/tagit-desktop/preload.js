const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

//apis for sides component
contextBridge.exposeInMainWorld('sidesAPIs', {
  openDir: () => ipcRenderer.invoke('dialog: openDir'),
  filterByTag: (filters) => ipcRenderer.invoke('filter-by-tag', filters)
});

//apis for main component
contextBridge.exposeInMainWorld('mainAPIs', {
  reset: () => ipcRenderer.invoke('reset'),
  addFileTag: (files, fileId, newTag) => ipcRenderer.invoke('add-file-tag', {files, fileId, newTag}),
  deleteFileTag: (files, fileId, tag) => ipcRenderer.invoke('delete-file-tag', {files, fileId, tag}),
  searchByFileName: (fileName) => ipcRenderer.invoke('search-by-file-name', fileName)
})
