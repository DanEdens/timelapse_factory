const got = require('got')
const eol = require('os').EOL
const readline = require('readline')
const keymap = require('user/keymap_general')

function listKeys() {
    console.log(`${eol}keys`)
    keyMap.forEach((value, key) => {
        console.log(`${key} - ${value}`)
    })
    console.log()
}

async function rawon() {
    process.stdin.setRawMode(true)
    console.log('Raw mode ---')
}

async function rawoff() {
    process.stdin.setRawMode(false)
}

readline.emitKeypressEvents(process.stdin)
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit() // eslint-disable-line no-process-exit
    } else if (key.name === 'l') {
        listKeys()
    } else {
        if (keyMap.has(str)) {
            //getStockQuote(keyMap.get(str))
        } else {
            console.log(`No symbol defined for "${str}" key.`)
        }
    }
})
console.log('Press a key to run funtion..')

module.exports = {
    listKeys: listKeys,
    rawOn: rawon(),
    rawOff: rawoff(),
}
