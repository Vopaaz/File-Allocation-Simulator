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
            // Comparing with contiguous and linked simulation, indexed simulation needs to
            // create an index block besides a general directory block
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
        window.blockIndexTables[newIndexBlockId] = newIndex

        message += `<p>A new Index Block is create at ${newIndexBlockId} which stores the block indexes of the file.</p>`

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


function locateToLookInfoTable(dirs) {
    let toLookInfoDirTable = window.mainDirTable;
    let message = "<p>Look into Main Directory Table.</p>";
    for (const dir of dirs) {
        if (toLookInfoDirTable.hasFileName(dir)) {
            let nextIndexTableBlockId = toLookInfoDirTable.getRowByFileName(dir)[1];
            let nextDirTableBlockId = window.blockIndexTables[nextIndexTableBlockId].cellArray[0][0];
            message += `<p>'${dir}' found in current Directory Table. It locates in Block ${nextDirTableBlockId}, found by following the index at Block ${nextIndexTableBlockId}.</p>`;
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
    let dirs = splitDirectories(instruction.directory)
    let bm = BlockManager()
    let { toLookInfoDirTable, message } = locateToLookInfoTable(dirs);

    if (!toLookInfoDirTable.hasFileName(instruction.fileName)) {
        throw "<p>File " + instruction.fileName + "does not exist in" + instruction.directory+".</p>"
    } else {
        let row = toLookInfoDirTable.getRowByFileName(instruction.fileName)
        let indexBlockId = row[1]
        message += `<p>According to the final Directory Table, the index of file ${instruction.fileName} is at Block ${indexBlockId}</p>`

        let indexTable = window.blockIndexTables[indexBlockId].cellArray
        if (instruction.block <= indexTable.length) {
            let toReadBlockId = indexTable[instruction.block - 1][0]
            bm.showBlockIsBeingReadById(toReadBlockId)
            message += `<p>According to the Index Table, Block ${instruction.block} of file ${instruction.fileName} is at Block ${toReadBlockId}. And it's being read.</p>`
        } else {
            throw `<p> Block number (${instruction.block}) in the instruction is larger than the file length. </p>`
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
        throw "<p>File " + instruction.fileName + "does not exist in" + instruction.directory+".</p>"
    } else {
        let row = toLookInfoDirTable.getRowByFileName(instruction.fileName)
        let indexBlockId = row[1]
        message += `<p>According to the final Directory Table, the index of file ${instruction.fileName} is at Block ${indexBlockId}</p>`

        let indexTable = window.blockIndexTables[indexBlockId].cellArray
        if (instruction.block <= indexTable.length) {
            let toWriteBlockId = indexTable[instruction.block - 1][0]
            bm.showBlockIsBeingWrittenById(toWriteBlockId)
            message += `<p>According to the Index Table, Block ${instruction.block} of file ${instruction.fileName} is at Block ${toWriteBlockId}. And it's being read.</p>`
        } else {
            throw `<p> Block number (${instruction.block}) in the instruction is larger than the file length. </p>`
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
        throw "<p>File " + instruction.fileName + "does not exist in" + instruction.directory+".</p>"
    } else {
        let row = toLookInfoDirTable.getRowByFileName(instruction.fileName)
        let indexBlockId = row[1]
        let indexTable = window.blockIndexTables[indexBlockId].cellArray
        let firstActualBlockId = indexTable[0][0]
        if ((window.blockDirTables[firstActualBlockId] == null) || (window.blockDirTables[firstActualBlockId] == undefined)) {
            // Is file
            toLookInfoDirTable.removeByFileName(instruction.fileName)
            let toPrintLocs = []
            indexTable.forEach(element => {
                bm.setBlockEmptyById(element[0])
                bm.derenderBlockById(element[0])
                toPrintLocs.push(element[0])
            });
            bm.setBlockEmptyById(indexBlockId)
            bm.derenderBlockById(indexBlockId)
            window.blockIndexTables[indexBlockId] = null
            message += `<p>According to the final Directory Table, the Index Block of File ${instruction.fileName} is at Block ${indexBlockId}. ` +
                `And its contents are at ${toPrintLocs}. They are all deleted. </p>`
        } else if (window.blockDirTables[firstActualBlockId].isEmpty()) {
            // Is empty directory
            toLookInfoDirTable.removeByFileName(instruction.fileName)
            bm.setBlockEmptyById(indexBlockId)
            bm.setBlockEmptyById(firstActualBlockId)
            bm.derenderBlockById(indexBlockId)
            bm.derenderBlockById(firstActualBlockId)
            window.blockDirTables[firstActualBlockId] = null
            message += `<p> According to the final Directory Table, the Index Block of Directory ${instruction.fileName} is at Block ${indexBlockId}, ` +
                `and the directory itself is at ${firstActualBlockId}. They are all deleted.`
        } else {
            // Is full directory
            throw `<p>Directory ${instruction.fileName} is not empty, thus the deleting request is denied.</p>`
        }
    }

    window.mainDirTable.renderToDirectoryView()
    renderMessage(message)
}