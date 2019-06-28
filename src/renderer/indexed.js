'use strict';

const { BlockManager, initGeneralEnvironment, renderMessage, DirectoryTable, splitDirectories } = require('./util.js')

window.tableHead = ["File", "Index Block"]
initGeneralEnvironment()
window.blockIndexTableHead = ["Index"]


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
    let toSaveInfoDirTable = window.mainDirTable
    let bm = BlockManager()
    let message = "<p>Look into Main Directory Table.</p>"

    for (const dir of dirs) {
        if (toSaveInfoDirTable.hasFileName(dir)) {
            let nextIndexTableBlockId = toSaveInfoDirTable.getRowByFileName(dir)[1]
            let nextDirTableBlockId = window.blockIndexTables[nextIndexTableBlockId].cellArray[0][0]
            message += `<p>'${dir}' found in current Directory Table at Block ${nextDirTableBlockId} by following the index at Block ${nextIndexTableBlockId}.</p>`
            if (window.blockDirTables[nextDirTableBlockId]) {
                message += `<p>Look into Directory Table in Block '${nextDirTableBlockId}'.</p>`
                toSaveInfoDirTable = window.blockDirTables[nextDirTableBlockId]
            } else {
                throw `<p>There is a file with the same name as the directory '${dir}', which causes conflict.</p>`
            }
        } else {
            message += `<p>'${dir}' not found in current Directory Table.</p>`

            let newIndex = DirectoryTable(window.blockIndexTableHead)
            let newIndexBlockId = bm.getOneEmptyBlockId()
            window.blockIndexTables[newIndexBlockId] = newIndex
            bm.setBlockFullById(newIndexBlockId)

            toSaveInfoDirTable.push([dir, newIndexBlockId])
            let newTable = DirectoryTable(window.tableHead)
            let newBlockId = bm.getOneEmptyBlockId()
            window.blockDirTables[newBlockId] = newTable
            bm.setBlockFullById(newBlockId)

            newIndex.push([newBlockId])
            window.blockDirTables[newBlockId] = newTable

            newTable.renderToBlockById(newBlockId)
            newIndex.renderToBlockById(newIndexBlockId)

            toSaveInfoDirTable = newTable

            message += `<p>Index Block created at ${newIndexBlockId}. `
            message += `And a new Directory Table is created at Block ${newBlockId}.</p>`
        }
    }

    message = message.slice(0, -5) + `, which is the final Directory Table to register the file information.</p>`

    if (toSaveInfoDirTable.hasFileName(instruction.fileName)) {
        throw "<p>" + instruction.fileName + "already exists in" + instruction.directory + "</p>"
    } else {

        let newIndexBlockId = bm.getOneEmptyBlockId()
        let newIndex = DirectoryTable(window.blockIndexTableHead)
        bm.setBlockFullById(newIndexBlockId)

        message += `A new Index Block is create at ${newIndexBlockId} which stores the block indexes of the file.`

        let toFillBlocksIds = bm.getNumbersDiscreteBlocksId(instruction.block)
        bm.setBlocksFullByIdList(toFillBlocksIds)

        toFillBlocksIds.forEach(element => {
            newIndex.push([element])
        });

        toSaveInfoDirTable.push([instruction.fileName, newIndexBlockId])
        newIndex.renderToBlockById(newIndexBlockId)
        message += `<p>File ${instruction.fileName} is created in ${toFillBlocksIds}, and the information is registered.</p>`
    }

    window.mainDirTable.renderToDirectoryView()
    renderMessage(message)
}

function exeRead(instruction) {

}
function exeWrite(instruction) {

}
function exeDelete(instruction) {

}