export default async function handler(req, res) {
  const channels = {
    "1": "https://sonydaimenew.akamaized.net/hls/live/2120299/ag_strea2909/ENG/std_lrh-800300010.m3u8?hdnea=exp=1790819524~acl=/*~id=54759111454795448836551320778947~hmac=8d2bad0f2433f570017f1a1e4e439f202b64c4f50da3cf2ebcf7b8d4012f8ada",
  };

  const channelId = req.query.id || "1";
  const targetUrl = channels[channelId] || channels["1"];

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.sonyliv.com/'
      }
    });
    
    const data = await response.text();

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send('Stream Error: ' + error.message);
  }
}
