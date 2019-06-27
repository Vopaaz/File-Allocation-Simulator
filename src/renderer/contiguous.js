'use strict';

const { BlockManager, initGeneralEnvironment, renderMessage, DirectoryTable, splitDirectories } = require('./util.js')

window.TableHead = ["File", "Start", "Length"]
initGeneralEnvironment()

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
    let message = "Look into Main Directory Table.\n"

    for (const dir of dirs) {
        if (toSaveInfoDirTable.hasFileName(dir)) {
            let nextDirTableBlockId = toSaveInfoDirTable.getRowByFileName(dir)[1]
            message += `'${dir}' found in current Directory Table at Block ${nextDirTableBlockId}.\n`
            if (window.blockDirTables[nextDirTableBlockId]) {
                message += `Look into Directory Table in Block '${nextDirTableBlockId}'.\n`
                toSaveInfoDirTable = window.blockDirTables[nextDirTableBlockId]
            } else {
                throw `There is a file with the same name as the directory '${dir}', which causes conflict.`
            }
        }
        else {
            message += `'${dir}' not found in current Directory Table.\n`
            let newTable = DirectoryTable(window.TableHead)
            let newBlockId = bm.getOneEmptyBlockId()
            bm.setBlockFullById(newBlockId)
            toSaveInfoDirTable.push([dir, newBlockId, 1])
            window.blockDirTables[newBlockId] = newTable
            newTable.renderToBlockById(newBlockId)
            toSaveInfoDirTable = newTable
            message += `A new Directory Table is created at Block ${newBlockId}.\n`
        }
    }

    message = message.slice(0, -2) + `, which is the final Directory Table to register the file information.\n`

    if (toSaveInfoDirTable.hasFileName(instruction.fileName)) {
        throw instruction.fileName + "already exists in" + instruction.directory
    }
    else {
        let toFillBlocksId = bm.getNumbersContinuousBlocksId(instruction.block)
        bm.setBlocksFullByIdList(toFillBlocksId)
        toSaveInfoDirTable.push([instruction.fileName, toFillBlocksId[0], instruction.block])
        message += `File ${instruction.fileName} is created starting from Block ${toFillBlocksId[0]}, and the information is registered.\n`
        if (toSaveInfoDirTable != window.mainDirTable) {
            blockDirTables[toFillBlocksId] = toSaveInfoDirTable
            toSaveInfoDirTable.renderToBlockById(toFillBlocksId)
        }
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