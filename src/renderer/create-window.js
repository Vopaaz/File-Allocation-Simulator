'use strict';

const { BrowserWindow } = require('electron').remote
const { screen } = require('electron').remote
const path = require('path')

const size = screen.getPrimaryDisplay().size
const newContSimBtn = document.getElementById('new-contiguous-simulation')
const win_width = Math.floor(size.width)
const win_height = Math.floor(size.height)

newContSimBtn.addEventListener('click', (event) => {
    const htmlPath = path.join('file://', __dirname, '../simulations/contiguous.html')
    let win = new BrowserWindow({
        width: win_width,
        height: win_height,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.openDevTools()
    win.on('close', () => { win = null })
    win.loadURL(htmlPath)
    win.show()
})
