const http = require('http');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const targetUrl = urlParams.searchParams.get('url') || 'https://audinifer.com/e/fgep4q33jntz';

    let browser = null;
    try {
        // ക്രൊമീയം ബ്രൗസർ ലോഞ്ച് ചെയ്യുന്നു
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        
        // റീക്വസ്റ്റുകൾ നിരീക്ഷിച്ചു m3u8 ലിങ്ക് കണ്ടെത്താൻ
        let foundM3u8 = null;
        page.on('request', (request) => {
            const reqUrl = request.url();
            if (reqUrl.includes('.m3u8') || reqUrl.includes('.mpd')) {
                foundM3u8 = reqUrl;
            }
        });

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // ടാർഗെറ്റ് പേജ് ഓപ്പൺ ചെയ്യുന്നു
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        // നെറ്റ്‌വർക്ക് റിക്വസ്റ്റിൽ കിട്ടിയില്ലെങ്കിൽ പേജ് എച്ച്ടിഎംഎൽ കോഡിൽ നിന്ന് തിരയുന്നു
        if (!foundM3u8) {
            const content = await page.content();
            const match = content.match(/https?:\/\/[^\s"'<>]+?\.(m3u8|mpd)(\?[^\s"'<>]+)?/);
            if (match && match[0]) {
                foundM3u8 = match[0];
            }
        }

        await browser.close();

        if (foundM3u8) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'success', m3u8_link: foundM3u8 }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ status: 'error', message: 'ഡയറക്ട് ലിങ്ക് കണ്ടെത്താൻ കഴിഞ്ഞില്ല.' }));
        }

    } catch (error) {
        if (browser) {
            await browser.close();
        }
        res.writeHead(500);
        res.end(JSON.stringify({ status: 'error', message: 'സെർവർ എറർ: ' + error.message }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
