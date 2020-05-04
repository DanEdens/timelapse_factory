import Repl from './lib/repl'
import LineUnitizer from './lib/line-unitizer'
import * as text from './lib/text'
import * as url from './lib/preseturls'
import * as qv from './lib/qv'
import * as input from './lib/input'

const Promise = require('bluebird')
const puppeteer = require('puppeteer-extra')
const mqtt = require('mqtt')

const aws = mqtt.connect('3.134.3.199:1884')
const argv = require('yargs').argv

global.debug = argv.debug
global.verbose = argv.verbose
global.preformance = argv.preformance
let x = argv.x || 50
let y = argv.y || 50
if (argv.date) {global.date = argv.date} else {global.date = '2019-08-26'}

export function group(msg) {if (global.debug) {console.group('Group: ' + msg)}}

export function groupend(msg) {
    if (global.debug) {
        console.groupEnd()
        console.log('G End: ' + msg + '\n')
    }
}

export function verboselog(msg) {if (verbose) {console.log(msg)}}

export function performance() {if (global.performance) {console.log(new Date().toISOString())}}

(async () => {
    const run_timer = new Date().toISOString()
    if (global.performance || global.verbose) {console.log(run_timer)}
    let wargs = puppeteer.defaultArgs()
    wargs.push('--no-sandbox')
    // wargs.push('--start-fullscreen')
    wargs.push('--new-window')
    let browser = await puppeteer.launch({
        userDataDir: process.env.userdata,
        executablePath: process.env.chromeexe,
        windowPosition: '${x},${y}',
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
            await qv.login(browser, page)
        }).on('riverside', async function (args) {
            await qv.riverside(browser, page)
        }).on('setdate', async function (args) {
            await qv.setdate(browser, page, args)
        }).on('adddate', async function (args) {
            await qv.adddate(browser, page)
        }).on('clear', async function () {
            await qv.clearDates(browser, page)
        }).on('displayDate', async function () {
            await qv.displayDate(browser, page)
        }).on('graph', async function () {
            await qv.graph(browser, page)
        }).on('apply', async function () {
            await qv.apply(browser, page)
        }).on('fix cal', async function () {
            await qv.fixCalender(browser, page)
        }).on('raw_', async function () {
            await input.rawSession(browser, page)
        }).on('raw on', async function () {
            await input.rawOn()
        }).on('raw off', async function () {
            await input.rawOff()
        }).on('key enter', async function () {
            await input.key_enter(browser, page)
        }).on('key esc', async function (args) {
            await input.key_esc(browser, page)
        }).on('zoom', async function (args) {
            let sum = args.map(Number).reduce((a, b) => a + b, 0)
            await session.send('Emulation.setPageScaleFactor', { pageScaleFactor: sum })
        }).on('toggle verbose', async function (args) {
            global.verbose = !(global.verbose)
        }).on('screenshot', async function () {
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



