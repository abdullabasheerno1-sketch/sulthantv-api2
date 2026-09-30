const http = require('http');
const fetch = require('node-fetch');

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const targetUrl = urlParams.searchParams.get('url') || 'https://audinifer.com/e/fgep4q33jntz';

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://audinifer.com/'
            }
        });
        const html = await response.text();

        const m3u8Match = html.match(/https?:\/\/[^\s"'<>]+?\.(m3u8|mpd)[^\s"'<>*/]*/);
        if (m3u8Match && m3u8Match[0]) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'success', m3u8_link: m3u8Match[0] }));
            return;
        }

        const jsMatch = html.match(/["\'](https?:\/\/[^"\']+\/master\.m3u8[^"\']*)["\']/);
        if (jsMatch && jsMatch[1]) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'success', m3u8_link: jsMatch[1] }));
            return;
        }

        res.writeHead(404);
        res.end(JSON.stringify({ status: 'error', message: 'ഡയറക്ട് ലിങ്ക് കണ്ടെത്താൻ കഴിഞ്ഞില്ല.' }));

    } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ status: 'error', message: 'സെർവർ ഫെച്ച് പരാജയപ്പെട്ടു.' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
