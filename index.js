const readline = require('readline');
const puppeteer = require('puppeteer');
const Promise = require("bluebird");
const CREDS = require(__dirname + '/user/creds.js');
// const fs = require('fs');


(async () => {
    let wargs = puppeteer.defaultArgs()

    // console.log(wargs);

    function toDate(date) {
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
    };

    function fromDate() {
        await page.waitFor(4000);
        await page.waitForSelector('#dateList1Container > #dateList1 > #dateList1Body > tr:nth-child(1) > .text-center')
        await page.click('#dateList1Container > #dateList1 > #dateList1Body > tr:nth-child(1) > .text-center')

        await page.waitForSelector('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
        await page.click('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')

        await page.waitForSelector('#dialogDateSelector > #formInner37 #btnApply')
        await page.click('#dialogDateSelector > #formInner37 #btnApply')

        return;
    };

    function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
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
    wargs.push('--start-fullscreen');
    wargs.push('--new-window');
    let browser = await puppeteer.launch({
        userDataDir: userdata,
        executablePath: chromeexe,
        ignoreDefaultArgs: ['--headless', '--password-store=basic', '--disable-extensions', '--hide-scrollbars'],
        args: wargs
    });
    // await fs.promises.mkdir('./data/screenshots', { recursive: true });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: .6
    }); //
    await page.goto('https://quickview.geo-instruments.com/index.php', {
        waitUntil: 'domcontentloaded'
    });
    await page.setDefaultNavigationTimeout(0);
    const navigationPromise = page.waitForNavigation();
    const dimensions = await page.evaluate(() => {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio
        };
    });

    console.log('Dimensions:', dimensions);
    // await navigationPromise;
    async function logIn(browser, page) {
        try {
            await page.type('#user', CREDS.qvuser);
            await page.type('#pass', CREDS.qvpass);
            await page.waitForSelector('.main-panel > .content > #login > form > .btn')
            await page.click('.main-panel > .content > #login > form > .btn')
        } catch (error) {
            console.log('Caught:', error.message)
        }
    };

    // Navigate to Plot
    async function navtoPlot(browser, page) {
        await page.waitFor(1000)
        await page.waitForSelector('.sidebar-wrapper > .nav > #menuProjects > a > p')
        await page.click('.sidebar-wrapper > .nav > #menuProjects > a > p')

        await page.hover('body > div.wrapper > div.sidePanel.ui-resizable > div.panelHeading')
        await page.waitFor(1000)
        await page.waitForSelector('.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')
        await page.click('.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')

        await page.waitFor(1000)
        await page.waitForSelector('#objects > img:nth-child(1)')
        await page.click('#objects > img:nth-child(1)')

        await page.waitForSelector('#viewGraphBtn')
        await page.click('#viewGraphBtn')
    };

    // clear default dates
    async function clearDates(browser, page) {
        await page.waitFor(1000)
        await page.waitForSelector('#formInner0 > div.graphButtons > div > div:nth-child(1)')
        await page.click('#formInner0 > .graphButtons > div > .graphButton:nth-child(1)')

        await page.waitForSelector('form #list2 #selectAllBtn')
        await page.click('form #list2 #selectAllBtn')

        await page.waitForSelector('form #deleteBtn')
        await page.click('form #deleteBtn')

        const elements = await page.$x('/html/body/div[1]/div[5]/div[2]/form/div/div/button[2]')
        await elements[0].click()
    };

    async function typeDate(browser, page) {
        // Add new date
        await page.waitForSelector('#link1 #sDateTxt')
        await page.click('#link1 #sDateTxt')
        //await page.keyboard.type(targetdate)
        await page.waitForSelector('#dateList1 > #dateList1Body > tr:nth-child(1) > td > .form-check')
        await page.click('#dateList1 > #dateList1Body > tr:nth-child(1) > td > .form-check')

        await page.waitForSelector('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
        await page.click('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
    };


    // await page.waitForSelector('#formInner20 > form:nth-child(1) > div:nth-child(2) > div:nth-child(1) > button:nth-child(2)')
    // await page.click('#formInner20 > form:nth-child(1) > div:nth-child(2) > div:nth-child(1) > button:nth-child(2)')
    // await page.mouse.click(986,496)
    // await page.mouse.click(986,496)

    // await page.waitForSelector('#btnApply')

    // // await page.waitForSelector('#btnApply')
    // await page.keyboard.down('Enter')


    // await page.waitForSelector('.sidebar-wrapper > .nav > #menuProjects > a > p')
    // await page.click('.sidebar-wrapper > .nav > #menuProjects > a > p')
    //
    // await page.waitForSelector('.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')
    // await page.click('.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')
    //
    // await page.waitForSelector('.sidebar-wrapper > .nav > #menuViews > a > p')
    // await page.click('.sidebar-wrapper > .nav > #menuViews > a > p')
    //
    // await page.waitForSelector('#panelInner > #viewList > .viewIcon:nth-child(4) > .viewIconIcon > .viewIconThumb')
    // await page.click('#panelInner > #viewList > .viewIcon:nth-child(4) > .viewIconIcon > .viewIconThumb')
    //
    // await page.waitForSelector('.sidebar-mini > #main > #content > #objects > .point:nth-child(3)')
    // await page.click('.sidebar-mini > #main > #content > #objects > .point:nth-child(3)')
    //
    // await page.waitForSelector('.sidebar-mini > #main > #content > #objects > .point:nth-child(3)')
    // await page.click('.sidebar-mini > #main > #content > #objects > .point:nth-child(3)')

    // await page.waitForSelector('form #graphBtn')
    // await page.click('form #graphBtn')
    //
    // await page.waitForSelector('#dialogSAA3\ X-Axis > #formInner1 > .graphButtons > div > .graphButton:nth-child(1)')
    // await page.click('#dialogSAA3\ X-Axis > #formInner1 > .graphButtons > div > .graphButton:nth-child(1)')
    //
    // await page.waitForSelector('#link1 #sDateTxt')
    // await page.click('#link1 #sDateTxt')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.ui-datepicker-calendar > tbody > tr > .ui-datepicker-week-end > .ui-state-hover')
    // await page.click('.ui-datepicker-calendar > tbody > tr > .ui-datepicker-week-end > .ui-state-hover')
    //
    // await page.waitForSelector('#link1 #eDateTxt')
    // await page.click('#link1 #eDateTxt')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    // await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
    //
    // await page.waitForSelector('.ui-datepicker-calendar > tbody > tr > td > .ui-state-hover')
    // await page.click('.ui-datepicker-calendar > tbody > tr > td > .ui-state-hover')
    //
    // await page.waitForSelector('#dateList1 > #dateList1Body > tr:nth-child(1) > td > .form-check')
    // await page.click('#dateList1 > #dateList1Body > tr:nth-child(1) > td > .form-check')
    //
    // await page.waitForSelector('form #list2 #selectAllBtn')
    // await page.click('form #list2 #selectAllBtn')
    //
    // await page.waitForSelector('form #deleteBtn')
    // await page.click('form #deleteBtn')
    //
    // await page.waitForSelector('#formInner3 #btnApply')
    // await page.click('#formInner3 #btnApply')
    //
    // await page.waitForSelector('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
    // await page.click('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
    //
    // await page.waitForSelector('#dialogDateSelector > #formInner2 #btnApply')
    // await page.click('#dialogDateSelector > #formInner2 #btnApply')
    //

    process.stdin.on('keypress', async (str, key) => {
        if (key.sequence === '\u0003') {
            await browser.close();
            process.exit();
        }
        // process.stdin.resume();
        //
        // static async askQuestion(query) {
        //     const rl = readline.createInterface({
        //         input: process.stdin,
        //         output: process.stdout,
        //     });
        //     return new Promise(resolve => rl.question(query, ans => {
        //         rl.close();
        //         verboselog(ans);
        //         resolve(ans);
        //     }))
        // }

        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function (key) {
            // ctrl-c ( end of text )
            if (key === '\u0003') {
                process.exit();
            }
            // write the key to stdout all normal like
            console.log(key);
        });
        if (['left'].includes(key.name)) {
            console.log('opening Date selector');
            await toDate(browser, page);
        }
        if (['right'].includes(key.name)) {
            console.log('manuvering for screenshot');
            await fromDate(browser, page);
        }
        if (['up'].includes(key.name)) {
            console.log('Input target');
            let date = await getUserInput(browser, page, 'Start Date: \n');
        }
        if (['down'].includes(key.name)) {
            await getUserInput(browser, page, 'Start Date: \n');
            console.log('Prompting for End date');
        }
        // if (['up', 'down', 'left', 'right'].includes(key.name)) {
        //     const capitalized = key.name[0].toUpperCase() + key.name.slice(1);
        //     const keyName = `Arrow${capitalized}`;
        //     console.log(`page.keyboard.down('${keyName}')`);
        //     await page.keyboard.down(keyName);
        // }
    });


    async function getUserInput(browser, page, value) {

        return new Promise(async (resolve) => {

            const result = await page.evaluate((msg) => {
                /*
                This function will run within our puppeteer browser window, and if we return a promise,
                page.evaluate() will wait for it to resolve, so we return a promise that resolves
                when the user responds
                */
                return new Promise((resolve) => {
                    resolve(prompt(msg));
                });
            }, value);

            //Return user input to the calling method
            resolve(result);

        });
    }


    // readline.emitKeypressEvents(process.stdin);
    // process.stdin.setRawMode(true);

})();
// records.filter(r => !r.title).map(r => ({…r, title: await getUserInput(r)}))
// record.title = await getUserInput(record);

// without this, we would only get streams once enter is pressed

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
// stdin.setEncoding( 'utf8' );

// on any data into stdin
// stdin.on( 'data', function( key ){
//     // ctrl-c ( end of text )
//     if ( key === '\u0003' ) {
//         process.exit();
//     }
//     // write the key to stdout all normal like
//     process.stdout.write( key );
// });