const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  readFileAsDataURL: (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(err);
        else resolve('data:image/' + filePath.split('.').pop() + ';base64,' + data.toString('base64'));
      });
    });
  }
});