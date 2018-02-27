//author ketian
//ririhedou@gmail.com

const fs = require('fs');
const puppeteer = require('puppeteer');
var argv = require('minimist')(process.argv.slice(2));

const beginUrl = argv.url;
const beginFile = argv.file;
const globalDir = argv.dir || './'

//terminate the process in case some weird things happen
process.on('unhandledRejection', up => { throw up })



/*
* run for only 1 url at each time
*/
async function run_single(myUrl){

    const browser = await puppeteer.launch();
    var page = null;

    page = await browser.newPage();

    page = await browser.newPage();

    var arrayOfStrings = String(myUrl).split('/');
    let name = globalDir + arrayOfStrings[arrayOfStrings.length-1];

    try
    {
        await page.goto(myUrl,  { timeout: 5000 }); //5000 is 5000ms

        const url = await page.url();

        console.log('[1] Redirection: from url:<' + myUrl + '> to <' + url + '>');

        var directionChain = 'Redirection: from url:<' + myUrl + '> to <' + url + '>';

        fs.writeFile(name + '.redirect', directionChain, (err) => {
            if (err) throw err;
            console.log('[1] Redirection Chain was successfully saved.');
        });

        let HTML = await page.content(); //content is enough for the HTML content

        var filepath = name + '.source.txt';
        fs.writeFile(filepath, HTML, (err) => {
            if (err) throw err;
            console.log('[2] HTML was successfully saved.');
        });

        await page.setViewport({width: 1600, height: 800});
        await page.screenshot({path: name + '.screen.png'});

        console.log('[3] Screen was saved.');
        await page.close();
    }
    catch (e)
        {
          console.log('Cannot go to for ' + myUrl + ', stop the browser...');
        }

    await browser.close();

};

/*
*  run multiple URL instances
*/
async function run_multiple_urls(urlList){

  urlList.sort();

  const browser = await puppeteer.launch();

  var page = null;

  var arrayLength = urlList.length;
  for (var i = 0; i < arrayLength; i++) {

    //the i-th element
    myUrl = urlList[i];

    console.log(String(i) +'-th: ' + myUrl);

    page = await browser.newPage();

    var arrayOfStrings = String(myUrl).split('/');
    let name = globalDir + arrayOfStrings[arrayOfStrings.length-1];

    try
        { await page.goto(myUrl,  { timeout: 5000 });} //5000 is 5000ms
    catch (e)
        {
          console.log('Cannot go to for ' + myUrl + ', continue...');
          continue;
        }

    const url = await page.url();

    console.log('[1] Redirection: from url:<' + myUrl + '> to <' + url + '>');

    var directionChain = 'Redirection: from url:<' + myUrl + '> to <' + url + '>';

    fs.writeFile(name + '.redirect', directionChain, (err) => {
        if (err) throw err;
        console.log('[1] Redirection Chain was successfully saved.');
    });

    let HTML = await page.content(); //content is enough for the HTML content

    var filepath = name + '.source.txt';
    fs.writeFile(filepath, HTML, (err) => {
        if (err) throw err;
        console.log('[2] HTML was successfully saved.');
    });

    await page.setViewport({width: 1600, height: 800});
    await page.screenshot({path: name + '.screen.png'});

    console.log('[3] Screen was saved.');
    await page.close();
  }

  await browser.close();

};


if (beginUrl){

    console.log('Run single file......');
    run_single(beginUrl);
}

if (beginFile)
{
    var dp = require('./data_process');
    dp.readSqautting(beginFile);
}


//run_single(beginUrl);
//var urlList = ['http://facebook.com', 'http://google.com', 'http://googggg.vvv'];
//run_multiple_urls(urlList);
