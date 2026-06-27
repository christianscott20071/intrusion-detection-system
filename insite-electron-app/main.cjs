const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const net = require("net");

let backendProcess = null;

// 🔹 Check if backend is responding on a port
function isBackendAlive(port = 8080) {
  return new Promise((resolve) => {
    const socket = net.connect({ port }, () => {
      socket.end();
      resolve(true);
    });
    socket.on("error", () => resolve(false)); 
  });
}

// 🔹 Stop backend if running
async function stopBackend() {
  if (!backendProcess) {
    const alive = await isBackendAlive();
    if (alive) {
      console.log("Backend is running externally — please kill manually");
      return false;
    }
    return false;
  }

  try {
    // Kill the whole process group
    process.kill(-backendProcess.pid);
    backendProcess = null;
    console.log("Backend stopped");
    return true;
  } catch (err) {
    console.error("Failed to stop backend:", err);
    backendProcess = null;
    return false;
  }
}

// 🔹 Start backend if not already running
async function startBackend() {
  const alive = await isBackendAlive();
  if (alive) {
    console.log("Backend already responding on port 8080");
    return false;
  }

  const jarPath = app.isPackaged
    ? path.join(process.resourcesPath, "backend", "csivproj-1.1-SNAPSHOT.jar")
    : "/Users/christianscott/Documents/Development/CSIV Project/csivproj/backend/target/csivproj-1.1-SNAPSHOT.jar";

  console.log("Starting backend with JAR:", jarPath);

  backendProcess = spawn("java", ["-jar", jarPath], { detached: true });

  backendProcess.stdout.on("data", (data) => console.log(`[Backend] ${data}`));
  backendProcess.stderr.on("data", (data) => console.error(`[Backend ERROR] ${data}`));
  backendProcess.on("close", (code) => {
    console.log(`Backend exited with code ${code}`);
    backendProcess = null;
  });

  backendProcess.on("error", (err) => {
    console.error("Failed to start backend:", err);
    backendProcess = null;
  });

  return true;
}

// 🔹 Create main window
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "dist/index.html"));
  } else {
    win.loadURL("http://localhost:3000");
  }

  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// 🔹 IPC: Start / Stop backend
ipcMain.handle("toggle-backend", async (event, action) => {
  if (action === "start") {
    const started = await startBackend();
    return started ? "started" : "already-running";
  }
  if (action === "stop") {
    const stopped = await stopBackend();
    return stopped ? "stopped" : "no-op";
  }
  return "no-op";
});
//kill backend on exit
app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
process.on('exit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

process.on('SIGINT', () => {
  if (backendProcess) backendProcess.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  if (backendProcess) backendProcess.kill();
  process.exit();
});
// 🔹 IPC: Ping backend
ipcMain.handle("ping-backend", async () => {
  try {
    const res = await fetch("http://localhost:8080/api/ping");
    return await res.text();
  } catch (err) {
    console.error("Ping failed:", err);
    return "offline";
  }
  
});
