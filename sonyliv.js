export default async function handler(req, res) {
  // വിവിധ ചാനലുകളുടെ ലിങ്കുകൾ ഇവിടെ ID പ്രകാരം മാപ്പ് ചെയ്യാം
  const channels = {
    "1": "https://dishmt.slivcdn.com/hls/live/2020434-b/TEN2HD/master.m3u8",
    // നിങ്ങൾക്ക് ആവശ്യമുള്ള മറ്റ് ചാനൽ ലിങ്കുകൾ ഇവിടെ "2", "3" എന്നിങ്ങനെ ആഡ് ചെയ്യാം
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
