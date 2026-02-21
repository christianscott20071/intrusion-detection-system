const { app, BrowserWindow, ipcMain } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: __dirname + "/preload.js"
    }
  });

  win.loadURL("http://localhost:3000");
  win.webContents.openDevTools();
};

ipcMain.handle("ping-backend", async () => {
  const res = await fetch("http://localhost:8080/api/ping");
  return await res.text();
});

app.whenReady().then(createWindow);
