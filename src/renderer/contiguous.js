const { ipcRenderer } = require('electron')
const { changeBlockStatus } = require('./util.js')

const inputBtn = document.getElementById('input')

inputBtn.addEventListener('click', (event) => {
    ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-file', (event, content) => {
    let index = parseInt(content)
    var tar_block = document.getElementById("block-" + index)
    changeBlockStatus(tar_block)
})

const stepButton = document.getElementById('step')

stepButton.addEventListener('click', (event) => {
    var targetBlock = document.getElementById('block-4')
    changeBlockStatus(targetBlock)
})