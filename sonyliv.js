export default async function handler(req, res) {
  const channels = {
    "1": "https://dishmt.slivcdn.com/hls/live/2020434-b/TEN2HD/master.m3u8",
  };

  const channelId = req.query.id || "1";
  const targetUrl = channels[channelId] || channels["1"];

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://www.sonyliv.com/',
        'Origin': 'https://www.sonyliv.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Upstream returned status ${response.status}`);
    }

    const data = await response.text();

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send('Stream Error: ' + error.message);
  }
}
