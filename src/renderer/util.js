function changeBlockStatus(block) {
    if (block.getAttribute("class") == "block-full") {
        block.setAttribute("class", "block-empty")
    }
    else {
        block.setAttribute("class", "block-full")
    }
}

module.exports = {
    "changeBlockStatus": changeBlockStatus,
}