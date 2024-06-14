const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openURL: (url) => ipcRenderer.send('open-url', url)
});