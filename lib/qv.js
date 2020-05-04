import * as main from 'index'

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    global.date = [year, month, day].join('-')
}

export async function graph(browser, page) {
    main.group('nav to graph')
    await page.waitFor(500)
    await page.waitForSelector('#objects > img:nth-child(1)')
    await page.click('#objects > img:nth-child(1)')
    await page.waitForSelector('#viewGraphBtn')
    await page.click('#viewGraphBtn')
    main.groupend('nav to graph')

}

export async function clearDates(browser, page) {
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

export async function login(browser, page) {
    main.group('login')
    try {
        await page.waitForSelector('.main-panel > .content > #login > form > .btn')
        await page.click('.main-panel > .content > #login > form > .btn')
    } catch (error) {console.log('Caught:', error.message)}
    main.groupend('login')
}

export async function riverside(browser, page) {
    // TODO:
    // Change project name to common call and create
    // ::map::project=:=selectors
    main.group('navtoriverside')
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
    main.groupend('navtoriverside')
}

export async function clearDates() {
    main.group('clear old dates')
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
    main.groupend('clear old dates')
}

export async function fixCalender(browser, page) {
    try {
        const elements = await page.$x(
            '/html/body/div[1]/div[4]/div[2]/form/div/div[1]/div/div[1]/div/div[1]/div[1]/label')
        await elements[0].click()
    } catch (error) {console.log('Caught:', error.message)}
}

export async function adddate(browser, page) {
    main.group('add date')
    await page.waitForSelector('#dateList1Container > #dateList1 > #dateList1Body > tr:nth-child(1) > .text-center')
    await page.click('#dateList1Container > #dateList1 > #dateList1Body > tr:nth-child(1) > .text-center')
    await page.waitFor(2000)

    await page.waitForSelector('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
    await page.click('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')

    await page.waitForSelector(
        '#dialogDateSelector > #formInner37 #btnApply')
    await page.click('#dialogDateSelector > #formInner37 #btnApply')
    main.groupend('add date')
}

export async function displayDate(browser, page) {
    let elements = await page.$x('/html/body/div[2]/div[8]/div[1]/span')
    await elements[0].click()
}

export async function key_enter(browser, page) {
    await page.keyboard.type(String.fromCharCode(13))
}

export async function key_esc(browser, page) {
    await page.keyboard.type(String.fromCharCode(27))
}

export async function apply(browser, page) {
    'select and apply new date' |> main.group
    const elements = await page.$x(
        '/html/body/div[1]/div[4]/div[2]/form/div/div[1]/div/div[1]/div/div[1]/div[3]/table/tbody/tr[1]/td[2]/div')
    await elements[0].click()
    await page.waitFor(500)

    await page.waitForSelector('#moveRightBtn > i')
    await page.waitFor(500)
    await page.click('#moveRightBtn > i')

    await page.waitFor(500)
    await page.click('#btnApply')
    'select and apply new date' |> main.groupend
}

export async function setdate(browser, page, args) {
    'set Date' |> main.group
    if (!args) {
        console.log('No date given')
    } else {
        formatDate(args)
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
            const elements = await page.$x('/html/body/div[1]/div[4]/div[2]/form/div/div[1]/div/div[1]/div/div[1]/div[1]/label')
            await elements[0].click()
        } catch (error) {
            console.log('Caught:', error.message)
        }
    }
    'set Date' |> main.groupend
}

