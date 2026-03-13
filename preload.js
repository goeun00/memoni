const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("memoAPI", {
  createMemo: () => ipcRenderer.invoke("create-memo"),
  foldMemo: (id) => ipcRenderer.invoke("fold-memo", id),
  expandMemo: (id) => ipcRenderer.invoke("expand-memo", id),
  bringToFront: (id) => ipcRenderer.invoke("bring-memo-front", id), // ⭐ 추가
});
