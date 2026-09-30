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

        // പേജിലെ സ്ക്രിപ്റ്റുകൾക്കുള്ളിൽ ഒളിഞ്ഞിരിക്കുന്ന m3u8 ലിങ്ക് പാറ്റേണുകൾ പരതുന്നു
        const regexPatterns = [
            /https?:\/\/[^\s"'<>]+?\.(m3u8|mpd)(\?[^\s"'<>]+)?/,
            /["'](https?:\/\/[^"'\s]+\/[^"'\s]+\.m3u8[^"'\s]*)["']/i,
            /file\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i,
            /source\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i
        ];

        let foundLink = null;
        for (let pattern of regexPatterns) {
            const match = html.match(pattern);
            if (match) {
                foundLink = match[1] ? match[1] : match[0];
                break;
            }
        }

        if (foundLink) {
            foundLink = foundLink.replace(/["']/g, '');
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'success', m3u8_link: foundLink }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ status: 'error', message: 'ഡയറക്ട് ലിങ്ക് കണ്ടെത്താൻ കഴിഞ്ഞില്ല.' }));
        }

    } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ status: 'error', message: 'സെർവർ എറർ: ' + error.message }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
