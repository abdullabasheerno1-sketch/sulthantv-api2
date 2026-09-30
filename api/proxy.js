import http from 'http';

export default function handler(req, res) {
  const targetUrl = "http://raztv.online/live/MAGNL39E26/hvhS6xsuZP/34747.m3u8";

  http.get(targetUrl, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      'Content-Type': proxyRes.headers['content-type'] || 'application/vnd.apple.mpegurl',
      'Access-Control-Allow-Origin': '*'
    });
    proxyRes.pipe(res);
  }).on('error', (err) => {
    res.status(500).send('Proxy error');
  });
}
