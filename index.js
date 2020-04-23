const readline = require('readline');
const puppeteer = require('puppeteer');
const Promise = require("bluebird");
const fs = require('fs');


(async() => {

const browser = await puppeteer.launch({
    headless: false,
    args: [],
    executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    userDataDir: "C:\\Users\\Dan.Edens\\AppData\\Local\\Google\\Chrome\\User Data"
});
//    exe_path = os.environ['ProgramFiles(x86)']+'\\Google\\Chrome\\Application\\chrome.exe'
//    userdata = os.environ['USERPROFILE']+"\\AppData\\Local\\Google\\Chrome\\User Data"
//    prefs = userdata+"\\Default\\Preferences"
//    headless = False
//    chrome_args = ['--start-fullscreen', ' --user-data-dir='+userdata, "--ignore-certificate-errors", url,
//                   "--restore-last-session"]
// launch(
//        {"headless": Options.headless, "timeout": 0, "executablePath": Options.exe_path,
//        "userDataDir": Options.userdata}, args=Options.chrome_args)
const page = await browser.newPage();
await page.setViewport({width: 800, height: 500, deviceScaleFactor: 2});
await page.goto('https://quickview.geo-instruments.com/index.php');

process.stdin.on('keypress', async (str, key) => {
  if (key.sequence === '\u0003') {
    await browser.close();
    process.exit();
  }

  if (['minus'].includes(key.name)) {
      await getUserInput(browser,page,'Start Date: \n');
      console.log('Prompting for Start date');
    }
  if (['equals'].includes(key.name)) {
      await getUserInput(browser,page,'Start Date: \n');
      console.log('Prompting for End date');
  }

  if (['up', 'down', 'left', 'right', 'enter'].includes(key.name)) {
  const capitalized = key.name[0].toUpperCase() + key.name.slice(1);
  const keyName = `Arrow${capitalized}`;
  console.log(`page.keyboard.down('${keyName}')`);
  await page.keyboard.down(keyName);
  }
});
async function getUserInput(browser,page,value) {

        return new Promise(async (resolve, reject) => {

            const result = await page.evaluate((msg) => {
                /*
                This function will run within our puppeteer browser window, and if we return a promise,
                page.evaluate() will wait for it to resolve, so we return a promise that resolves
                when the user responds
                */
                return new Promise((resolve, reject) => {
                    resolve(prompt(msg));
                });
            }, value);

            //Return user input to the calling method
            result |> resolve;

        });
    }



readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

})();
//records.filter(r => !r.title).map(r => ({…r, title: await getUserInput(r)}))
//record.title = await getUserInput(record);
