const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backend", {
  ping: () => ipcRenderer.invoke("ping-backend")
});
contextBridge.exposeInMainWorld("api", {
  toggleBackend: (action) => ipcRenderer.invoke("toggle-backend", action)
});