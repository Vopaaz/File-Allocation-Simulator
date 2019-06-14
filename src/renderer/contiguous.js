const { BlockManager, initEverything } = require('./util.js')

initEverything()

const stepButton = document.getElementById('step')

stepButton.addEventListener('click', (event) => {
    bm = BlockManager()
    if (window.instructionInited) {
        instruction = window.instructions[window.toExecInstructionId]
        
    }
    else {
        alert("Instructions Data Not Initialized.")
    }
})
