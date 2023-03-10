const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');
let browser; 
let cookies;

const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false
});

const devices = require('puppeteer/DeviceDescriptors');
const iPhonex = devices['iPhone X'];
const notificationsApi = "https://www.cashcards.icu/api_v33/plugins/notification_charge.php";

app.use(express.json());

app.get('/', (req, res) => {
   res.sendStatus(200);
}) 

// app.get('/show-state', (req, res) => {
//   try {
//     res.sendFile(__dirname+'/public/puppeteer2.png');
//   } catch (err) {
//     res.json({ msg: err.message })
//   }
// })

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
  
  console.log('browser init');
  }


app.post('/charge-mtc', async (req, res) => {
  
  console.log('mtc-charge')
	
  try {
   const {
    num,
    pin, 
     id, 
     title
  } = req.headers;
    
    if(!num || !pin) {
      return res.status(400).json({ msg: 'fill them all [num, pin]' });
    }
    
    res.json({
        msg: 'the request has been sent successfully'
      })
         
    
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
    // await page.waitForNavigation()
    
     // await page.waitFor(4000);
    
    
    let result;
    
    const resultsData = {
      id: 741,
      title: title,
      message: null
    };
    
    let feedBackSelector;
    
    try {
      await page.waitForSelector('ul.forms', {timeout: 8000});
      feedBackSelector = true;
    } catch(err) {
      feedBackSelector = false;
      result = `Error: No feedback, please try again if charging failed`;
      resultsData.title = `Phone number: ${num} | pin: ${pin}`;
    }
    
    if(feedBackSelector) {
          try {
            result = await page.$eval('ul.forms > div.errorStrip', ({ textContent }) => textContent);
          } catch(err) {
            result = await page.$eval('ul.forms > div.success', ({ textContent }) => textContent);
          }
    }
    
    resultsData.message = result;
    
    console.log(result);

     
    axios.get(`${notificationsApi}?id=${resultsData.id}&title=${resultsData.title}&message=${resultsData.message}`, { httpsAgent: agent }) 
   .catch(err => console.log(err));
    
    
    await page.close();
  // res.sendFile(__dirname+'/public/puppeteer.png');
    // res.json({
    //   msg: result 
    // })
    
  } catch (error) {
    console.log(error);
    
    const resultsData = {
      id: 741,
      title: null,
      message: error.message
    };
    
    
    // res.json({
    //  msg: `an error occurred ${error.message}`
    //  }) 
    axios.get(`${notificationsApi}?id=${resultsData.id}&title=${resultsData.title}&message=${resultsData.message}`, { httpsAgent: agent }) 
   .catch(err => console.log(err));
  }
})


app.post('/charge-alfa', async (req, res) => {
  
  console.log('alfa-charge')
	
  try {
   const {
    num,
    pin, 
     id, 
     title
  } = req.headers;
    
    console.log(req.headers);
    
    if(!num || !pin) {
      return res.status(400).json({ msg: 'fill them all [num, pin]' });
    }
    console.log(num, pin);
    
    res.json({
      msg: 'the request has been sent successfully'
    })
    
    
    const page = await browser.newPage();
    
    await page.emulate(iPhonex);
    
    await page.goto('https://www.alfa.com.lb/en/account/pay-and-recharge/prepaid/scratch-card', { waitUntil: 'networkidle0' } );
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 0, height: 0 });
    
   
    // await page.waitFor(3000);
    
    await page.waitForSelector('input[name=__RequestVerificationToken]'); 
    
    // const text = await page.$eval('input[name=__RequestVerificationToken]', ({ value }) => value);
  //  console.log(text);
    const alfaCookies = await page.cookies();
    console.log(alfaCookies);

    
    await page.focus('input#Number') 
    await page.keyboard.type(num)
    
    // const text = await page.evaluate(() => {
    //     const anchor = document.querySelector('input#Number');
    //     return anchor.textContent;
    // });
    
    // const text = await page.$eval("input#Number", (input) => {
    //  return input.getAttribute("value")
    // });
    
    // this one works
    // const text = await page.$eval('input#Number', ({ value }) => value);
    
     
    await page.focus('input#NumberConfirm')
    await page.keyboard.type(num)
    
     
    await page.focus('input#RechargeCode')
    await page.keyboard.type(pin)
    
    
    
    // await page.$eval('form', form => form.submit());
    //await page.click("button[type=submit]");
     
    // await page.keyboard.press('Enter');
    // await page.screenshot({path: __dirname+'/public/puppeteer.png'});
    
     await page.$eval('form.form', form => form.submit());
    
     // await page.waitFor(4000);
    
    await page.waitForSelector('form.form');
    
    // await page.screenshot({path: __dirname+'/public/puppeteer2.png'});
    
     
    
    
    const result = await page.$eval('div.alert > span', ({ textContent }) => textContent);
     console.log(result); 
    
    const resultsData = {
      id: 741,
      title: title,
      message: result
    };
    
     
    axios.get(`${notificationsApi}?id=${resultsData.id}&title=${resultsData.title}&message=${resultsData.message}`, { httpsAgent: agent }) 
    .catch(err => console.log(err));
          

    
  //  await page.waitForSelector('button[type=submit]');
   // await page.focus('button[type=submit]')
   // await page.click('button[type=submit]');  
    
    
    // await page.waitForNavigation()
    // await page.waitForNavigation()
    
    //  console.log('hi')
    
    
    await page.close();
    
    
  } catch (error) {
    console.log(error);
    // res.json({
    //  msg: `an error occurred ${error.message}`
    //  }) 
  }
})



var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});