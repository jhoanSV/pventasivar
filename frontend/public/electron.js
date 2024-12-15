// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { autoUpdater, AppUpdater } = require("electron-updater");
const path = require("path");
const log = require("electron-log");
/*const express = require("express");
const cors = require("cors");
const localServerApp = express();
const PORT = 8088;*/

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

/*const startLocalServer = (done) => {
  localServerApp.use(express.json({ limit: "100mb" }));
  localServerApp.use(cors());
  localServerApp.use(express.static('./build/'));
  localServerApp.listen(PORT, async () => {
    console.log("Server Started on PORT ", PORT);
    done();
  });
};*/

let mainWindow

function createWindow() {
  // Create the browser window.

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 750,
    minWidth: 783,
    minHeight: 590,//750 x 422 mins
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../build', 'index.html'));
  //mainWindow.loadURL("http://localhost:" + PORT);
  //a mainWindow.loadURL("http://localhost:" + PORT);
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

ipcMain.on('open-external-link', (event, url) => {
  shell.openExternal(url); // Abre el navegador con el enlace proporcionado
});

//* For the print command ********************************
// Handle printing request from renderer process
ipcMain.on('print-ticket', (event, ticketHTML) => {
  const printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  // Load the HTML content into the hidden window
  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(ticketHTML)}`);

  // Print the content once it's fully loaded
  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print({
      silent: true, // Impresión en silencio, sin diálogo emergente
      printBackground: true // Para imprimir con fondo, si lo hay
    }, () => {
      // Una vez impreso, cerrar la ventana invisible
      printWindow.close();
    });
  });
});


// Maneja la apertura de nuevas ventanas
/*ipcMain.handle('open-new-window', (event, link) => {
  const newWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          contextIsolation: true,
      },
  });

  newWindow.loadURL(link); // Abre el link proporcionado
});*/


//* For the update process ********************************
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  //startLocalServer(createWindow);
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  if (app.isPackaged) {
    autoUpdater.checkForUpdates();
    log.info("Verifying updates...");
  } else {
    log.info("Application in development mode. Skipping update verification.");
    mainWindow.webContents.send('update-not-available');
  }
});

autoUpdater.on("update-available", (info) => {
  log.info('update available');
  let pth = autoUpdater.downloadUpdate();
  log.info(pth);
  mainWindow.webContents.send('update-available');
});

autoUpdater.on("update-not-available", (info) => {
  log.info('no updates');
  mainWindow.webContents.send('update-not-available');
});

autoUpdater.on("error", (info) => {
  log.info(info);
  mainWindow.webContents.send('error');
})

autoUpdater.on("update-downloaded", (info) => {
  mainWindow.webContents.send('downloaded');
  autoUpdater.quitAndInstall(true, true);
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

