import Repl from './lib/repl'
import LineUnitizer from './lib/line-unitizer'
import * as text from './lib/text'
import * as url from './lib/preseturls'
import * from './lib/qv'

const Promise = require('bluebird')
const puppeteer = require('puppeteer-extra')

const argv = require('yargs').argv

global.debug = argv.debug
global.verbose = argv.verbose
global.preformance = argv.preformance
if (argv.date) {global.date = argv.date} else {global.date = '2019-08-26'}

export function group(msg) {console.group('Group: ' + msg)}

export function groupend(msg) {
    console.groupEnd()
    console.log('G End: ' + msg + '\n')
}

export function verboselog(msg) {if (verbose) {console.log(msg)}}

export function performance() {if (global.performance) {console.log(new Date().toISOString())}}

(async () => {
    let runtime = new Date().toISOString()
    if (global.performance || global.verbose) {console.log(runtime)}
    // if (!x) {let x = 50} if (!y) {let y = 50}
    let wargs = puppeteer.defaultArgs()
    wargs.push('--no-sandbox')
    wargs.push('--no-sync')
    wargs.push('--start-fullscreen')
    wargs.push('--new-window')
    let browser = await puppeteer.launch({
        userDataDir: process.env.userdata,
        // windowPosition: '${x},${y}',
        executablePath: process.env.chromeexe,
        ignoreDefaultArgs: [
            '--headless',
            '--password-store=basic',
            '--disable-extensions',
            '--hide-scrollbars'],
        args: wargs,
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1900, deviceScaleFactor: 1, height: 1080 })

    await page.goto('https://quickview.geo-instruments.com/index.php',
        { waitUntil: 'domcontentloaded' })
    await page.setDefaultNavigationTimeout(0)
    const session = await page.target().createCDPSession()
    const dimensions = await page.evaluate(() => {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio,
        }
    })

    group('Main - REPL')
    if (global.verbose) {console.log('Window Dimensions:', dimensions)}
    console.log('Interactive Browser session initiated:\n')

    process.stdin.pipe(new LineUnitizer()).pipe(new Repl()
        .on('exit', function (args) {
            group('exitmsg')
            console.log('\n' + text.exitmessage)
            groupend('Main - REPL')
            if (global.performance) {console.log(new Date().toISOString())}
            groupend('exitmsg')
            process.exit()
        }).on('add', function (args) {
            let sum = args.map(Number).reduce((a, b) => a + b, 0)
            console.log('add result: %d', sum)
        }).on('BROKENurl', async function (args) {
            await page.goto('$(url.$(args))', { waitUntil: 'domcontentloaded' })
        }).on('login', async function (args) {
            await login(browser, page)
        }).on('riverside', async function (args) {
            await riverside(browser, page)
        }).on('setdate', async function (args) {
            await setdate(browser, page, args)
        }).on('adddate', async function (args) {
            await adddate(browser, page)
        }).on('clear', async function () {
            await clearDates(browser, page)
        }).on('displayDate', async function () {
            await displayDate(browser, page)
        }).on('graph', async function () {
            await graph(browser, page)
        }).on('apply', async function () {
            await apply(browser, page)
        }).on('fixcal', async function () {
            await fixCalender(browser, page)
        }).on('raw_', async function () {
            await rawSession(browser, page)
        }).on('rawon', async function () {
            await rawOn()
        }).on('rawoff', async function () {
            await rawOff()
        }).on('key_enter', async function () {
            await key_enter(browser, page)
        }).on('zoom', async function (args) {
            let sum = args.map(Number).reduce((a, b) => a + b, 0)
            await session.send('Emulation.setPageScaleFactor', { pageScaleFactor: sum })
        }).on('key_esc', async function (args) {
            await key_esc(browser, page)
        }).on('togverb', async function (args) {
            global.verbose = !(global.verbose)
        }).on('screenshot', async function (args) {
            await page.screenshot({ path: '.\\data\\Screenshots\\' + global.date + '.png' })
            verboselog(global.date + '.png')
        }).on('open', async function (args) {
            const { exec } = require('child_process')
            exec('.\\data\\Screenshots\\' + global.date + '.png', (err, stdout, stderr) => {
                if (err) {console.error(err)} else {}
            })
        }).on('mix', async function (args) {
            await page.goto(url.mix, { waitUntil: 'domcontentloaded' })
        }).on('qv', async function (args) {
            await page.goto(url.qv, { waitUntil: 'domcontentloaded' })
        }).on('vortex', async function (args) {
            await page.goto(url.vortex, { waitUntil: 'domcontentloaded' })
        }).on('capitol', async function (args) {
            await page.goto(url.capitol, { waitUntil: 'domcontentloaded' })
        }).on('audi', async function (args) {
            await page.goto(url.audi, { waitUntil: 'domcontentloaded' })
        }).on('facebook', async function (args) {
            await page.goto(url.facebook, { waitUntil: 'domcontentloaded' })
        }).on('dash', async function (args) {
            await page.goto(url.dash, { waitUntil: 'domcontentloaded' })
        }).on('dashui', async function (args) {
            await page.goto(url.dashui, { waitUntil: 'domcontentloaded' })
        }).on('console', async function (args) {
            await page.goto(url.console, { waitUntil: 'domcontentloaded' })
        }).on('certify', async function (args) {
            await page.goto(url.certify, { waitUntil: 'domcontentloaded' })
        }).on('darkmode', async function (args) {
            await page.goto(url.darkmode, { waitUntil: 'domcontentloaded' })
        }).on('sportal', async function (args) {
            await page.goto(url.sportal, { waitUntil: 'domcontentloaded' })
        }).on('google', async function (args) {
            await page.goto(url.google, { waitUntil: 'domcontentloaded' })
        }),
    )
})()



