# Simulation-js-comments

The requirements of the project contains "sufficient inline comments", however, `contiguous.js`, `indexed.js`, `linked.js` have identical basic structure. It would be wasteful if three sets of indentical comment strings appear in those files. Thus, this document will state the common parts, and leave the inline comments to state the algorithm-specific part.

- [Simulation-js-comments](#Simulation-js-comments)
  - [Code Structure](#Code-Structure)
  - [Data Structure](#Data-Structure)

## Code Structure

The three javascript file shares the following structure:

```javascript
window.tableHead = [] // The table head of the algorithm's directory table
initGeneralEnvironment()
window.otherTableHead = [] // The table head of block pointer table / block index table

function executeNext(){
    // Execute one instruction
}

// Setup the function of step button
const stepButton = document.getElementById('step')
stepButton.addEventListener('click', (event)=> executeNext())

// Setup the function of auto button
const autoBtn = document.getElementById('auto')
function startAuto(){
    // Start automative execution and change the function of auto button to stop automative execution
}
function stopAuto(id){
    // Stop automative execution and change the function of auto button to start automative execution
}
autoBtn.onclick = startAuto

function execute(instruction){
    // According to the operation code of the instruction, invoke:
    // - exeCreate
    // - exeRead
    // - exeWrite
    // - exeDelete
}

function exeCreate(instruction){
    // Execute a create instruction
}

function locateToLookInfoTable(dirs){
    // Locate the file information table which contains the wanted file and initialize the message
    // by iteratively follow the path and look into different layers of directory tables, starting from the main one.
}

function exeRead(instruction){
    // Execute a read instruction
}

function exeWrite(instruction){
    // Execute a write instruction
}

function exeDelete(instruction){
    // Execute a delete instruction
}
```

## Data Structure

As this is only a simulation tool, the implementation of the data structure of the three algorithms is not as-is.

They all uses an array to store the block-related information.

To be more specific, the following data structures must be maintained by the process:

- `window.mainDirTable`: the main directory table
- `window.blockDirTables`: the array which contains information of the directory table in a block
- `window.pointers` (linked) or `window.blockIndexTables` (indexed): the array which contains pointers/index block information in a block
- The block color on the GUI interface (using `BlockManager().setBlockEmpty` or `BlockManager().setBlockFull`)

