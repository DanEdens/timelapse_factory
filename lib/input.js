const got = require('got');
const eol = require('os').EOL;
const readline = require('readline');


readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function getStockQuote(symbol) {
    const url = `https://finance.google.com/finance?q=${symbol}&output=json`;
    got(url)
        .then(response => {
            // Must remove the first three characters of the Google finance text returned to parse JSON.
            const stock = JSON.parse(response.body.substr(3));
            const quote = stock[0];
            console.log(`${quote.t} ${quote.l} ${quote.c} (${quote.cp}%)`);
        })
        .catch(error => {
            console.log(error.response.body);
        });
}

const keyMap = new Map();
keyMap.set('a', 'AAPL');
keyMap.set('b', 'BA');
keyMap.set('c', 'CSCO');
keyMap.set('d', 'DD');
keyMap.set('e', 'XOM');
keyMap.set('f', 'FB');
keyMap.set('g', 'GOOGL');
keyMap.set('m', 'MSFT');

function listKeys() {
    console.log(`${eol}keys`);
    keyMap.forEach((value, key) => {
        console.log(`${key} - ${value}`);
    });
    console.log();
}

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit(); // eslint-disable-line no-process-exit
    } else if (key.name === 'l') {
        listKeys();
    } else {
        if (keyMap.has(str)) {
            getStockQuote(keyMap.get(str));
        } else {
            console.log(`No symbol defined for "${str}" key.`);
        }
    }
});
console.log('Press a key to retrieve a stock price');
