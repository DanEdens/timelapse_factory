const Promise = require('bluebird')
const puppeteer = require('puppeteer-extra')

const argv = require('yargs').argv

const qv = require('./lib/qv_manipulator');
const text = require('./lib/text')
const url = require('./lib/preseturls')
import Repl from './lib/repl'
import LineUnitizer from './lib/line-unitizer'


if (argv.debug) {global.debug = argv.debug} else {global.debug = 0} // -d
global.verbose = argv.verbose
global.preformance = argv.preformance
global.date = '2019-08-26'

function group(msg) {if (debug > '0') {console.group('Group: ' + msg)}}

function groupend(msg) {
    if (debug > '0') {
        console.groupEnd()
        console.log('G End: ' + msg + '\n')
    }
}

function verboselog(msg) {if (verbose) {Debug.print(msg)}}

function performance() {if (global.performance) {console.log(new Date().toISOString())}}

class Debug {
    static async print(data, file) {
        if (file) {} else {file = 'Log.txt'}
        try {
            if (debug === 0) {
                file.write(data)
            } else if (debug === 1) {
                console.log(data)
                file.write(data)
            } else if (debug === 2) {
                console.log(data)
            } else if (debug === 3) {}
        } catch (error) {console.log('Caught:', error.message)}
    };

    static async checkExists(file) {
        let time = new Date().toISOString()
        file.forEach(function (item) {
            try {
                fs.promises.access(item)
            } catch (ENOENT) {
                console.log('Created File at:\n' + item)
                fs.writeFileSync(item, 'Created on: ' + time, { flag: 'w' },
                    function (err) {if (err) throw err})
                return
            }
        })
        return
    }
}

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
        }).on('shout', function (args) {
            let allcaps = args.map(s => s.toUpperCase()).join(' ')
            console.log(allcaps)
        }).on('BROKENurl', async function (args) {
            await page.goto('$(url.$(args))', { waitUntil: 'domcontentloaded' })
        }).on('login', async function (args) {
            if (verbose) {group('login')}
            try {
                await page.waitForSelector(
                    '.main-panel > .content > #login > form > .btn')
                await page.click('.main-panel > .content > #login > form > .btn')
            } catch (error) {console.log('Caught:', error.message)}
            if (verbose) {groupend('login')}
        }).on('riverside', async function (args) {
            if (verbose) {group('navtoriverside')}
            await page.waitFor(1000)
            await page.waitForSelector(
                '.sidebar-wrapper > .nav > #menuProjects > a > p')
            await page.click('.sidebar-wrapper > .nav > #menuProjects > a > p')

            await page.hover(
                'body > div.wrapper > div.sidePanel.ui-resizable > div.panelHeading')
            await page.waitFor(1000)
            await page.waitForSelector(
                '.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')
            await page.click(
                '.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')
            if (verbose) {groupend('navtoriverside')}
        }).on('setdate', async function (args) {
            if (verbose) {group('set Date')}

            function formatDate(date) {
                let d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear()
                if (month.length < 2) month = '0' + month
                if (day.length < 2) day = '0' + day
                return [year, month, day].join('-')
            }

            global.date = formatDate(args)
            await page.click('#sDateTxt')
            await page.waitFor(5)
            await page.keyboard.down('Control')
            await page.keyboard.down('A')
            await page.waitFor(5)
            await page.keyboard.up('A')
            await page.keyboard.up('Control')

            await page.waitFor(1000)
            await page.type('#sDateTxt', global.date)
            console.log(global.date) //TODO:delete
            await page.waitFor(1000)
            await page.keyboard.press('Enter')
            try {
                const elements = await page.$x(
                    '/html/body/div[1]/div[4]/div[2]/form/div/div[1]/div/div[1]/div/div[1]/div[1]/label')
                await elements[0].click()
            } catch (error) {console.log('Caught:', error.message)}
            if (verbose) {groupend('set Date')}
        }).on('adddate', async function (args) {

            if (verbose) {group('add date')}
            await page.waitForSelector(
                '#dateList1Container > #dateList1 > #dateList1Body > tr:nth-child(1) > .text-center')
            await page.click(
                '#dateList1Container > #dateList1 > #dateList1Body > tr:nth-child(1) > .text-center')
            await page.waitFor(2000)

            await page.waitForSelector(
                '#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
            await page.click(
                '#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')

            await page.waitForSelector(
                '#dialogDateSelector > #formInner37 #btnApply')
            await page.click('#dialogDateSelector > #formInner37 #btnApply')
            if (verbose) {groupend('add date')}
        }).on('clear', async function (args) {
            // clear default dates
            await clearDates()
        }).on('displayDate', async function (args) {
            let elements = await page.$x('/html/body/div[2]/div[8]/div[1]/span')
            await elements[0].click()
        }).on('graph', async function (args) {
            if (verbose) {group('nav to graph')}
            await page.waitFor(500)
            await page.waitForSelector('#objects > img:nth-child(1)')
            await page.click('#objects > img:nth-child(1)')
            await page.waitForSelector('#viewGraphBtn')
            await page.click('#viewGraphBtn')
            if (verbose) {groupend('nav to graph')}
        }).on('apply', async function (args) {
            if (verbose) {group('select and apply new date')}
            const elements = await page.$x(
                '/html/body/div[1]/div[4]/div[2]/form/div/div[1]/div/div[1]/div/div[1]/div[3]/table/tbody/tr[1]/td[2]/div')
            await elements[0].click()
            await page.waitFor(500)

            await page.waitForSelector('#moveRightBtn > i')
            await page.waitFor(500)
            await page.click('#moveRightBtn > i')

            await page.waitFor(500)
            await page.click('#btnApply')
            if (verbose) {groupend('select and apply new date')}
        }).on('fixcal', async function (args) {
            try {
                const elements = await page.$x(
                    '/html/body/div[1]/div[4]/div[2]/form/div/div[1]/div/div[1]/div/div[1]/div[1]/label')
                await elements[0].click()
            } catch (error) {console.log('Caught:', error.message)}
        }).on('rawon', async function (args) {
            if (verbose) {group('rawMode')}
            process.stdin.setRawMode(true)
            console.log('Raw mode ---')
        }).on('rawoff', async function (args) {
            if (verbose) {groupend('rawMode')}
            process.stdin.setRawMode(false)
        }).on('key_enter', async function (args) {
            await page.keyboard.type(String.fromCharCode(13))
        }).on('zoom', async function (args) {
            let sum = args.map(Number).reduce((a, b) => a + b, 0)
            await session.send('Emulation.setPageScaleFactor', { pageScaleFactor: sum })
        }).on('key-esc', async function (args) {
            await page.keyboard.type(String.fromCharCode(27))
        }).on('togverb', async function (args) {
            global.verbose = !(global.verbose)
        }).on('screenshot', async function (args) {
            await page.screenshot({ path: '.\\data\\Screenshots\\' + global.date + '.png' })
            verboselog(global.date + '.png')
        }).on('open', async function (args) {
            const { exec } = require('child_process')
            exec('.\\data\\Screenshots\\' + global.date + '.png', (err, stdout, stderr) => {
                if (err) {console.error(err)} else {}
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
