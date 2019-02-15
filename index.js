const assert = require("assert");
const path = require("path");

const axios = require("axios");
const puppeteer = require("puppeteer");

const envMap = new Map();
envMap.set("prod", "https://monitor.firefox.com");
envMap.set("stage", "https://blurts-server.stage.mozaws.net");
envMap.set("dev", "https://fx-breach-alerts.herokuapp.com");

const env = process.env.SERVER_ENV || "dev";

main(env);

async function main(env="dev") {
  const serverUrl = envMap.get(env) || envMap.get("dev");
  try {
    const version = await versionJson(serverUrl);
    const filename = `${env}-home-${version.commit}.png`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(serverUrl);
    await page.waitForSelector("h2[data-location='landing-page']");
    await page.screenshot({path: path.join(__dirname, "screenshots", filename)});
    console.log(`Writing ${filename}`);

    const landingHeadline = await page.$eval("h2[data-location='landing-page']", el => el.textContent.trim());
    assert.equal(landingHeadline, "Your right to be safe from hackers starts here.");

    await browser.close();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

async function versionJson(serverUrl) {
  const versionUrl = `${serverUrl}/__version__`;
  try {
    const res = await axios.get(versionUrl);
    return res.data;
  } catch (err) {
    throw err;
  }
}
