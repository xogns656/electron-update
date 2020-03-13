// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

console.log(autoUpdater.checkForUpdatesAndNotify());
let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
  mainWindow.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

autoUpdater.on("update-available", () => {
  console.log("update_available");
  mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  console.log("update-downloaded");
  mainWindow.webContents.send("update_downloaded");
});

autoUpdater.on("download-progress", function(
  bytesPerSecond,
  percent,
  total,
  transferred
) {
  console.log(`${bytesPerSecond}, ${percent}, ${total}, ${transferred}`);
  contents.send(
    "updater-message",
    `download progress : ${bytesPerSecond}, ${percent}, ${total}, ${transferred}`
  );
});

ipcMain.on("app_version", event => {
  event.sender.send("app_version", { version: app.getVersion() });
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
