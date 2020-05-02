

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

