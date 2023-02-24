const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');
let browser; 
let cookies;

app.use(express.json());

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
    if(cookies) {
    	await page.setCookie(...cookies); 
   } 
   await page.goto('https://www.touch.com.lb/autoforms/portal/touch/mytouch/pinrecharge',{waitUntil: 'networkidle0'});
    await page.setViewport({ width: 0, height: 0 });
                    
                    if(!cookies) {
                    	console.log('logging');
   await page.focus('#user')
 await page.keyboard.type(process.env.user)
  await page.focus('#pass')
 await page.keyboard.type(process.env.pass)
    
   await page.$eval('input[name=imageField]', el => el.click());
   //await page.waitForNavigation();
   
   cookies = await page.cookies(); 
  } else {
  	console.log('youre logged in btw') 
 } 
   
    await page.screenshot({path: __dirname+'/public/puppeteer.png'});

    await browser.close();
   response.sendFile(__dirname+'/public/puppeteer.png');
  
  } catch (error) {
    console.log(error);
  }
});

/*
app.post('/charge', async (req, res) => {
	
  try {
   const {
    num,
    pin
  } = req.body;
         
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
    
    await page.$eval('input[name=frmGSM]', (el, n) => el.value = n, num);
    await page.$eval('input[name=frmREGSM]', (el, n) => el.value = n, num);
    await page.$eval('input[name=frmpin]', (el, p) => el.value = p, pin);

    
    await page.click('input[type="submit"]');
  
 
    
    await page.screenshot({path: __dirname+'/public/puppeteer.png'});
    
    await browser.close();
  // res.sendFile(__dirname+'/public/puppeteer.png');
    res.json({
      msg: 'the request has been sent successfully' 
    })
    
  } catch (error) {
    console.log(error);
    res.json({
     msg: `an error occurred ${error.message}`
     }) 
  }
})
*/

app.get('/show-state', (req, res) => {
   res.sendFile(__dirname+'/public/puppeteer.png');
}) 

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});