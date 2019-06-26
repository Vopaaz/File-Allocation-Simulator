'use strict';

const { ipcRenderer } = require('electron')

function BlockManager() {
    function randColor() {
        let r = Math.random() * 200 + 55
        let g = Math.random() * 200 + 55
        let b = Math.random() * 200 + 55
        return `rgba(${r},${g},${b},0.7)`
    }

    let bm = {

        getBlockById: function (id) {
            return document.getElementById('block-' + String(id))
        },

        getBlocksByIdList: function (idList) {
            let blockList = []
            for (const id of idList) {
                blockList.push(this.getBlockById(id))
            }
            return blockList
        },

        setBlockFull: function (block) {
            block.style.backgroundColor = randColor()
            block.setAttribute("class", "block-full")
        },

        setBlocksFull: function (blockList) {
            let color = randColor()
            blockList.forEach(block => {
                block.style.backgroundColor = color
                block.setAttribute("class", "block-full")
            });
        },

        setBlockEmpty: function (block) {
            block.style.backgroundColor = "white"
            block.setAttribute("class", "block-empty")
        },

        setBlocksEmpty: function (blockList) {
            blockList.forEach(block => {
                this.setBlockEmpty(block)
            })
        },

        blockIsFull: function (block) {
            return block.getAttribute("class") == "block-full"
        },

        blockIsEmpty: function (block) {
            return block.getAttribute("class") == "block-empty"
        },

        blocksAllFull: function (blockList) {
            for (const block of blockList) {
                if (this.blockIsEmpty(block)) {
                    return false
                }
            }
            return true
        },

        blocksAllEmpty: function (blockList) {
            for (const block of blockList) {
                if (this.blockIsFull(block)) {
                    return false
                }
            }
            return true
        },

        blocksAllFullById: function (idList) {
            let blockList = this.getBlocksByIdList(idList)
            return this.blocksAllFull(blockList)
        },

        blocksAllEmptyById: function (idList) {
            let blockList = this.getBlocksByIdList(idList)
            return this.blocksAllEmpty(blockList)
        },

        setBlockFullById: function (id) {
            this.setBlockFull(this.getBlockById(id))
        },

        setBlocksFullByIdList: function (idList) {
            let blockList = this.getBlocksByIdList(idList)
            this.setBlocksFull(blockList)
        },

        setBlockEmptyById: function (id) {
            this.setBlockEmpty(this.getBlockById(id))
        },

        setBlocksEmptyByIdList: function (idList) {
            let blockList = this.getBlocksByIdList(idList)
            this.setBlocksEmpty(blockList)
        },

        blockIsFullById: function (id) {
            return this.blockIsFull(this.getBlockById(id))
        },

        blockIsEmptyById: function (id) {
            return this.blockIsEmpty(this.getBlockById(id))
        },
    }
    return bm
}


function initEverything() {
    window.instructionInited = false

    const inputBtn = document.getElementById('input')
    inputBtn.addEventListener('click', (event) => {
        ipcRenderer.send('open-file-dialog')
    })

    ipcRenderer.on('selected-file', (event, content) => {
        try {
            let parser = InstructionParser(content)
            window.instructions = parser.instructions
            window.totalInstructions = window.instructions.length
            window.toExecInstructionId = 0
            window.instructionInited = true

            renderRawInstructionTable()
            renderMessage("Instructions are loaded.")
        }
        catch (error) {
            window.instructionInited = false
            clearRawInstructionTable()
            renderMessage(error)
        }
    })
}

function clearRawInstructionTable() {
    let div = document.getElementById("raw-instructions")
    div.innerHTML = ""
}

function renderRawInstructionTable() {
    function tdWrapper(content) {
        return "<td>" + content + "</td>"
    }

    let tablecontent = "<table>"
    tablecontent += "<tr><th>Directory</th><th>Filename</th><th>Block</th><th>Oprand</th></tr>"
    for (const instruction of window.instructions) {
        tablecontent += "<tr>"
        tablecontent += tdWrapper(instruction.directory)
        tablecontent += tdWrapper(instruction.fileName)
        tablecontent += tdWrapper(instruction.block)
        tablecontent += tdWrapper(instruction.oprand)
        tablecontent += "</tr>"
    }
    tablecontent += "</table>"

    let div = document.getElementById("raw-instructions")
    div.innerHTML = tablecontent
}

function InstructionParser(content) {
    let lines = content.split("\n")
    let instructions = []

    for (const line of lines) {
        if (line != "") {
            let instruction = Instruction(line)
            if (instruction) {
                instructions.push(instruction)
            }
        }
    }

    let parser = {
        instructions: instructions
    }
    return parser
}


function Instruction(rawContentLine) {
    function charNumInString(string, char) {
        let count = 0
        for (const str_char of string) {
            if (str_char == char) {
                count++
            }
        }
        return count
    }

    function inArray(array, item) {
        for (const arrayItem of array) {
            if (arrayItem == item) {
                return true
            }
        }
        return false
    }

    let contentLine = rawContentLine.trim()

    if (charNumInString(contentLine, ",") != 3) {
        throw "Invalid instruction: '" + contentLine + "'. \nThe commas(separators) in the instruction data file are not placed properly."
    }

    let arr = contentLine.split(",")

    let instruction

    try {
        instruction = {
            directory: arr[0].trim(),
            fileName: arr[1].trim(),
            block: parseInt(arr[2].trim()),
            oprand: arr[3].trim()
        }
    } catch (error) {
        throw "Invalid instruction: '" + contentLine + "'."
    }

    if (isNaN(instruction.block) && instruction.oprand != "D") {
        throw "Invalid instruction: '" + contentLine + "'. \nThe block field is not a valid integer."
    }

    if (!inArray(["C", "R", "W", "D"], instruction.oprand)) {
        throw "Invalid instruction: '" + contentLine + "'. \nThe oprand must be C, R, W, or D."
    }

    return instruction

}

function InfoTableManager(headTitleList) {
    let tableContainer = document.getElementById("info-table")
    let table = document.createElement("table")
    tableContainer.appendChild(table)
    let headRow = document.createElement("tr")
    headTitleList.forEach(headTitle => {
        let headElement = document.createElement("th")
        headElement.innerText = headTitle
        headRow.appendChild(headElement)
    });
    table.appendChild(headRow)

    let itm = {
        something: 0
    }

    return itm
}


function renderMessage(message) {
    document.getElementById("messages").innerText = message;
}

module.exports = {
    "InstructionParser": InstructionParser,
    "initEverything": initEverything,
    "BlockManager": BlockManager,
    "renderMessage": renderMessage,
    "InfoTableManager": InfoTableManager
}