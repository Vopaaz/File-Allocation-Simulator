'use strict';

const { ipcRenderer } = require('electron')

function BlockManager() {
    // return an object with various functions which deals with the block coloring and rendering
    // All the functions are named intuitively

    function randColor() {
        // Return a random rgb color for coloring the file blocks
        let r = Math.random() * 180 + 60
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
            // Not apply array.foreach on setBlockFull because they will be colored differently
            // By default, this function colors the blocks in the list with the same color 
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
                throw "<p>All blocks are already full.</p>"
            }
        },

        getOneEmptyBlockId: function () {
            for (let index = 0; index < 200; index++) {
                if (this.blockIsEmptyById(index)) {
                    return index
                }
            }
            throw "<p>All blocks are already full.</p>"
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
            throw "<p>No sufficient blocks.</p>"
        },

        getNumbersContinuousBlocks: function (number) {
            let ids = this.getNumbersContinuousBlocksId(number)
            return this.getBlocksByIdList(ids)
        },

        getNumbersDiscreteBlocksId: function (number) {
            let arr = []
            for (let index = 0; index < 200; index++) {
                if (this.blockIsEmptyById(index)) {
                    arr.push(index)
                    if (arr.length == number) {
                        return arr
                    }
                }
            }
            throw "<p>No sufficient blocks.</p>"
        },

        getNumbersDiscreteBlocks: function (number) {
            return this.getBlocksByIdList(this.getNumbersDiscreteBlocksId(number))
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
            }, 200)

            setTimeout(() => {
                clearInterval(timerId)
                block.innerHTML = original_content
            }, 1700)
        },

        showBlockIsBeingReadById: function (id) {
            this.showBlockIsBeingRead(this.getBlockById(id))
        },

        showBlocksAreBeingRead: function (blocks) {
            blocks.forEach(block => {
                this.showBlockIsBeingRead(block)
            });
        },

        showBlocksAreBeingReadByIdList: function (idList) {
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
            }, 1700);
        },

        showBlockIsBeingWrittenById: function (id) {
            this.showBlockIsBeingWritten(this.getBlockById(id))
        },

        showBlocksAreBeingWritten: function (blocks) {
            blocks.forEach(block => {
                this.showBlockIsBeingWritten(block)
            });
        },

        showBlocksAreBeingWrittenByIdList: function (idList) {
            idList.forEach(id => {
                this.showBlockIsBeingWrittenById(id)
            });
        },

        derenderBlock: function (block) {
            // Detach a block with some index table / directory table rendered onto it
            if (block) {
                let blockClone = block.cloneNode(true);
                block.parentNode.replaceChild(blockClone, block);
            }
        },

        derenderBlockById: function (id) {
            this.derenderBlock(this.getBlockById(id))
        },

        derenderBlocksByIdList: function (idList) {
            idList.forEach(id => {
                this.derenderBlockById(id)
            });
        }
    }
    return bm
}

function initGeneralEnvironment() {
    // Initialize general environment in the simulation window
    window.instructionInited = false

    const inputBtn = document.getElementById('input')
    inputBtn.addEventListener('click', (event) => {
        ipcRenderer.send('open-file-dialog')
    })

    // When the "File Information Table" is clicked, display the main directory table
    const fileInfoTblTitle = document.getElementById("file-infomation-table-title")
    fileInfoTblTitle.addEventListener('click', (event) => {
        window.mainDirTable.renderToDirectoryView()
    })

    ipcRenderer.on('selected-file', (event, content) => {
        // When select file button was clicked, clear everything caused by the last simulation
        window.instructions = null
        window.totalInstructions = 0
        window.toExecInstructionId = 0
        window.instructionInited = false
        window.blockDirTables = []
        window.pointers = []
        window.blockIndexTables = []
        window.mainDirTable = DirectoryTable(window.tableHead)
        window.mainDirTable.renderToDirectoryView()
        let bm = BlockManager()
        for (let index = 0; index < 200; index++) {
            bm.setBlockEmptyById(index)
            bm.derenderBlockById(index)
        }
        clearRawInstructionTable()
        renderMessage("")

        // Try reading the input file and parse it into instructions
        try {
            let parser = InstructionParser(content)
            window.instructions = parser.instructions
            window.totalInstructions = window.instructions.length
            window.toExecInstructionId = 0
            window.instructionInited = true

            renderRawInstructionTable()

            window.mainDirTable = DirectoryTable(window.tableHead)
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
    // Display the instructions from the data file onto the top-right section on the simulation page
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
    // Parse the raw content in a file to several Instructions
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
    // The constructor reads a line in the data file
    // And return an Instruction object
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
        throw "<p>Invalid instruction: '" + contentLine + "'. \nThe commas(separators) in the instruction data file are not placed properly.</p>"
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
        throw "<p>Invalid instruction: '" + contentLine + "'.</p>"
    }

    if (!instruction.directory.startsWith("root")) {
        throw "<p>Invalid instruction: '" + contentLine + "' </p> <p>The directory must starts with 'root'.</p>"
    }

    if (instruction.block < 1) {
        throw "<p>Invalid instruction: '" + contentLine + "' </p> <p>The block field is not an integer which is greater than 1.</p>"
    }

    if (isNaN(instruction.block) && instruction.oprand != "D") {
        throw "<p>Invalid instruction: '" + contentLine + "'.</p> <p>The block field is not a valid integer.</p>"
    }

    if (!inArray(["C", "R", "W", "D"], instruction.oprand)) {
        throw "<p>Invalid instruction: '" + contentLine + "'.</p> <p>The oprand must be C, R, W, or D.</p>"
    }

    return instruction

}

function DirectoryTable(headTitleList) {
    // The directory table object which provides useful functions dealing with directory table manipulation
    let dt = {
        headTitleList: headTitleList,
        cellArray: [],

        toHtmlElement: function () {
            // Return a DOM table object representing the current status of the directory table
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
                throw "<p>Internal Error, directory table received push request whose array length is inconsistant with the head.</p>"
            }
        },

        removeByFileName: function (file) {
            // Remove one line in the table according to its first element
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

        isEmpty: function () {
            return this.cellArray.length == 0
        },

        renderToDirectoryView: function () {
            let main = document.getElementById("directory-table")
            if (main.hasChildNodes()) {
                main.removeChild(main.childNodes[0])
            }
            main.appendChild(this.toHtmlElement())
        },

        renderToBlock: function (block) {
            // When the block is clicked, the table will display in the right section
            if (block) {
                block.addEventListener("click", (event) => {
                    if (BlockManager().blockIsFull(block)) {
                        this.renderToDirectoryView()
                    }
                })
            }
        },

        renderToBlockById: function (id) { this.renderToBlock(BlockManager().getBlockById(id)) },
    }

    return dt
}

function renderMessage(message) {
    // Display the message in the bottom-right section in the simulation page
    document.getElementById("messages").innerHTML = message;
}

function splitDirectories(rawDirectory) {
    // Split directories described in string into array
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