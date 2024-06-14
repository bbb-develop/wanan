const puppeteer = require("puppeteer");

const rdmCheckUser = process.env.REACT_APP_RDM_CHECK_USER || '';
const rdmCheckPassword = process.env.REACT_APP_RDM_CHECK_PASSWORD || '';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const check = async (type) => {
  if (!rdmCheckUser || !rdmCheckPassword) {
    return;
  }

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await page.goto("https://femascloud.com/redreamer");

  await page.type("#user_username", rdmCheckUser);
  await page.type("#user_passwd", rdmCheckPassword);
  await page.click("#s_buttom"); // Click the login/submit button

  /*
  const userNameField = await page.waitForSelector('#user_username');
  const userPasswordField = await page.waitForSelector('#user_passwd');
  const loginButton = await page.waitForSelector('#s_buttom');

  userNameField.value = 'F005';
  userPasswordField = 'a26896988';
  loginButton.click();
  */

  const onBtn = await page.waitForSelector("#clock input[value=上班]");
  const dismissBtn = await page.waitForSelector("#clock input[value=下班]");

  if (type === "on") {
    onBtn.click();
    await sleep(5000);
    console.log("上班打卡");
  }

  if (type === "dismiss") {
    dismissBtn.click();
    await sleep(5000);
    console.log("下班打卡");
  }

  if ((type === "test")) {
    await sleep(5000);
    console.log('test');
  }

  const fileElement = await page.waitForSelector('#att_status_div');

  const img = await fileElement.screenshot();

  await browser.close();

  return img;
};

module.exports = {
  check,
};
