'use strict';

const { ipcMain, dialog } = require('electron')
const fs = require('fs')

function readAndSendFileContent(file, event) {
    fs.readFile(file, 'utf-8', (err, content) => {
        if (err) {
            console.log("An error ocurred reading the file :" + err.message)
        }
        else {
            event.sender.send('selected-file', content)
        }
    })
}

ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, (files) => {
        if (files) {
            readAndSendFileContent(files[0], event)
        }
    })
})
