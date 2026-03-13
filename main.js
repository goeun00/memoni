const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let mainWindow;
let memoWindows = new Map();

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 640,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
  }
}

function createMemoWindow(id) {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: 200,
    height: 200,
    x: width - 220,
    y: 100,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL(`http://localhost:5173/memo.html?id=${id}`);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/dist/memo.html"), {
      query: { id },
    });
  }
  win.on("closed", () => {
    memoWindows.delete(id);
    rearrangeFoldedMemos();
  });

  memoWindows.set(id, win);
}

// 접힌 메모들 우측 정렬
function rearrangeFoldedMemos() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const foldedWidth = 140;
  const foldedHeight = 44;
  const gap = 8;

  let index = 0;

  for (const win of memoWindows.values()) {
    if (win.isFolded) {
      win.setBounds({
        width: foldedWidth,
        height: foldedHeight,
        x: width - foldedWidth,
        y: 100 + index * (foldedHeight + gap),
      });
      index++;
    }
  }
}
function foldMemo(id) {
  const win = memoWindows.get(id);
  if (!win) return;
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  win.isFolded = true;
  win.setBounds({
    width: 140, // 타이틀 + 버튼 보일 정도
    height: 44, // 헤더 전체 높이
    x: width - 140,
    y: 100,
  });
  rearrangeFoldedMemos();
}

function expandMemo(id) {
  const win = memoWindows.get(id);
  if (!win) return;
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  win.isFolded = false;
  win.setBounds({
    width: 200,
    height: 200,
    x: width - 220,
    y: 100,
  });

  rearrangeFoldedMemos();
}

// IPC
ipcMain.handle("create-memo", () => {
  const id = Date.now().toString();
  createMemoWindow(id);
  return id;
});
ipcMain.handle("fold-memo", (e, id) => foldMemo(id));
ipcMain.handle("expand-memo", (e, id) => expandMemo(id));

app.whenReady().then(() => {
  createMainWindow();
});
