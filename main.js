const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')
const { Notification } = require('electron')
const fs = require('fs')

const NOTIFICATION_TITLE = '主进程提示'
const NOTIFICATION_BODY = 'Notification from the Main process'

const templete = [
  {
    label: '最近打开文件',
    role: 'recentdocuments',
    submenu: [
      {
        label: '清楚文件',
        role: 'clearrecentdocuments',
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(templete)

// 提醒
function showNotification () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
  win.setProgressBar(0.5)
}

// 添加文件
const fileNmae = 'test.md';
fs.writeFile(fileNmae, 'lorem ipsum', () => {
  app.addRecentDocument(path.join(__dirname), fileNmae)
})


app.whenReady().then(() => {
  createWindow()
  Menu.setApplicationMenu(menu)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}).then(showNotification)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})