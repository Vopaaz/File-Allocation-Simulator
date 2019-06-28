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
    let dirs = splitDirectories(instruction.directory)
    let toLookInfoDirTable = window.mainDirTable
    let bm = BlockManager()
    let message = "Look into Main Directory Table.\n"

    for (const dir of dirs) {
        if (toLookInfoDirTable.hasFileName(dir)) {
            let nextDirTableBlockId = toLookInfoDirTable.getRowByFileName(dir)[1]
            message += `According to current Directory Table, '${dir}' is at Block ${nextDirTableBlockId}.\n`
            if (window.blockDirTables[nextDirTableBlockId]) {
                message += `Look into Directory Table in Block '${nextDirTableBlockId}'.\n`
                toLookInfoDirTable = window.blockDirTables[nextDirTableBlockId]
            } else {
                throw `Internal Error: Directory Table not found.`
            }
        }
        else {
            throw `'${dir}' does not exist in current Directory Table. i.e. the path to the file does not exist.`
        }
    }

    message = message.slice(0, -2) + `, which is the final Directory Table to look for the file information.\n`

    if (!toLookInfoDirTable.hasFileName(instruction.fileName)) {
        throw "File " + instruction.fileName + "does not exist in" + instruction.directory
    }
    else {
        let row = toLookInfoDirTable.getRowByFileName(instruction.fileName)
        let start = row[1]
        let length = row[2]
        if (instruction.block <= length) {
            let id = start + instruction.block - 1
            bm.showBlockIsBeingReadById(id)
            message += `According to the final Directory Table,` +
                ` Block ${instruction.block} of File ${instruction.fileName} is at Block ${id}, which is being read now.`
        }
        else {
            throw `Block number (${instruction.block}) in the instruction is larger than the file length.`
        }
    }

    renderMessage(message)
}

function exeWrite(instruction) {
    let dirs = splitDirectories(instruction.directory)
    let toLookInfoDirTable = window.mainDirTable
    let bm = BlockManager()
    let message = "Look into Main Directory Table.\n"

    for (const dir of dirs) {
        if (toLookInfoDirTable.hasFileName(dir)) {
            let nextDirTableBlockId = toLookInfoDirTable.getRowByFileName(dir)[1]
            message += `According to current Directory Table, '${dir}' is at Block ${nextDirTableBlockId}.\n`
            if (window.blockDirTables[nextDirTableBlockId]) {
                message += `Look into Directory Table in Block '${nextDirTableBlockId}'.\n`
                toLookInfoDirTable = window.blockDirTables[nextDirTableBlockId]
            } else {
                throw `Internal Error: Directory Table not found.`
            }
        }
        else {
            throw `'${dir}' does not exist in current Directory Table. i.e. the path to the file does not exist.`
        }
    }

    message = message.slice(0, -2) + `, which is the final Directory Table to look for the file information.\n`

    if (!toLookInfoDirTable.hasFileName(instruction.fileName)) {
        throw "File " + instruction.fileName + "does not exist in" + instruction.directory
    }
    else {
        let row = toLookInfoDirTable.getRowByFileName(instruction.fileName)
        let start = row[1]
        let length = row[2]
        if (instruction.block <= length) {
            let id = start + instruction.block - 1
            bm.showBlockIsBeingWrittenById(id)
            message += `According to the final Directory Table,` +
                ` Block ${instruction.block} of File ${instruction.fileName} is at Block ${id}, which is being written now.`
        }
        else {
            throw `Block number (${instruction.block}) in the instruction is larger than the file length.`
        }
    }

    renderMessage(message)
}

function exeDelete(instruction) {

}