const { BlockManager, initEverything, renderMessage } = require('./util.js')

initEverything()

const stepButton = document.getElementById('step')

stepButton.addEventListener('click', (event) => {
    bm = BlockManager()
    if (window.instructionInited) {
        if (window.toExecInstructionId < window.totalInstructions) {
            instruction = window.instructions[window.toExecInstructionId++]
            renderMessage("Executing instruction "+String(window.toExecInstructionId))
        }
        else {
            renderMessage("All instructions are executed.")
        }
    }
    else {
        renderMessage("Instructions data not initialized.")
    }
})
