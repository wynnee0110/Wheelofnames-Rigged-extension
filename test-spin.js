const { chromium } = require('playwright');

(async () => {
    console.log('Starting experimental spin test...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Create a clean random values mock
    await page.addInitScript(() => {
        window.__mockSpinFraction = 0.0;
        const origGetRV = crypto.getRandomValues.bind(crypto);
        crypto.getRandomValues = function (array) {
            if (array instanceof Uint32Array && array.length === 1) {
                // Return our forced fraction
                array[0] = Math.round(window.__mockSpinFraction * 0xFFFFFFFF);
                console.log('[Mock] Fired crypto.getRandomValues returning fraction:', window.__mockSpinFraction);
                return array;
            }
            return origGetRV(array);
        };
    });

    await page.goto('https://wheelofnames.com/');
    console.log('Page loaded. Waiting for wheel to render...');
    await page.waitForTimeout(3000);

    // Read entries
    const entries = await page.evaluate(() => {
        const ta = document.querySelector('textarea');
        return ta ? ta.value.split('\\n').filter(Boolean) : [];
    });
    console.log('Entries on wheel:', entries.length, entries.slice(0, 3));

    async function testSpinWithFraction(fraction) {
        console.log(`\\n--- Testing spin with fraction: ${fraction} ---`);
        await page.evaluate((frac) => { window.__mockSpinFraction = frac; }, fraction);

        // Click the canvas to spin
        await page.click('canvas');
        console.log('Clicked spin. Waiting 12 seconds for it to finish...');
        await page.waitForTimeout(12000); // 10s default spin + 2s buffer

        // Get the winner text from the modal dialog
        const winner = await page.evaluate(() => {
            // It shows up in a dialog or as a big text element. Usually there is a "We have a winner!" text
            // Let's just find the largest text or the modal content
            const dialogElems = document.querySelectorAll('.q-dialog .text-h3, .q-dialog .text-h4, .q-dialog .q-card__section div');
            for (const el of dialogElems) {
                if (el.textContent.trim().length > 0) return el.textContent.trim();
            }
            return 'UNKNOWN';
        });
        console.log(`Fraction ${fraction} -> Result:`, winner);

        // Close the winner dialog so we can spin again
        await page.evaluate(() => {
            const closeBtn = document.querySelector('.q-dialog button');
            if (closeBtn) closeBtn.click();
        });
        await page.waitForTimeout(1000);
    }

    await testSpinWithFraction(0.0);
    await testSpinWithFraction(0.25);
    await testSpinWithFraction(0.5);

    await browser.close();
})();
