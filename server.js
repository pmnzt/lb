const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');
let browser; 
let cookies;

app.use(express.json());

app.get('/', (req, res) => {
   res.sendStatus(200);
}) 

app.get('/show-state', (req, res) => {
  try {
    res.sendFile(__dirname+'/public/puppeteer.png');
  } catch (err) {
    res.json({ msg: err.message })
  }
})

app.use((req, res, next) => {
   const authHeader = req.headers['authorization']
   const pass = authHeader && authHeader.split(' ')[1] 
    
   if(pass !== process.env.pass) {
	    return res.status(401).json({ msg: "wrong password" });      
   }
		 
    next()
})

run();

async function run() { 
browser = await puppeteer.launch({
      args: ['--no-sandbox', '--start-maximized'],
      ignoreHTTPSErrors: true, 
      headless: true,
      defaultViewport: null
}) 
  }


app.post('/charge-mtc', async (req, res) => {
  
  console.log('mtc-charge')
	
  try {
   const {
    num,
    pin
  } = req.body;
         
    await run();
    
    const page = await browser.newPage();
    if(cookies) {
    	await page.setCookie(...cookies); 
     }
   await page.goto('https://www.touch.com.lb/autoforms/portal/touch/mytouch/pinrecharge',{waitUntil: 'networkidle0'});
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 0, height: 0 });
    
    const logged = await page.$eval('input[name=frmGSM]', () => true).catch(() => false)
    if(!logged) {
      console.log('logging');
      await page.focus('#user')
      await page.keyboard.type(process.env.user)
    
      await page.focus('#pass')
      await page.keyboard.type(process.env.pass)
      await page.$eval('input[name=imageField]', el => el.click());
      
      cookies = await page.cookies();
    } else {
      console.log('youre logged in btw')
    }
   
    await page.waitForSelector('input[name=frmGSM]');
    
    await page.focus('input[name=frmGSM]')
    await page.keyboard.type(num)
    
    await page.focus('input[name=frmREGSM]')
    await page.keyboard.type(num)
    
    await page.focus('input[name=frmpin]')
    await page.keyboard.type(pin)

    
    // await page.click('input[type="submit"]');
    // await page.$eval('input[type=submit]', el => el.click());
    
    // await page.screenshot({path: __dirname+'/public/puppeteer.png'});
    
    
    await page.$eval('form[name="ThirdPartyRechargeForm"]', form => form.submit());
    await page.waitForNavigation()
  
 
    
    
    await page.close();
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


app.post('/charge-alfa', async (req, res) => {
  
  console.log('alfa-charge')
	
  try {
   const {
    num,
    pin
  } = req.body;
         
    await run();
    
    const page = await browser.newPage();
    
    await page.goto('https://www.alfa.com.lb/en/account/pay-and-recharge/prepaid/scratch-card',{waitUntil: 'networkidle0'});
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 0, height: 0 });
    
   
    
    await page.focus('input#Number')
    await page.keyboard.type(num)
    
    await page.focus('input#NumberConfirm')
    await page.keyboard.type(num)
    
    await page.focus('input#RechargeCode')
    await page.keyboard.type(pin)
    
    await page.waitForTimeout(3000);
    await page.$eval('form', form => form.submit());
    //await page.click("button[type=submit]");
     
    // await page.keyboard.press('Enter');
    
    // await page.$eval('form.form', form => form.submit());
    
    // await page.waitForSelector('button[type=submit]');
    // await page.focus('button[type=submit]')
    // await page.click('button[type=submit]');  
    
    
    // await page.waitForNavigation()
    
    await page.screenshot({path: __dirname+'/public/puppeteer.png'});
    
    
  
    
    
    await page.close();
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



var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});