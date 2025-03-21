

const { json } = require("express");
const Anchors = require("../models/anchorsModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const puppeteer = require('puppeteer')

exports.getAllAnchors = factory.getAll(Anchors.name);
exports.getAnchors = factory.getOne(Anchors.name);
exports.updateAnchors = factory.updateOne(Anchors.name);
exports.deleteAnchors = factory.deleteOne(Anchors.name);
exports.getAnchorsByFloor = factory.getByfloorplan(Anchors.name)


exports.getAnchorDetails = catchAsync(async(req, res, next)=>{
    try{
        console.log('getAnchorDetails',req.body.ipList)
        const arrIP = JSON.parse(JSON.stringify(req.body.ipList))
        console.log(typeof arrIP)
        let regex = /System Run time:\s*(\d+)/;
        let match
        const arr =[]
        let runTime = []
        let systemRunTime
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
      });

      const page = await browser.newPage();

    
for(const ip of arrIP){
    await page.goto(`http://${ip}`, {
      waitUntil: "domcontentloaded",
    })

    let details = await page.evaluate(() => {
        const bodyText = document.body.textContent
        return bodyText
      });

    console.log(details)
    match = details.match(regex);   

    // Extracted number will be in match[1]
    if (match && match.length > 1) {
        runTime.push({ip : ip, time : match[1]})
        console.log("System Run time:", runTime);
    } else {
        console.log("System Run time not found.");
    }
  
}

//    arrIP.forEach( ip => {
//     await page.goto(`http://${ip}`, {
//       waitUntil: "domcontentloaded",
//     })

// // await page.goto(`http://${arrIP[0]}`, {
// //       waitUntil: "domcontentloaded",
// //     })

//     let details = await page.evaluate(() => {
//         const bodyText = document.body.textContent
//         return bodyText
//       });

//     console.log(details)
//     match = details.match(regex);   

//      // Extracted number will be in match[1]
//      if (match && match.length > 1) {
//         runTime.push({ip : ip, time : match[1]})
//         console.log("System Run time:", runTime);
//     } else {
//         console.log("System Run time not found.");
//     }



//     });


// Close the browser
await browser.close();

    // console.log(page);
    // const details = await page.evaluate(() => {
    //     const bodyText = document.body.textContent
    //     return bodyText
    //   });

    //   console.log(details)
    //   let data = {details : details}
  
    

   

    res.status(200).json({
      status: "success",
      data: runTime,
    });
    }
    catch(err){
        res.status(500).send(err.message);
    }
})