'use strict';

const { BlockManager, initGeneralEnvironment, renderMessage, DirectoryTable } = require('./util.js')

initGeneralEnvironment()

var tableHead = ["File", "Start", "Length"]

window.mainDirTable = DirectoryTable(tableHead)
window.mainDirTable.push(["3", "4", "5"])
window.mainDirTable.renderToDirectoryView()


const stepButton = document.getElementById('step')

stepButton.addEventListener('click', (event) => {
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
})


function execute(instruction) {
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

function exeCreate(instruction) {

}

function exeRead(instruction) {

}

function exeWrite(instruction) {

}

function exeDelete(instruction) {

}