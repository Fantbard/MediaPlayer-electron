const { app, BrowserWindow } = require("electron");
const WindowManager = require("./WindowManager");

const windowManager = new WindowManager();

app.whenReady().then(() => {
  windowManager.createWindow(
    "main",
    {
      width: 800,
      height: 600,
      // frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: "./preload.js",
      },
    },
    "http://localhost:5173"
  );

  windowManager.openDevTools("main");

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createWindow(
        "main",
        {
          width: 800,
          height: 600,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
          },
        },
        "http://localhost:5173"
      );
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
