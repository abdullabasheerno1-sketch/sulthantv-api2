export default async function handler(req, res) {
  const token = req.query.token;
  const baseUrl = "http://raztv.online//live/MAGNL39E26/hvhS6xsuZP/34746.m3u8";
  const targetUrl = token ? `${baseUrl}?token=${token}` : baseUrl;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "VLC/3.0.18 LibVLC/3.0.18",
        "Referer": "http://raztv.online//"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send('Stream Error: ' + error.message);
  }
}
