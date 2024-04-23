const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    icon: 'assets/graphics/icons/icon.png',
    resizable: true,
    autoHideMenuBar: true,
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  ipcMain.on('setResolution', (event, data) => {
    const parts = data.split('x');
    const width = parseInt(parts[0]);
    const height = parseInt(parts[1]);

    mainWindow.setBounds({ width, height });
    mainWindow.center();
  })

  mainWindow.loadFile('index.html')

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
