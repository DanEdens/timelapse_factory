const eol = require('os').EOL
const readline = require('readline')
const keymap = require('user/keymap_general')

export function listKeys() {
    console.log(`${eol}keys`)
    keyMap.forEach((value, key) => {
        console.log(`${key} - ${value}`)
    })
    console.log()
}

export async function rawOn() {
    process.stdin.setRawMode(true)
    if (global['verbose']) {console.log('Raw mode ---')}
}

export async function rawOff() {
    process.stdin.setRawMode(false)
    if (global['verbose']) {console.log('Raw mode ---')}
}

export async function rawSession() {
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
}
