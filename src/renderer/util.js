const { ipcRenderer } = require('electron')

function BlockManager() {
    let bm = {
        getBlockById: function (id) {
            return document.getElementById('block-' + String(id))
        },

        setBlockFull: function (block) {
            block.setAttribute("class", "block-full")
        },

        setBlockEmpty: function (block) {
            block.setAttribute("class", "block-empty")
        },

        blockIsFull: function (block) {
            return block.getAttribute("class") == "block-full"
        },

        blockIsEmpty: function (block) {
            return block.getAttribute("class") == "block-empty"
        },

        setBlockFullById: function (id) {
            this.setBlockFull(this.getBlockById(id))
        },

        setBlockEmptyById: function (id) {
            this.setBlockEmpty(this.getBlockById(id))
        },

        blockIsFullById: function (id) {
            return this.blockIsFull(this.getBlockById(id))
        },

        blockIsEmptyById: function (id) {
            return this.blockIsEmpty(this.getBlockById(id))
        },

        changeBlockStatus: function (block) {
            if (this.blockIsFull(block)) {
                this.setBlockEmpty(block)
            }
            else if (this.blockIsEmpty(block)) {
                this.setBlockFull(block)
            }
        },

        changeBlockStatusById: function (id) {
            let block = this.getBlockById(id)
            this.changeBlockStatus(block)
        }
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
        let parser = InstructionParser(content)
        window.instructions = parser.instructions
        window.totalInstructions = window.instructions.length
        window.toExecInstructionId = 0
        window.instructionInited = true

        renderRawInstructionTable()
    })
}

function renderRawInstructionTable() {
    function tdWrapper(content) {
        return "<td>" + content + "</td>"
    }

    tablecontent = "<table>"
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
    lines = content.split("\n")
    instructions = []

    for (const line of lines) {
        let instruction = Instruction(line)
        if (instruction) {
            instructions.push(instruction)
        }
    }

    let parser = {
        instructions: instructions
    }
    return parser
}


function Instruction(contentLine) {
    function charNumInString(string, char) {
        let count = 0
        for (const str_char of string) {
            if (str_char == char) {
                count++
            }
        }
        return count
    }

    function lineIsValid(line) {
        return charNumInString(line, ",") == 3
    }

    if (lineIsValid(contentLine)) {
        let arr = contentLine.split(",")
        let instruction = {
            directory: arr[0].trim(),
            fileName: arr[1].trim(),
            block: parseInt(arr[2].trim()),
            oprand: arr[3].trim()
        }
        return instruction
    }
    else {
        console.log("Invalid Data line: '" + contentLine + "'")
        return null
    }

}

module.exports = {
    "InstructionParser": InstructionParser,
    "initEverything": initEverything,
    "BlockManager": BlockManager
}