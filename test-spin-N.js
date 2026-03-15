const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Create a clean random values mock
    await page.addInitScript(() => {
        window.__mockSpinFraction = 0.0;
        const origGetRV = crypto.getRandomValues.bind(crypto);
        crypto.getRandomValues = function (array) {
            if (array instanceof Uint32Array && array.length === 1) {
                array[0] = Math.round(window.__mockSpinFraction * 0xFFFFFFFF);
                return array;
            }
            return origGetRV(array);
        };
    });

    await page.goto('https://wheelofnames.com/');
    await page.waitForTimeout(3000); // wheel render

    // Set exactly 4 entries
    await page.evaluate(() => {
        const ta = document.querySelector('textarea');
        ta.value = "A\\nB\\nC\\nD";
        ta.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(1000);

    async function testSpin(fraction) {
        await page.evaluate((frac) => { window.__mockSpinFraction = frac; }, fraction);
        await page.click('canvas');
        await page.waitForTimeout(12000);
        const winner = await page.evaluate(() => {
            const dialogElems = document.querySelectorAll('.q-dialog .text-h3, .q-dialog .text-h4, .q-dialog .q-card__section div');
            for (const el of dialogElems) {
                if (el.textContent.trim().length > 0) return el.textContent.trim();
            }
            return 'UNKNOWN';
        });
        console.log(`Fraction ${fraction} -> Result: ${winner}`);

        await page.evaluate(() => {
            const closeBtn = document.querySelector('.q-dialog button');
            if (closeBtn) closeBtn.click();
        });
        await page.waitForTimeout(1000);
    }

    await testSpin(0.0);
    await testSpin(0.25);
    await testSpin(0.5);
    await testSpin(0.75);

    await browser.close();
})();
