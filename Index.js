import puppeteer from "puppeteer";
import fs from "fs";

const sleep = s => new Promise(r => setTimeout(r, s*1000))

async function accessImage(page, extention, index){
  let imgUrl = "https://www.nasa.gov" + extention
  let imgPath = "./Images/nasaIMG_"+ index + ".png"

  console.log(imgUrl)
  page.goto(imgUrl, {waitUntil:"domcontentloaded"});

  await sleep(2)

  const element = await page.$('body > img');        // declare a variable with an ElementHandle
  await element.screenshot({path: imgPath})
}
async function scrape(url) {
  let imgId = 1
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto(url, {waitUntil: "domcontentloaded"});

    console.log("DOM content rendered");

    await sleep(2);

    console.log("Page rendered");

    let images = await page.evaluate(()=>{
      const pageData = document.querySelectorAll("div.row.gallery-container > div#gallery-list > div.gallery-card.ember-view");

      return Array.from(pageData).map((content) => {
        const imgSrc = content.querySelector("div.inner.img-wrapper > a > div.image > img").getAttribute("src");
        const imgAlt = content.querySelector("div.inner.img-wrapper > a > div.image > img").getAttribute("alt");

        return { imgSrc, imgAlt }
      });
    });

    for (let image of images) {
      await accessImage(page, image["imgSrc"], imgId);
      imgId += 1
    }

    await browser.close();
};

await scrape("https://www.nasa.gov/multimedia/imagegallery/iotd.html")



