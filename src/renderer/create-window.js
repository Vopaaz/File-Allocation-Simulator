'use strict';

const { BrowserWindow } = require('electron').remote
const path = require('path')
const shell = require('electron').shell;

// Contiguous Simulation
const newContSimBtn = document.getElementById('new-contiguous-simulation')
newContSimBtn.addEventListener('click', (event) => {
    const htmlPath = path.join('file://', __dirname, '../simulations/contiguous.html')
    let win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.maximize()
    win.on('close', () => { win = null })
    win.loadURL(htmlPath)
    win.show()
})

// Linked Simulation
const newLinkedSimBtn = document.getElementById('new-linked-simulation')
newLinkedSimBtn.addEventListener('click', (event) => {
    const htmlPath = path.join('file://', __dirname, '../simulations/linked.html')
    let win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.maximize()
    win.on('close', () => { win = null })
    win.loadURL(htmlPath)
    win.show()
})

// Indexed Simulation
const newIndexedSimBtn = document.getElementById('new-indexed-simulation')
newIndexedSimBtn.addEventListener('click', (event) => {
    const htmlPath = path.join('file://', __dirname, '../simulations/indexed.html')
    let win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.maximize()
    win.on('close', () => { win = null })
    win.loadURL(htmlPath)
    win.show()
})

// Documentation
const docBtn = document.getElementById('documentation')
docBtn.addEventListener('click', (event) => {
    const htmlPath = path.join('https://github.com/Vopaaz/File-Allocation-Simulator/blob/master/README.md')
    shell.openExternal(htmlPath)
})
