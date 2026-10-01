export default async function handler(req, res) {
  const targetUrl = "http://raztv.online/live/MAGNL39E26/hvhS6xsuZP/34747.m3u8";

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 16; V2534) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        "Referer": "http://raztv.online/"
      }
    });

    const data = await response.text();
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send('Stream Error');
  }
}
