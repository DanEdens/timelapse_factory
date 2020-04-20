const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  
  const navigationPromise = page.waitForNavigation()
  
  await page.goto('https://quickview.geo-instruments.com/login.php')
  
  await page.setViewport({ width: 1943, height: 874 })
  
  // creds assumed autofilled
  await page.waitForSelector('.main-panel > .content > #login > form > .btn')
  await page.click('.main-panel > .content > #login > form > .btn')
  
  await navigationPromise
  
  await page.waitForSelector('.sidebar-wrapper > .nav > #menuProjects > a > p')
  await page.click('.sidebar-wrapper > .nav > #menuProjects > a > p')
  
  await page.waitForSelector('.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')
  await page.click('.sidePanel > #panelInner > #projectList > .panelRow:nth-child(3) > .panelRowTxt2')
  
  await page.waitForSelector('.sidebar-wrapper > .nav > #menuViews > a > p')
  await page.click('.sidebar-wrapper > .nav > #menuViews > a > p')
  
  await page.waitForSelector('#panelInner > #viewList > .viewIcon:nth-child(4) > .viewIconIcon > .viewIconThumb')
  await page.click('#panelInner > #viewList > .viewIcon:nth-child(4) > .viewIconIcon > .viewIconThumb')
  
  await page.waitForSelector('.sidebar-mini > #main > #content > #objects > .point:nth-child(3)')
  await page.click('.sidebar-mini > #main > #content > #objects > .point:nth-child(3)')
  
  await page.waitForSelector('.sidebar-mini > #main > #content > #objects > .point:nth-child(3)')
  await page.click('.sidebar-mini > #main > #content > #objects > .point:nth-child(3)')
  
  await page.waitForSelector('form #graphBtn')
  await page.click('form #graphBtn')
  
  await page.waitForSelector('#dialogSAA3\ X-Axis > #formInner1 > .graphButtons > div > .graphButton:nth-child(1)')
  await page.click('#dialogSAA3\ X-Axis > #formInner1 > .graphButtons > div > .graphButton:nth-child(1)')
  
  await page.waitForSelector('#link1 #sDateTxt')
  await page.click('#link1 #sDateTxt')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.ui-datepicker-calendar > tbody > tr > .ui-datepicker-week-end > .ui-state-hover')
  await page.click('.ui-datepicker-calendar > tbody > tr > .ui-datepicker-week-end > .ui-state-hover')
  
  await page.waitForSelector('#link1 #eDateTxt')
  await page.click('#link1 #eDateTxt')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  await page.click('.sidebar-mini > #ui-datepicker-div > .ui-datepicker-header > .ui-datepicker-prev > .ui-icon')
  
  await page.waitForSelector('.ui-datepicker-calendar > tbody > tr > td > .ui-state-hover')
  await page.click('.ui-datepicker-calendar > tbody > tr > td > .ui-state-hover')
  
  await page.waitForSelector('#dateList1 > #dateList1Body > tr:nth-child(1) > td > .form-check')
  await page.click('#dateList1 > #dateList1Body > tr:nth-child(1) > td > .form-check')
  
  await page.waitForSelector('form #list2 #selectAllBtn')
  await page.click('form #list2 #selectAllBtn')
  
  await page.waitForSelector('form #deleteBtn')
  await page.click('form #deleteBtn')
  
  await page.waitForSelector('#formInner3 #btnApply')
  await page.click('#formInner3 #btnApply')
  
  await page.waitForSelector('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
  await page.click('#link1 > .row > .col-sm > #moveRightBtn > .tim-icons')
  
  await page.waitForSelector('#dialogDateSelector > #formInner2 #btnApply')
  await page.click('#dialogDateSelector > #formInner2 #btnApply')
  
  await browser.close()
})()
