const readline = require('readline');
const puppeteer = require('puppeteer');
const Promise = require("bluebird");
const text = require(__dirname + '/data/text.js');
//const CREDS = require(__dirname + '/user/creds.js');
// const fs = require('fs');


(async () => {
    let wargs = puppeteer.defaultArgs()

    function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele !== value;
        });
    }

    wargs = arrayRemove(wargs, '--password-store=basic');
    wargs = arrayRemove(wargs, '--hide-scrollbars');
    wargs = arrayRemove(wargs, '--use-mock-keychain');
    wargs = arrayRemove(wargs, '--disable-extensions');
    wargs = arrayRemove(wargs, '--disable-sync');
    wargs = arrayRemove(wargs, '--headless')
    wargs = arrayRemove(wargs, 'about:blank')
    const userdata = process.env.userdata
    const chromeexe = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
    wargs.push('--no-sandbox');
    // wargs.push('--start-fullscreen');
    //wargs.push('--new-window');
    let browser = await puppeteer.launch({
        userDataDir: userdata,
        executablePath: chromeexe,
        ignoreDefaultArgs: ['--headless', '--password-store=basic', '--disable-extensions', '--hide-scrollbars'],
        args: wargs
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 980,
        deviceScaleFactor: .6
    }); //
    await page.goto('https://quickview.geo-instruments.com/index.php', {
        waitUntil: 'domcontentloaded'
    });
    await page.setDefaultNavigationTimeout(0);
    const dimensions = await page.evaluate(() => {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio
        };
    });

    console.log('Dimensions:', dimensions);
    console.log('Interactive Browser session initiated:\n');

    // @formatter:off

    async function logInButton(browser, page) {
        try {
            await page.waitForSelector('.main-panel > .content > #login > form > .btn')
            await page.click('.main-panel > .content > #login > form > .btn')
        } catch (error) {console.log('Caught:', error.message)}}

    async function ChangeProject(browser, page) {
        // Navigate to Plot
        await page.waitFor(1000)
        await page.waitForSelector('.sidebar-wrapper > .nav > #menuProjects > a > p')
        await page.click('.sidebar-wrapper > .nav > #menuProjects > a > p')

        await page.hover('body > div.wrapper > div.sidePanel.ui-resizable > div.panelHeading')
        await page.waitFor(1000)
        await page.waitForSelector('.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')
        await page.click('.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')

    }


    async function ViewGraph(browser, page) {
        //Preform this function during Raw Input Interactive browser session
        //Input Key:
        await page.waitFor(1000)
        await page.waitForSelector('#objects > img:nth-child(1)')
        await page.click('#objects > img:nth-child(1)')
        await page.waitForSelector('#viewGraphBtn')
        await page.click('#viewGraphBtn')
    }

    async function ClearDates(browser, page) {
        // clear default dates
        await page.waitForSelector('#formInner0 > div.graphButtons > div > div:nth-child(1)')
        await page.click('#formInner0 > .graphButtons > div > .graphButton:nth-child(1)')

        await page.waitFor(3000)
        await page.waitForSelector('form #list2 #selectAllBtn')
        await page.click('form #list2 #selectAllBtn')

        await page.waitFor(2000)
        await page.waitForSelector('form #deleteBtn')
        await page.click('form #deleteBtn')

        const elements = await page.$x('/html/body/div[1]/div[5]/div[2]/form/div/div/button[2]')
        await elements[0].click()
    }

    async function TypeDate(browser, page) {
        let date = await UserInputDialog(browser, page, 'Start Date: \n');
        await page.click('#sDateTxt')

        await page.keyboard.down('Control')
        await page.keyboard.down('A')
        await page.keyboard.up('A')
        await page.keyboard.up('Control')

        await page.type('#sDateTxt', date)
        await page.keyboard.press("Enter");

        await page.waitFor(1000)
        await page.waitForSelector('#dateList1Body > tr:nth-child(1) > td.text-center')
        await page.click('#dateList1Body > tr:nth-child(1) > td.text-center')

        await page.waitFor(1000)
        await page.waitForSelector('#moveRightBtn > i')
        await page.click('#moveRightBtn > i')

        await page.waitForSelector('#btnApply')
        await page.click('#btnApply')
    }

    async function ChangeDate() {
        await page.waitForSelector('#dialogSAA3Phase\ 5 > #formInner32 > .graphButtons > div > .graphButton:nth-child(1)')
        await page.click('#dialogSAA3Phase\ 5 > #formInner32 > .graphButtons > div > .graphButton:nth-child(1)')

        await page.waitForSelector('#dateList2Container > #dateList2 > #dateList2Body > tr > .text-center')
        await page.click('#dateList2Container > #dateList2 > #dateList2Body > tr > .text-center')

        await page.waitForSelector('.tab-content > #link1 #moveLeftBtn')
        await page.click('.tab-content > #link1 #moveLeftBtn')

        await page.waitForSelector('#dialogDelete > #formInner38 > form > .text-center > .form-group')
        await page.click('#dialogDelete > #formInner38 > form > .text-center > .form-group')

        await page.waitForSelector('#formInner38 #btnApply')
        await page.click('#formInner38 #btnApply')

        await page.waitForSelector('#link1 #sDateTxt')
        await page.click('#link1 #sDateTxt')
    }

    async function fromDate() {
        await page.waitForSelector('#dateList1Container > #dateList1 > #dateList1Body > tr:nth-child(1) > .text-center')
        await page.click('#dateList1Container > #dateList1 > #dateList1Body > tr:nth-child(1) > .text-center')
        await page.waitFor(2000);

        await page.waitForSelector('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
        await page.click('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')

        await page.waitForSelector('#dialogDateSelector > #formInner37 #btnApply')
        await page.click('#dialogDateSelector > #formInner37 #btnApply')
    }

    async function TurnOnRaw(browser, page) {process.stdin.setRawMode(true);}

    async function TurnOffRaw(browser,page) {process.stdin.setRawMode(false);}

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

    async function ConsoleHelp() {
        console.log(text.Help);
        console.log(text.TypeDate);
        console.log(text.ChangeDate);
        console.log(text.fromDate);
        console.log(text.logInButton);
        console.log(text.ChangeProject);
        console.log(text.ClearDates);
        console.log(text.ViewGraph);
        console.log(text.TurnOnRaw);
        console.log(text.TurnOffRaw);
    }
    process.stdin.on('keypress', async (str, key) => {if (key.sequence === '\u0003') {await browser.close();process.exit();}
        if (['h'].includes(key.name))     {console.log('Help');try {await ConsoleHelp()} catch (error) {console.log('Caught:', error.message)}}
        if (['up'].includes(key.name))    {console.log('TypeDate');try {await TypeDate(browser, page)} catch (error) {console.log('Caught:', error.message)}}
        if (['down'].includes(key.name))  {console.log('TypeDate');try {await TypeDate(browser, page)} catch (error) {console.log('Caught:', error.message)}}
        if (['left'].includes(key.name))  {console.log('ChangeDate');try {await ChangeDate(browser, page);} catch (error) {console.log('Caught:', error.message)}}
        if (['right'].includes(key.name)) {console.log('fromDate');try {await fromDate(browser, page);} catch (error) {console.log('Caught:', error.message)}}
        if (['l'].includes(key.name))     {console.log('logInButton');try {await logInButton(browser, page);} catch (error) {console.log('Caught:', error.message)}}
        if (['p'].includes(key.name))     {console.log('ChangeProject');try {await ChangeProject(browser, page);} catch (error) {console.log('Caught:', error.message)}}
        if (['c'].includes(key.name))     {console.log('ClearDates');try {await ClearDates(browser, page);} catch (error) {console.log('Caught:', error.message)}}
        if (['g'].includes(key.name))     {console.log('ViewGraph');try {await ViewGraph(browser, page);} catch (error) {console.log('Caught:', error.message)}}
        if (['r'].includes(key.name))     {console.log('TurnOnRaw');try {await TurnOnRaw(browser, page);} catch (error) {console.log('Caught:', error.message)}}
        if (['t'].includes(key.name))     {console.log('TurnOffRaw');try {await TurnOffRaw(browser, page);} catch (error) {console.log('Caught:', error.message)}}
    }); // @formatter:on
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

})();