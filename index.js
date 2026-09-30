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

        // 1. .m3u8 അല്ലെങ്കിൽ .mpd ലിങ്കുകൾ നേരിട്ട് തിരയുന്നു
        let match = html.match(/https?:\/\/[^\s"'<>]+?\.(m3u8|mpd)(\?[^\s"'<>]+)?/);
        
        // 2. കിട്ടിയില്ലെങ്കിൽ ഒട്ടുമിക്ക വീഡിയോ പ്ലെയറുകളും ഉപയോഗിക്കുന്ന സോഴ്സ് ലിങ്കുകൾ തിരയുന്നു
        if (!match) {
            match = html.match(/["'](https?:\/\/[^"'\s]+\/[^"'\s]+\.m3u8[^"'\s]*)["']/);
        }

        // 3. അതും കിട്ടിയില്ലെങ്കിൽ ആറ് സ്ക്രിപ്റ്റുകൾക്കുള്ളിലെ ലിങ്കുകൾ പരിശോധിക്കുന്നു
        if (!match) {
            match = html.match(/file\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i);
        }

        if (match && (match[0] || match[1])) {
            let finalLink = match[1] ? match[1] : match[0];
            // കോട്ടിങ് ചിഹ്നങ്ങൾ ഒഴിവാക്കാൻ
            finalLink = finalLink.replace(/["']/g, '');
            
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'success', m3u8_link: finalLink }));
            return;
        }

        res.writeHead(404);
        res.end(JSON.stringify({ status: 'error', message: 'ഡയറക്ട് ലിങ്ക് കണ്ടെത്താൻ കഴിഞ്ഞില്ല. പേജ് സ്ട്രക്ചർ മാറിയിരിക്കാം.' }));

    } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ status: 'error', message: 'സെർവർ ഫെച്ച് പരാജയപ്പെട്ടു.' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
