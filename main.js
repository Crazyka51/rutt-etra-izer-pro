const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const os = require('os');

// Set custom cache path to temp directory to avoid permission issues
const cachePath = path.join(os.tmpdir(), 'rutt-etra-cache');
app.setPath('userData', cachePath);

// Disable cache to avoid errors
app.commandLine.appendSwitch('--disable-http-cache');
app.commandLine.appendSwitch('--disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('--disk-cache-size', '0');
app.commandLine.appendSwitch('--max-old-space-size=8192'); // Zvýšení na 8GB
app.commandLine.appendSwitch('--js-flags', '--expose-gc'); // Povolit garbage collection

function createWindow() {
  // Vytvoření okna prohlížeče
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowFileAccessFromFileURLs: true,
      sandbox: false
    },
  });

  // Načtení index.html
  mainWindow.loadFile('index.html');

  // Otevření DevTools (volitelné, pro debugging)
  // mainWindow.webContents.openDevTools();
}

// Když je aplikace připravená, vytvoř okno
app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('select-file', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg'] }
      ]
    });
    return result.filePaths[0] || null;
  });
});

// Ukončení aplikace, když jsou všechna okna zavřená (kromě macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Na macOS znovu vytvoř okno, když je aplikace aktivována
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});