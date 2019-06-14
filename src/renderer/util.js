const { ipcRenderer } = require('electron')

function changeBlockStatus(block) {
    if (block.getAttribute("class") == "block-full") {
        block.setAttribute("class", "block-empty")
    }
    else {
        block.setAttribute("class", "block-full")
    }
}

function inputInit() {
    const inputBtn = document.getElementById('input')

    inputBtn.addEventListener('click', (event) => {
        ipcRenderer.send('open-file-dialog')
    })
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
        console.log("Invalid Data line.")
        return null
    }

}

module.exports = {
    "changeBlockStatus": changeBlockStatus,
    "InstructionParser": InstructionParser,
    "inputInit": inputInit
}