const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backend", {
  ping: () => ipcRenderer.invoke("ping-backend")
});
