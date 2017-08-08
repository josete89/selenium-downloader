const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    Key = webdriver.Key,
    until = webdriver.until;

const { URL } = require('url');
const R = require('ramda');

const fs = require('fs')

const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

    driver.get('https://www.google.com/imghp?hl=en&tab=wi');
    driver.findElement(By.name('q')).sendKeys('');
    driver.findElement(By.name('q')).sendKeys(Key.ENTER);
    //driver.wait(until.elementIsEnabled(driver.findElement(By.className('col'))), 10000);
    driver.sleep(2000)
    driver.findElements(By.tagName('img')).then( function (elements){
        console.log(elements.length)
     })
    driver.executeScript("window.scrollBy(0,document.body.scrollHeight)")
    driver.sleep(4000)
    driver.executeScript("window.scrollBy(0,document.body.scrollHeight)")
    driver.sleep(4000)
    driver.executeScript("window.scrollBy(0,document.body.scrollHeight)")
    driver.sleep(4000)
    driver.findElements(By.className('rg_l')).then( function (elements){
      console.log("Number of images -> "+elements.length)
        processImages(elements)
    })
    //driver.sleep(2000)
    //driver.quit();

var processImages = function (elements) {
  var urls = elements.map( function (element) { return element.getAttribute("href") } )
  Promise.all(urls).then(function(results) {
    let res = results.map(mapUrlToImg)
    fs.writeFile('./data.json', JSON.stringify(res), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
  })
}

var mapUrlToImg = function(urlEncoded) {
    let url = new URL(decodeURIComponent(urlEncoded))
    let imgUrl =  url.searchParams.get('imgurl')
    return { url:imgUrl}
}
