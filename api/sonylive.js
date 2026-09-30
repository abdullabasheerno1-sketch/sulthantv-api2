export default function handler(req, res) {
  const channels = {
    "1": "https://dishmt.slivcdn.com/hls/live/2020434-b/TEN2HD/master.m3u8",
  };

  const channelId = req.query.id || "1";
  const targetUrl = channels[channelId] || channels["1"];

  // നേരെ സോണിലിവ് ലിങ്കിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.redirect(302, targetUrl);
}
