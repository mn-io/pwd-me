const electron = require('electron')
const {app, Menu, BrowserWindow} = electron

const path = require('path')
const url = require('url')

const menuTemplate = [
  {label: 'Edit', submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'delete'},
      {role: 'selectall'}
  ]},
  {label: 'View', submenu: [
      {role: 'reload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
  ]},
  {role: 'window', submenu: [
      {role: 'minimize'},
      {role: 'close'},
      {role: 'quit'}
  ]},
  {role: 'help', submenu: [
      {
        label: 'Open Github repository',
        click () { require('electron').shell.openExternal('https://github.com/mn-io/key-derivator') }
      }
    ]
  }
]

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 1373, height: 400})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') {}
    app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
