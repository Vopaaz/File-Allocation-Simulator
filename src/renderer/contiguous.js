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
    let toSaveInfoDirTable = window.mainDirTable
    let bm = BlockManager()
    let message = "<p>Look into Main Directory Table.</p>"

    for (const dir of dirs) {
        if (toSaveInfoDirTable.hasFileName(dir)) {
            let nextDirTableBlockId = toSaveInfoDirTable.getRowByFileName(dir)[1]
            message += `<p>'${dir}' found in current Directory Table at Block ${nextDirTableBlockId}.</p>`
            if (window.blockDirTables[nextDirTableBlockId]) {
                message += `<p>Look into Directory Table in Block '${nextDirTableBlockId}'.</p>`
                toSaveInfoDirTable = window.blockDirTables[nextDirTableBlockId]
            } else {
                throw `<p>There is a file with the same name as the directory '${dir}', which causes conflict.</p>`
            }
        } else {
            message += `<p>'${dir}' not found in current Directory Table.</p>`
            let newTable = DirectoryTable(window.tableHead)
            let newBlockId = bm.getOneEmptyBlockId()
            bm.setBlockFullById(newBlockId)
            toSaveInfoDirTable.push([dir, newBlockId, 1])
            window.blockDirTables[newBlockId] = newTable
            newTable.renderToBlockById(newBlockId)
            toSaveInfoDirTable = newTable
            message += `<p>A new Directory Table is created at Block ${newBlockId}.</p>`
        }
    }

    message = message.slice(0, -5) + `, which is the final Directory Table to register the file information.</p>`

    if (toSaveInfoDirTable.hasFileName(instruction.fileName)) {
        throw "<p>" + instruction.fileName + "already exists in" + instruction.directory + "</p>"
    } else {
        let toFillBlocksId = bm.getNumbersContinuousBlocksId(instruction.block)
        bm.setBlocksFullByIdList(toFillBlocksId)
        toSaveInfoDirTable.push([instruction.fileName, toFillBlocksId[0], instruction.block])
        message += `<p>File ${instruction.fileName} is created starting from Block ${toFillBlocksId[0]}, and the information is registered.</p>`
    }
    window.mainDirTable.renderToDirectoryView()
    renderMessage(message)
}

function locateToLookInfoTable(dirs) {
    let toLookInfoDirTable = window.mainDirTable;
    let message = "<p>Look into Main Directory Table.</p>";
    for (const dir of dirs) {
        if (toLookInfoDirTable.hasFileName(dir)) {
            let nextDirTableBlockId = toLookInfoDirTable.getRowByFileName(dir)[1];
            message += `<p>According to current Directory Table, '${dir}' is at Block ${nextDirTableBlockId}.</p>`;
            if (window.blockDirTables[nextDirTableBlockId]) {
                message += `<p>Look into Directory Table in Block '${nextDirTableBlockId}'.</p>`;
                toLookInfoDirTable = window.blockDirTables[nextDirTableBlockId];
            }
            else {
                throw `<p>Internal Error: Directory Table not found.</p>`;
            }
        }
        else {
            throw `<p>'${dir}' does not exist in a certain Directory Table. i.e. the path to the file does not exist.</p>`;
        }
    }
    message = message.slice(0, -5) + `, which is the final Directory Table to look for the file information.</p>`;
    return { toLookInfoDirTable, message };
}

function exeRead(instruction) {
    let bm = BlockManager()
    let dirs = splitDirectories(instruction.directory)
    let { toLookInfoDirTable, message } = locateToLookInfoTable(dirs);

    if (!toLookInfoDirTable.hasFileName(instruction.fileName)) {
        throw "<p>File " + instruction.fileName + "does not exist in" + instruction.directory +".</p>"
    } else {
        let row = toLookInfoDirTable.getRowByFileName(instruction.fileName)
        let start = row[1]
        let length = row[2]
        if (instruction.block <= length) {
            let id = start + instruction.block - 1
            bm.showBlockIsBeingReadById(id)
            message += `<p>According to the final Directory Table,` +
                ` Block ${instruction.block} of File ${instruction.fileName} is at Block ${id}, which is being read now.</p>`
        } else {
            throw `<p>Block number (${instruction.block}) in the instruction is larger than the file length.</p>`
        }
    }
    window.mainDirTable.renderToDirectoryView()
    renderMessage(message)
}

function exeWrite(instruction) {
    let dirs = splitDirectories(instruction.directory)
    let bm = BlockManager()
    let { toLookInfoDirTable, message } = locateToLookInfoTable(dirs);

    if (!toLookInfoDirTable.hasFileName(instruction.fileName)) {
        throw "<p>File " + instruction.fileName + "does not exist in" + instruction.directory + "</p>"
    }
    else {
        let row = toLookInfoDirTable.getRowByFileName(instruction.fileName)
        let start = row[1]
        let length = row[2]
        if (instruction.block <= length) {
            let id = start + instruction.block - 1
            bm.showBlockIsBeingWrittenById(id)
            message += `<p>According to the final Directory Table,` +
                ` Block ${instruction.block} of File ${instruction.fileName} is at Block ${id}, which is being written now.</p>`
        } else {
            throw `<p>Block number (${instruction.block}) in the instruction is larger than the file length.</p>`
        }
    }
    window.mainDirTable.renderToDirectoryView()
    renderMessage(message)
}

function exeDelete(instruction) {
    let dirs = splitDirectories(instruction.directory)
    let bm = BlockManager()
    let { toLookInfoDirTable, message } = locateToLookInfoTable(dirs);

    if (!toLookInfoDirTable.hasFileName(instruction.fileName)) {
        throw "<p>File " + instruction.fileName + " does not exist in " + instruction.directory + "</p>"
    }
    else {
        let row = toLookInfoDirTable.getRowByFileName(instruction.fileName)
        let start = row[1]
        let length = row[2]
        if ((window.blockDirTables[start] == null) || (window.blockDirTables[start] == undefined)) {
            // Is file
            toLookInfoDirTable.removeByFileName(instruction.fileName)

            let toDelete = []
            for (let index = start; index < start + length; index++) {
                toDelete.push(index)
            }
            bm.setBlocksEmptyByIdList(toDelete)

            message += `<p>According to the final Directory Table,` +
                ` File ${instruction.fileName} begins at Block ${start}, which is deleted.</p>`
        } else if (window.blockDirTables[start].isEmpty()) {
            // Is empty directory
            toLookInfoDirTable.removeByFileName(instruction.fileName)
            bm.setBlockEmptyById(start)
            bm.derenderBlockById(start)
            window.blockDirTables[start] = undefined
            message += `<p>According to the final Directory Table,` +
                ` Directory ${instruction.fileName} is at Block ${start}, which is deleted.</p>`
        } else {
            // Is full directory
            throw `<p>Directory ${instruction.fileName} is not empty, thus the deleting request is denied.</p>`
        }
    }
    window.mainDirTable.renderToDirectoryView()
    renderMessage(message)
}
