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
await page.setViewport({width: 1960, height: 960, deviceScaleFactor: 1});
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



readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

})();
//records.filter(r => !r.title).map(r => ({…r, title: await getUserInput(r)}))
//record.title = await getUserInput(record);
// var stdin = process.stdin;
//
// // without this, we would only get streams once enter is pressed
// stdin.setRawMode( true );
//
// // resume stdin in the parent process (node app won't quit all by itself
// // unless an error or process.exit() happens)
// stdin.resume();
//
// // i don't want binary, do you?
// stdin.setEncoding( 'utf8' );
//
// // on any data into stdin
// stdin.on( 'data', function( key ){
//     // ctrl-c ( end of text )
//     if ( key === '\u0003' ) {
//         process.exit();
//     }
//     // write the key to stdout all normal like
//     process.stdout.write( key );
// });