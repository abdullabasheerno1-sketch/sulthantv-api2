const http = require('http');
const puppeteer = require('puppeteer');

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const targetUrl = urlParams.searchParams.get('url') || 'https://audinifer.com/e/fgep4q33jntz';

    let browser = null;
    try {
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ],
            headless: true
        });

        const page = await browser.newPage();
        let foundM3u8 = null;

        page.on('request', (request) => {
            const reqUrl = request.url();
            if (reqUrl.includes('.m3u8') || reqUrl.includes('.mpd')) {
                foundM3u8 = reqUrl;
            }
        });

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

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
