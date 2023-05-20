import puppeteer from "puppeteer";
import fs from "fs";

const sleep = s => new Promise(r => setTimeout(r, s*1000))

async function accessImage(page, extention){
  let imgURL = "https://www.nasa.gov" + extention
  console.log(imgURL)
  page.goto(imgURL, {waitUntil:"domcontentloaded"});

  await sleep(15)
}
async function scrape(url) {
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
      await accessImage(page, image["imgSrc"]);
    }

    await browser.close();
};

await scrape("https://www.nasa.gov/multimedia/imagegallery/iotd.html")



