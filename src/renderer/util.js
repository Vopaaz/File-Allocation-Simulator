'use strict';

const { ipcRenderer } = require('electron')

function BlockManager() {
    function randColor() {
        let r = Math.random() * 30 + 60
        let g = Math.random() * 180 + 60
        let b = Math.random() * 180 + 60
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

        getOneEmptyBlock: function () {
            let id = this.getOneEmptyBlockId()
            if (id) {
                return this.getBlockById(id)
            } else {
                throw "All blocks are already full."
            }
        },

        getOneEmptyBlockId: function () {
            for (let index = 0; index < 200; index++) {
                if (this.blockIsEmptyById(index)) {
                    return index
                }
            }
            throw "All blocks are already full."
        },

        getNumbersContinuousBlocksId: function (number) {
            for (let start = 0; start < 200; start++) {
                if (this.blockIsFullById(start)) {
                    continue
                }
                let arr = [start]
                for (let end = start + 1; (end < start + number) && (end < 200); end++) {
                    if (this.blockIsEmptyById(end)) {
                        arr.push(end)
                    } else {
                        break
                    }
                }
                if (arr.length == number) {
                    return arr
                }
            }
            throw "No sufficient blocks. "
        },

        getNumbersContinuousBlocks: function (number) {
            let ids = this.getNumbersContinuousBlocksId(number)
            return this.getBlocksByIdList(ids)
        },

        showBlockIsBeingRead: function (block) {
            function change(block, original_content) {
                let r = "<span class='reading-text'> R! </span>"
                if (block.innerHTML === original_content) {
                    block.innerHTML = r
                }
                else {
                    block.innerHTML = original_content
                }
            }

            let original_content = block.innerHTML

            let timerId = setInterval(() => {
                change(block, original_content)
            }, 200);

            setTimeout(() => {
                clearInterval(timerId)
                block.innerHTML = original_content
            }, 2000);
        },

        showBlockIsBeingReadById: function (id) {
            this.showBlockIsBeingRead(this.getBlockById(id))
        },

        showBlocksAreBeingRead: function(blocks){
            blocks.forEach(block => {
                this.showBlockIsBeingRead(block)
            });
        },

        showBlocksAreBeingReadByIdList: function(idList){
            idList.forEach(id => {
                this.showBlockIsBeingReadById(id)
            });
        },


        showBlockIsBeingWritten: function (block) {
            function change(block, original_content) {
                let r = "<span class='writing-text'> W! </span>"
                if (block.innerHTML === original_content) {
                    block.innerHTML = r
                }
                else {
                    block.innerHTML = original_content
                }
            }

            let original_content = block.innerHTML

            let timerId = setInterval(() => {
                change(block, original_content)
            }, 200);

            setTimeout(() => {
                clearInterval(timerId)
                block.innerHTML = original_content
            }, 2000);
        },

        showBlockIsBeingWrittenById: function (id) {
            this.showBlockIsBeingWritten(this.getBlockById(id))
        },

        showBlocksAreBeingWritten: function(blocks){
            blocks.forEach(block => {
                this.showBlockIsBeingWritten(block)
            });
        },

        showBlocksAreBeingWrittenByIdList: function(idList){
            idList.forEach(id => {
                this.showBlockIsBeingWrittenById(id)
            });
        }

    }
    return bm
}

function initGeneralEnvironment() {
    window.instructionInited = false

    const inputBtn = document.getElementById('input')
    inputBtn.addEventListener('click', (event) => {
        ipcRenderer.send('open-file-dialog')
    })

    const fileInfoTblTitle = document.getElementById("file-infomation-table-title")
    fileInfoTblTitle.addEventListener('click', (event) => {
        window.mainDirTable.renderToDirectoryView()
    })

    ipcRenderer.on('selected-file', (event, content) => {
        window.instructions = null
        window.totalInstructions = 0
        window.toExecInstructionId = 0
        window.instructionInited = false
        window.blockDirTables = [];
        window.mainDirTable = null;
        let bm = BlockManager()
        for (let index = 0; index < 200; index++) {
            bm.setBlockEmptyById(index)
        }
        clearRawInstructionTable()
        renderMessage("")

        try {
            let parser = InstructionParser(content)
            window.instructions = parser.instructions
            window.totalInstructions = window.instructions.length
            window.toExecInstructionId = 0
            window.instructionInited = true

            renderRawInstructionTable()

            window.mainDirTable = DirectoryTable(window.TableHead)
            window.mainDirTable.renderToDirectoryView()
            renderMessage("Instructions are loaded.")
        }
        catch (error) {
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

    if (!instruction.directory.startsWith("root")) {
        throw "Invalid instruction: '" + contentLine + "' \n The directory must starts with 'root'."
    }

    if (isNaN(instruction.block) && instruction.oprand != "D") {
        throw "Invalid instruction: '" + contentLine + "'. \nThe block field is not a valid integer."
    }

    if (!inArray(["C", "R", "W", "D"], instruction.oprand)) {
        throw "Invalid instruction: '" + contentLine + "'. \nThe oprand must be C, R, W, or D."
    }

    return instruction

}

function DirectoryTable(headTitleList) {
    let dt = {

        headTitleList: headTitleList,
        cellArray: [],

        toHtmlElement: function () {
            let tableElement = document.createElement("table")
            let headRowTrElement = document.createElement("tr")
            this.headTitleList.forEach((headTitle) => {
                let headElement = document.createElement("th")
                headElement.innerText = headTitle
                headRowTrElement.appendChild(headElement)
            });
            tableElement.appendChild(headRowTrElement)

            if (this.cellArray.length != 0) {
                this.cellArray.forEach(row => {
                    let lineTrElement = document.createElement("tr")
                    row.forEach(cell => {
                        let cellTdElement = document.createElement("td")
                        cellTdElement.innerText = cell
                        lineTrElement.appendChild(cellTdElement)
                    });
                    tableElement.appendChild(lineTrElement)
                });
            }
            return tableElement
        },

        push: function (contentList) {
            if (contentList.length == headTitleList.length) {
                this.cellArray.push(contentList)
            }
            else {
                throw "Internal Error, directory table received push request whose array length is inconsistant with the head"
            }
        },

        removeByFileName: function (file) {
            this.cellArray.forEach(function (item, index, arr) {
                if (item[0] == file) {
                    arr.splice(index, 1);
                }
            })
        },

        hasFileName: function (fileName) {
            for (const row of this.cellArray) {
                if (row[0] == fileName) {
                    return true
                }
            }
            return false
        },

        getRowByFileName: function (fileName) {
            for (const row of this.cellArray) {
                if (row[0] == fileName) {
                    return row
                }
            }
        },

        renderToDirectoryView: function () {
            let main = document.getElementById("directory-table")
            if (main.hasChildNodes()) {
                main.removeChild(main.childNodes[0])
            }
            main.appendChild(this.toHtmlElement())
        },

        renderToBlock: function (block) {
            if (block) {
                block.addEventListener("click", (event) => {
                    if (BlockManager().blockIsFull(block)) {
                        this.renderToDirectoryView()
                    }
                })
            }
        },

        renderToBlockById: function (id) { this.renderToBlock(BlockManager().getBlockById(id)) }
    }

    return dt
}

function renderMessage(message) {
    document.getElementById("messages").innerText = message;
}

function splitDirectories(rawDirectory) {
    let dirs = rawDirectory.trim().split("/")

    dirs.forEach(function (item, index, arr) {
        if (!item) {
            arr.splice(index, 1);
        }
    })

    if (dirs.length > 1) {
        return dirs.slice(1)
    }
    else {
        return []
    }
}

module.exports = {
    "InstructionParser": InstructionParser,
    "initGeneralEnvironment": initGeneralEnvironment,
    "BlockManager": BlockManager,
    "renderMessage": renderMessage,
    "DirectoryTable": DirectoryTable,
    "splitDirectories": splitDirectories
}