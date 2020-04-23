'use strict';
const Promise = require("bluebird");

const records = [{
    'title': null,
    'lat'  : 9.1111,
    'lng'  : 5.1111,
    'desc' : 'A record missing a title'
},{
    'title': "Not missing data",
    'lat'  : 9.1111,
    'lng'  : 5.1111,
    'desc' : 'Some description'
},{
    'title': null,
    'lat'  : 9.1111,
    'lng'  : 5.1111,
    'desc' : 'Another record missing a title with unicode chars (هذا نص عربي)'
}];

async function getUserInput(missing_record) {

    const puppeteer = require('puppeteer');

    return new Promise(async (resolve, reject) => {

        //This message we will show the user
        const prompt_msg = `Please input start date: \n`;

        const result = await page.evaluate((msg) => {
            /*
            This function will run within our puppeteer browser window, and if we return a promise,
            page.evaluate() will wait for it to resolve, so we return a promise that resolves
            when the user responds
            */
            return new Promise((resolve, reject) => {
                resolve(prompt(msg));
            });
        }, prompt_msg);

        //Close our browser
        await browser.close();

        //Return user input to the calling method
        resolve(result);

    });
}
async function processData() {

    for(const record of records) {
        if(!record.title) {
            console.log("Prompting user for response");
            record.title = await getUserInput(record);
            console.log("Got user response");
        }
        console.log(`Record title is ${record.title}`);
    }

}

processData();