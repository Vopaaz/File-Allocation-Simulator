const { ipcRenderer } = require('electron')
const { changeBlockStatus, InstructionParser, inputInit } = require('./util.js')

inputInit()

ipcRenderer.on('selected-file', (event, content) => {
    let parser = InstructionParser(content)
    parser.instructions.forEach(instruction => {
        let block = instruction.block
        changeBlockStatus(document.getElementById("block-" + block))
    });
})

const stepButton = document.getElementById('step')

stepButton.addEventListener('click', (event) => {
    let targetBlock = document.getElementById('block-4')
    changeBlockStatus(targetBlock)
})

