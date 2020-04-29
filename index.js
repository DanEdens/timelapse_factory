const Promise = require("bluebird");
const puppeteer = require("puppeteer-extra");

const text = require('./lib/text');
const url = require('./lib/preseturls');
import Repl from './lib/repl';
import LineUnitizer from './lib/line-unitizer';

global.verbose = true;

(async () => {

    const userdata = process.env.userdata
    const chromeexe = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
    let wargs = puppeteer.defaultArgs();
    wargs.push('--no-sandbox');
    wargs.push('--no-sync');
    // wargs.push('--executablePath: ' + chromeexe);
    // wargs.push('--start-fullscreen');
    // wargs.push('--new-window');
    let browser = await puppeteer.launch({
        userDataDir: userdata,
        executablePath: chromeexe,
        ignoreDefaultArgs: ['--headless', '--password-store=basic', '--disable-extensions', '--hide-scrollbars'],
        args: wargs,
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 980,
        deviceScaleFactor: .6,
    }); //
    await page.goto('https://quickview.geo-instruments.com/index.php', {
        waitUntil: 'domcontentloaded',
    });
    await page.setDefaultNavigationTimeout(0);
    const dimensions = await page.evaluate(() => {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio,
        };
    });

    if (verbose) {
        console.log('Window Dimensions:', dimensions)
    }
    console.log('Interactive Browser session initiated:\n')

    async function UserInputDialog(browser, page, value) {
        return new Promise(async (resolve) => {
            const result = await page.evaluate((msg) => {
                return new Promise((resolve) => {
                    resolve(prompt(msg));
                });
            }, value);
            resolve(result);
        })
    }

    process.stdin
        .pipe(new LineUnitizer())
        .pipe(new Repl()
                // @formatter:off
            .on("exit", function (args) {
                console.log(args);
                process.exit();
            })
            .on("add", function (args) {
                var sum = args.map(Number).reduce((a, b) => a + b, 0);
                console.log("add result: %d", sum);
            })
            .on("shout", function (args) {
                var allcaps = args.map(s => s.toUpperCase()).join(" ");
                console.log(allcaps);
            })
            // .on("url", async function (args) {await page.goto('$(url.$(args))', {waitUntil: 'domcontentloaded'});})
            .on("login", async function (args) {try {
                    await page.waitForSelector('.main-panel > .content > #login > form > .btn')
                    await page.click('.main-panel > .content > #login > form > .btn')
                } catch (error) {console.log('Caught:', error.message)}})
            .on("riverside", async function (args) {
                // Navigate to Plot
                await page.waitFor(1000)
                await page.waitForSelector('.sidebar-wrapper > .nav > #menuProjects > a > p')
                await page.click('.sidebar-wrapper > .nav > #menuProjects > a > p')

                await page.hover('body > div.wrapper > div.sidePanel.ui-resizable > div.panelHeading')
                await page.waitFor(1000)
                await page.waitForSelector('.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')
                await page.click('.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')
            })
            .on("setdate", async function (args) {
                function formatDate(date) {
                    let d = new Date(date),
                        month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear();

                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;

                    return [year, month, day].join('-');
                }

                let date = formatDate(args)
                await page.click('#sDateTxt')
                await page.waitFor(5)
                await page.keyboard.down('Control')
                await page.keyboard.down('A')
                await page.waitFor(5)
                await page.keyboard.up('A')
                await page.keyboard.up('Control')

                await page.waitFor(1000)
                await page.type('#sDateTxt', date)
                await page.waitFor(1000)
                await page.keyboard.press("Enter")
            })
            .on("adddate", async function (args) {
                await page.waitForSelector('#dateList1Container > #dateList1 > #dateList1Body > tr:nth-child(1) > .text-center')
                await page.click('#dateList1Container > #dateList1 > #dateList1Body > tr:nth-child(1) > .text-center')
                await page.waitFor(2000);

                await page.waitForSelector('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
                await page.click('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')

                await page.waitForSelector('#dialogDateSelector > #formInner37 #btnApply')
                await page.click('#dialogDateSelector > #formInner37 #btnApply')
            })
            .on("clear", async function (args) {
                // clear default dates
                await page.waitForSelector('#formInner0 > div.graphButtons > div > div:nth-child(1)')
                await page.click('#formInner0 > .graphButtons > div > .graphButton:nth-child(1)')

                await page.waitFor(2000)
                await page.waitForSelector('form #list2 #selectAllBtn')
                await page.click('form #list2 #selectAllBtn')

                await page.waitFor(1000)
                await page.waitForSelector('form #deleteBtn')
                await page.click('form #deleteBtn')

                await page.waitFor(1000)
                const elements = await page.$x('/html/body/div[1]/div[5]/div[2]/form/div/div/button[2]')
                await elements[0].click()
            })
            .on("graph", async function (args) {
                await page.waitFor(500)
                await page.waitForSelector('#objects > img:nth-child(1)')
                await page.click('#objects > img:nth-child(1)')
                await page.waitForSelector('#viewGraphBtn')
                await page.click('#viewGraphBtn')
            })
            .on("apply", async function (args) {
                const elements = await page.$x('/html/body/div[1]/div[4]/div[2]/form/div/div[1]/div/div[1]/div/div[1]/div[3]/table/tbody/tr[1]/td[2]/div')
                await elements[0].click()
                await page.waitFor(500)

                await page.waitForSelector('#moveRightBtn > i')
                await page.waitFor(500)
                await page.click('#moveRightBtn > i')

                await page.waitFor(500)
                await page.click('#btnApply')
            })
            .on("fixcal", async function (args) {try {
                    const elements = await page.$x('/html/body/div[1]/div[4]/div[2]/form/div/div[1]/div/div[1]/div/div[1]/div[1]/label')
                    await elements[0].click()} catch (error) {console.log('Caught:', error.message)}})
            .on("rawon", async function (args) {process.stdin.setRawMode(true);})
            .on("rawoff", async function (args) {process.stdin.setRawMode(false);})
            .on("key_enter", async function (args) {await page.keyboard.type(String.fromCharCode(13));})
            .on("key-esc", async function (args) {await page.keyboard.type(String.fromCharCode(27));})
            .on("togverb", async function (args) {if (global.verbose) {global.verbose = !global.verbose}})
            .on("mix", async function (args) {{await page.goto(url.mix, {waitUntil: 'domcontentloaded'});}})
            .on("qv", async function (args) {{await page.goto(url.qv, {waitUntil: 'domcontentloaded'});}})
            .on("vortex", async function (args) {{await page.goto(url.vortex, {waitUntil: 'domcontentloaded'});}})
            .on("capitol", async function (args) {{await page.goto(url.capitol, {waitUntil: 'domcontentloaded'});}})
            .on("audi", async function (args) {{await page.goto(url.audi, {waitUntil: 'domcontentloaded'});}})
            .on("facebook", async function (args) {{await page.goto(url.facebook, {waitUntil: 'domcontentloaded'});}})
            .on("dash", async function (args) {{await page.goto(url.dash, {waitUntil: 'domcontentloaded'});}})
            .on("dashui", async function (args) {{await page.goto(url.dashui, {waitUntil: 'domcontentloaded'});}})
            .on("console", async function (args) {{await page.goto(url.console, {waitUntil: 'domcontentloaded'});}})
            .on("certify", async function (args) {{await page.goto(url.certify, {waitUntil: 'domcontentloaded'});}})
            .on("darkmode", async function (args) {{await page.goto(url.darkmode, {waitUntil: 'domcontentloaded'});}})
            .on("sportal", async function (args) {{await page.goto(url.sportal, {waitUntil: 'domcontentloaded'});}})
            .on("google", async function (args) {{await page.goto(url.google, {waitUntil: 'domcontentloaded'});}})
            // @formatter:off
        );
})();
