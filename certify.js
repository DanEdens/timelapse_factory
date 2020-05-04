await page.goto('https://www.certify.com/Home2.aspx?reload=1')
await page.setViewport({ width: 1745, height: 861 })

//await drafts(browser, page)
export async function drafts(browser, page) {
    await page.waitForSelector('.dash-reports_status #MainContent_lblDrafts')
    await page.click('.dash-reports_status #MainContent_lblDrafts')
    await navigationPromise
}

//await addReceipt(browser, page)
export async function addReceipt(browser, page) {
    await page.waitForSelector('#QuickLinks #ctl92_QLText_AddReceipts')
    await page.click('#QuickLinks #ctl92_QLText_AddReceipts')
    await navigationPromise
    await page.waitForSelector('#MainContent_pnlUpload #MainContent_FileUpload1')
    await page.click('#MainContent_pnlUpload #MainContent_FileUpload1')
    await page.waitForSelector('.auto-grid > #MainContent_pnlUpload #MainContent_btnUpload')
    await page.click('.auto-grid > #MainContent_pnlUpload #MainContent_btnUpload')
}

