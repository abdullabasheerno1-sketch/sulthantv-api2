export default async function handler(req, res) {
  const targetUrl = "http://raztv.online//live/MAGNL39E26/hvhS6xsuZP/34747.m3u8";

  try {
    const response = await fetch(targetUrl);
    const data = await response.text();

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send('Stream Error');
  }
}
