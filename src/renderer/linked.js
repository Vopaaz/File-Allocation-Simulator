'use strict';

const { BlockManager, initGeneralEnvironment, renderMessage, DirectoryTable, splitDirectories } = require('./util.js')

window.tableHead = ["File", "Start", "Length"]
initGeneralEnvironment()

function executeNext() {
    if (window.instructionInited) {
        if (window.toExecInstructionId < window.totalInstructions) {
            let instruction = window.instructions[window.toExecInstructionId++]
            execute(instruction)
        }
        else {
            renderMessage("All instructions are executed.")
        }
    }
    else {
        renderMessage("Instructions data not initialized.")
    }
}

const stepButton = document.getElementById('step')
stepButton.addEventListener('click', (event) => executeNext())

const autoBtn = document.getElementById('auto')
function startAuto() {
    renderMessage("<p> Automatic Execution Starts. </p>")
    let id = setInterval(() => {
        executeNext()
    }, 2000)
    autoBtn.onclick = function () {
        stopAuto(id)
    }
}

function stopAuto(id) {
    clearInterval(id)
    renderMessage("<p> Automatic Execution Terminated. </p>")
    autoBtn.onclick = startAuto
}

autoBtn.onclick = startAuto


function execute(instruction) {
    try {
        switch (instruction.oprand) {
            case "C":
                exeCreate(instruction)
                break;
            case "R":
                exeRead(instruction)
                break;
            case "W":
                exeWrite(instruction)
                break
            case "D":
                exeDelete(instruction)
            default:
                break;
        }
    }
    catch (error) {
        renderMessage(error)
    }
}

function exeCreate(instruction) {
    let dirs = splitDirectories(instruction.directory)
    let toLookInfoDirTable = window.mainDirTable
    let bm = BlockManager()
    let message = "<p>Look into Main Directory Table.</p>"

    // Logic body


    window.mainDirTable.renderToDirectoryView()
    renderMessage(message)


}

function exeRead(instruction) {
    let dirs = splitDirectories(instruction.directory)
    let toLookInfoDirTable = window.mainDirTable
    let bm = BlockManager()
    let message = "<p>Look into Main Directory Table.</p>"

    // Logic body


    window.mainDirTable.renderToDirectoryView()
    renderMessage(message)


}

function exeWrite(instruction) {
    let dirs = splitDirectories(instruction.directory)
    let toLookInfoDirTable = window.mainDirTable
    let bm = BlockManager()
    let message = "<p>Look into Main Directory Table.</p>"

    // Logic body


    window.mainDirTable.renderToDirectoryView()
    renderMessage(message)


}

function exeDelete(instruction) {
    let dirs = splitDirectories(instruction.directory)
    let toLookInfoDirTable = window.mainDirTable
    let bm = BlockManager()
    let message = "<p>Look into Main Directory Table.</p>"

    // Logic body


    window.mainDirTable.renderToDirectoryView()
    renderMessage(message)


}