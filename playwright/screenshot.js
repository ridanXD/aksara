const { chromium } = require('playwright');
const path = require('path');

const pages = [
  'index',
  'login',
  'dashboard',
  'courses',
  'course-detail',
  'assignment-submit',
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  for (const name of pages) {
    const page = await context.newPage();
    const filePath = path.resolve(__dirname, `../${name}.html`);
    await page.goto(`file://${filePath}`);
    await page.screenshot({
      path: path.resolve(__dirname, `../docs/screenshots/${name}.png`),
      fullPage: true,
    });
    console.log(`✓ ${name}.png`);
    await page.close();
  }

  await browser.close();
})();