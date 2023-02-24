const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');
let browser; 

async function run() { 
browser = await puppeteer.launch({
      args: ['--no-sandbox', '--start-maximized'],
      ignoreHTTPSErrors: true, 
      headless: true,
      defaultViewport: null
}) 
  console.log('init browser');
  }
app.get("/", async (request, response) => {
  try {
    await run();
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

app.get('/charge', async (req, res) => {
  try {
    await run();
    
    const page = await browser.newPage();
   await page.goto('https://www.touch.com.lb/autoforms/portal/touch/mytouch/pinrecharge',{waitUntil: 'networkidle0'});
    await page.setViewport({ width: 0, height: 0 });
    
   await page.focus('#user')
 await page.keyboard.type(process.env.user)
    
  await page.focus('#pass')
 await page.keyboard.type(process.env.pass)
   await page.$eval('input[name=imageField]', el => el.click());
    
    
    await page.waitForSelector('input[name=frmGSM]');
    
    await page.$eval('input[name=frmGSM]', el => el.value = 'Adenosine triphosphate');
    await page.$eval('input[name=frmREGSM]', el => el.value = 'Adenosine triphosphate');
    await page.$eval('input[name=frmpin]', el => el.value = 'Adenosine triphosphate');

    

 
    
    await page.screenshot({path: __dirname+'/public/puppeteer.png'});
    
    await browser.close();
   res.sendFile(__dirname+'/public/puppeteer.png');
    
    
  } catch (error) {
    console.log(error);
  }
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});