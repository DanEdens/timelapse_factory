const puppeteer = require('puppeteer');

(async function main(){
	  const browser = await puppeteer.launch({
		      headless:false, 
		      defaultViewport:null,
		      devtools: true
		    });

	  const page = (await browser.pages())[0];

	  
})()
