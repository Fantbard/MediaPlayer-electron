const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");

class WindowManager {
  constructor() {
    this.windows = new Map();
    this.windowStates = new Map();
    this.setupIPC();
  }

  /**
   * 创建窗口（支持透明和点击穿透）
   * @param {string} id - 窗口ID
   * @param {object} options - 支持透明窗口的特殊配置：
   *   - `transparent: boolean` (是否透明)
   *   - `clickThrough: boolean` (是否点击穿透)
   *   - 其他标准Electron窗口配置
   * @param {string} url - 加载的URL
   */
  createWindow(id, options = {}, url = "") {
    if (this.windows.has(id)) {
      this.focusWindow(id);
      return this.windows.get(id);
    }

    const defaultOptions = {
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        preload: path.join(__dirname, "preload.js"),
      },
    };

    // 透明窗口特殊配置
    if (options.transparent) {
      Object.assign(defaultOptions, {
        transparent: true,
        frame: false, // 无边框
        resizable: false, // 透明窗口通常不可调整大小
        backgroundColor: "#00000000", // 必须设置为完全透明
      });
    }

    const win = new BrowserWindow({ ...defaultOptions, ...options });

    // 点击穿透配置（需在窗口显示后设置）
    if (options.clickThrough) {
      win.on("ready-to-show", () => {
        win.setIgnoreMouseEvents(true); // 启用点击穿透
      });
    }

    // 恢复窗口状态
    if (this.windowStates.has(id)) {
      win.setBounds(this.windowStates.get(id));
    }

    // 加载页面
    if (url) {
      url.startsWith("http") ? win.loadURL(url) : win.loadFile(url);
    }

    // 窗口事件监听
    win.once("ready-to-show", () => win.show());
    win.on("closed", () => this.cleanupWindow(id));
    win.on("close", () => this.saveWindowState(id, win));

    this.windows.set(id, win);
    return win;
  }

  /**
   * 动态切换点击穿透
   * @param {string} id - 窗口ID
   * @param {boolean} enable - 是否启用点击穿透
   */
  setClickThrough(id, enable) {
    const win = this.windows.get(id);
    if (win && !win.isDestroyed()) {
      win.setIgnoreMouseEvents(enable);
    }
  }

  /**
   * 设置窗口透明度
   * @param {string} id - 窗口ID
   * @param {number} opacity - 透明度 (0.0 ~ 1.0)
   */
  setWindowOpacity(id, opacity) {
    const win = this.windows.get(id);
    if (win) win.setOpacity(Math.min(1, Math.max(0, opacity)));
  }

  /**
   * 保存窗口状态
   * @param {string} id - 窗口ID
   * @param {BrowserWindow} win - 窗口实例
   */
  saveWindowState(id, win) {
    if (win && !win.isDestroyed()) {
      this.windowStates.set(id, win.getBounds());
    }
  }

  /**
   * 清理窗口资源
   * @param {string} id - 窗口ID
   */
  cleanupWindow(id) {
    this.windows.delete(id);
    this.windowStates.delete(id);
  }

  /**
   * 聚焦窗口
   * @param {string} id - 窗口ID
   */
  focusWindow(id) {
    const win = this.windows.get(id);
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  }

  /**
   * 关闭窗口
   * @param {string} id - 窗口ID
   */
  closeWindow(id) {
    const win = this.windows.get(id);
    if (win) win.close();
  }

  /**
   * 最小化窗口
   * @param {string} id - 窗口ID
   */
  minimizeWindow(id) {
    const win = this.windows.get(id);
    if (win) win.minimize();
  }

  /**
   * 切换最大化
   * @param {string} id - 窗口ID
   */
  toggleMaximize(id) {
    const win = this.windows.get(id);
    if (win) win.isMaximized() ? win.unmaximize() : win.maximize();
  }

  /**
   * 居中窗口
   * @param {string} id - 窗口ID
   */
  centerWindow(id) {
    const win = this.windows.get(id);
    if (win) win.center();
  }

  /**
   * 扩展IPC通信（新增透明窗口控制）
   */
  setupIPC() {
    ipcMain.handle("window:action", (event, { action, id, ...args }) => {
      switch (action) {
        case "create":
          return this.createWindow(id, ...args);
        case "set-click-through":
          return this.setClickThrough(id, args.enable);
        case "set-opacity":
          return this.setWindowOpacity(id, args.opacity);
        case "close":
          return this.closeWindow(id);
        case "minimize":
          return this.minimizeWindow(id);
        case "maximize":
          return this.toggleMaximize(id);
        case "center":
          return this.centerWindow(id);
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    });
  }

  /**
   * 获取所有窗口ID
   * @returns {string[]}
   */
  getWindowIds() {
    return Array.from(this.windows.keys());
  }

  /**
   * 打开指定窗口开发者工具
   * @param {string} id - 窗口ID
   */
  openDevTools(id) {
    const win = this.windows.get(id);
    if (win) win.webContents.openDevTools();
  }
}

module.exports = WindowManager;
