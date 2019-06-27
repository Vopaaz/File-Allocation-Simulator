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
    console.log(dirs)
    let toSaveInfoDirTable = window.mainDirTable
    let bm = BlockManager()

    for (const dir of dirs) {
        if (toSaveInfoDirTable.hasFileName(dir)) {
            let nextDirTableBlockId = toSaveInfoDirTable.getRowByFileName(dir)[1]
            if (blockDirTables[nextDirTableBlockId]) {
                toSaveInfoDirTable = blockDirTables[nextDirTableBlockId]
            } else {
                throw `There is a file with the same name as ${dir}, which causes conflict`
            }
        }
        else {
            let newTable = DirectoryTable(window.TableHead)
            let newBlockId = bm.getOneEmptyBlockId()
            bm.setBlockFullById(newBlockId)
            console.log(newBlockId)
            toSaveInfoDirTable.push([dir, newBlockId, 1])
            if (toSaveInfoDirTable === window.mainDirTable) {
                toSaveInfoDirTable.renderToDirectoryView()
            }
            newTable.renderToBlockById(newBlockId)
            toSaveInfoDirTable = newTable
        }
    }

    if (toSaveInfoDirTable.hasFileName(instruction.fileName)) {
        throw instruction.fileName + "already exists in" + instruction.directory
    }
    else {
        let toFillBlocksId = bm.getNumbersContinuousBlocksId(instruction.block)
        bm.setBlocksFullByIdList(toFillBlocksId)
        toSaveInfoDirTable.push([instruction.fileName, toFillBlocksId[0], instruction.block])
        if (toSaveInfoDirTable === window.mainDirTable) {
            toSaveInfoDirTable.renderToDirectoryView()
        } else {
            blockDirTables[toFillBlocksId] = toSaveInfoDirTable
            toSaveInfoDirTable.renderToBlockById(toFillBlocksId)
        }
    }

}

function exeRead(instruction) {

}

function exeWrite(instruction) {

}

function exeDelete(instruction) {

}