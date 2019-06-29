'use strict';

const { BrowserWindow } = require('electron').remote
const { screen } = require('electron').remote
const path = require('path')

const newContSimBtn = document.getElementById('new-contiguous-simulation')
newContSimBtn.addEventListener('click', (event) => {
    const htmlPath = path.join('file://', __dirname, '../simulations/contiguous.html')
    let win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.maximize()
    win.openDevTools()
    win.on('close', () => { win = null })
    win.loadURL(htmlPath)
    win.show()
})

const newLinkedSimBtn = document.getElementById('new-linked-simulation')
newLinkedSimBtn.addEventListener('click', (event) => {
    const htmlPath = path.join('file://', __dirname, '../simulations/linked.html')
    let win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.maximize()
    win.openDevTools()
    win.on('close', () => { win = null })
    win.loadURL(htmlPath)
    win.show()
})


const newIndexedSimBtn = document.getElementById('new-indexed-simulation')
newIndexedSimBtn.addEventListener('click', (event) => {
    const htmlPath = path.join('file://', __dirname, '../simulations/indexed.html')
    let win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.maximize()
    win.openDevTools()
    win.on('close', () => { win = null })
    win.loadURL(htmlPath)
    win.show()
})
