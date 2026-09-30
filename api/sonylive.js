export default function handler(req, res) {
  const channels = {
    "1": "https://dishmt.slivcdn.com/hls/live/2020434-b/TEN2HD/master.m3u8?hdnea=exp=1790802001~acl=/*~id=94573650857761144204631701003147~hmac=8e72ee8e470ba6126950f1499ee122f488bb64eb66b8ec5b17d89eb1aca94d37",
  };

  const channelId = req.query.id || "1";
  const targetUrl = channels[channelId] || channels["1"];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.redirect(302, targetUrl);
}
