const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setResolution: (title) => ipcRenderer.send('setResolution', title)
})
