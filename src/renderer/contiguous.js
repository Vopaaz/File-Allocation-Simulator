const { BlockManager, initEverything } = require('./util.js')

initEverything()

const stepButton = document.getElementById('step')

stepButton.addEventListener('click', (event) => {
    bm = BlockManager()
    if (window.instructionInited) {
        if (window.toExecInstructionId < window.totalInstructions) {
            instruction = window.instructions[window.toExecInstructionId++]
        }
        else{
            alert("All instructions are executed.")
        }
    }
    else {
        alert("Instructions data not initialized.")
    }
})
