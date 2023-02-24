const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');

app.get("/", async (request, response) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--start-maximized'],
      ignoreHTTPSErrors: true, 
      headless: true,
      defaultViewport: null
    });
    const page = await browser.newPage();
   await page.goto('https://www.touch.com.lb/autoforms/portal/touch/mytouch/pinrecharge',{waitUntil: 'networkidle0'});
    await page.setViewport({ width: 0, height: 0 });
    
    // await page.goto('https://pornhub.com', { waitUntil: 'networkidle0' })
                    
   await page.focus('#user')
 await page.keyboard.type(process.env.user)
  await page.focus('#pass')
 await page.keyboard.type(process.env.pass)
    
   await page.$eval('input[name=imageField]', el => el.click());
   // await page.waitForNavigation();
    await page.screenshot({path: __dirname+'/public/puppeteer.png'});
 //  const b = await page.content();
//    const d = await page.evaluate(() => document.querySelector('*').outerHTML);

    await browser.close();
   response.sendFile(__dirname+'/public/puppeteer.png');
  //response.send(d);
  } catch (error) {
    console.log(error);
  }
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});