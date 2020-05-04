import Repl from './lib/repl'
import LineUnitizer from './lib/line-unitizer'
import * as input from './lib/input'
import * as qv from './lib/qv'
import * as text from './lib/text'
import * as url from './lib/preseturls'

const Promise = require('bluebird')
const puppeteer = require('puppeteer-extra')

const argv = require('yargs').argv

global.debug = argv.debug
global.verbose = argv.verbose
global.preformance = argv.preformance
if (argv.date) {global.date = argv.date} else {global.date = '2019-08-26'}

export function group(msg) {console.group('Group: ' + msg)}
}

export function groupend(msg) {
    console.groupEnd()
    console.log('G End: ' + msg + '\n')
}

export function verboselog(msg) {if (verbose) {Debug.print(msg)}}

export function performance() {if (global.performance) {console.log(new Date().toISOString())}}

(async () => {
    if (preformance) {
        console.log(new Date().toISOString())
    }

    const userdata = process.env.userdata
    const chromeexe = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    // if (!x) {let x = 50}
    // if (!y) {let y = 50}

    let wargs = puppeteer.defaultArgs()
    wargs.push('--no-sandbox')
    wargs.push('--no-sync')
    // wargs.push('--executablePath: ' + chromeexe);
    wargs.push('--start-fullscreen')
    wargs.push('--new-window')
    let browser = await puppeteer.launch({
        userDataDir: userdata,
        // windowPosition: '${x},${y}',
        executablePath: chromeexe,
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

    if (verbose) {console.log('Window Dimensions:', dimensions)}
    console.log('Interactive Browser session initiated:\n')

    async function clearDates() {
        if (verbose) {group('clear old dates')}
        await page.waitForSelector(
            '#formInner0 > div.graphButtons > div > div:nth-child(1)')
        await page.click(
            '#formInner0 > .graphButtons > div > .graphButton:nth-child(1)')

        await page.waitFor(2000)
        await page.waitForSelector('form #list2 #selectAllBtn')
        await page.click('form #list2 #selectAllBtn')

        await page.waitFor(1000)
        await page.waitForSelector('form #deleteBtn')
        await page.click('form #deleteBtn')

        await page.waitFor(1000)
        const elements = await page.$x(
            '/html/body/div[1]/div[5]/div[2]/form/div/div/button[2]')
        await elements[0].click()
        if (verbose) {groupend('clear old dates')}
    }

    process.stdin.pipe(new LineUnitizer()).pipe(new Repl()
        .on('exit', function (args) {
            if (verbose) {group('exitmsg')}
            console.log('\n' + text.exitmessage)
            groupend('Main - REPL')
            performance()
            if (verbose) {groupend('exitmsg')}
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
            await qv.setdate(browser, page)
        }).on('adddate', async function (args) {
            await qv.adddate(browser, page)
        }).on('clear', async function (args) {
            // clear default dates
            await clearDates(browser, page)
        }).on('displayDate', async function (args) {
            await qv.displayDate(browser, page)
        }).on('graph', async function (args) {
            await qv.graph(browser, page)
        }).on('apply', async function (args) {
            await qv.apply(browser, page)
        }).on('fixcal', async function (args) {
            await qv.fixCalender(browser, page)
        }).on('rawon', async function (args) {
            await input.rawon()
        }).on('rawoff', async function (args) {
            await input.rawOff()
        }).on('key_enter', async function (args) {
            await qv.key_enter(browser, page)
        }).on('zoom', async function (args) {
            let sum = args.map(Number).reduce((a, b) => a + b, 0)
            await session.send('Emulation.setPageScaleFactor', { pageScaleFactor: sum })
        }).on('key_esc', async function (args) {
            await qv.key_esc(browser, page)
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
