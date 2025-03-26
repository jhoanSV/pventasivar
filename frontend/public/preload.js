const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // *Methods for the updating process ************************************************************************************************
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
    onUpdateError: (callback) => ipcRenderer.on('error', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    // *Methods for the print process ************************************************************************************************
    // Method to send the data of the render to the principal process
    send: (channel, data) => {
        // List of allowed channels
        const validChannels = ['print-ticket', 'save-data', 'load-data'];

        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },

    // Method to get data from the principal process
    receive: (channel, func) => {
        const validChannels = ['print-result', 'data-loaded'];

        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },

    // Method to send a message and wait for an answer
    sendSync: (channel, data) => {
        const validChannels = ['get-printer-status'];
        if (validChannels.includes(channel)) {
            return ipcRenderer.sendSync(channel, data);
        }
    },

    // Method to invoke a message asynchronously and obtain a response
    invoke: (channel, data) => {
        const validChannels = ['fetch-data'];
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, data);
        }
    },

    //* Method to open the navigator and go to whatsApp

    openExternalLink: (url) => ipcRenderer.send('open-external-link', url)

});