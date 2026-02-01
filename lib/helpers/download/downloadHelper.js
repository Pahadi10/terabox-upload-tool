const axios = require('axios');

function generateSign(s1, s2) {
  try {
    const p = new Uint8Array(256), a = new Uint8Array(256), result = [];
    for (let i = 0; i < 256; i++) {
      a[i] = s1.charCodeAt(i % s1.length);
      p[i] = i;
    }
    let j = 0;
    for (let i = 0; i < 256; i++) {
      j = (j + p[i] + a[i]) % 256;
      [p[i], p[j]] = [p[j], p[i]];
    }
    let i = 0; j = 0;
    for (let q = 0; q < s2.length; q++) {
      i = (i + 1) % 256;
      j = (j + p[i]) % 256;
      [p[i], p[j]] = [p[j], p[i]];
      result.push(s2.charCodeAt(q) ^ p[(p[i] + p[j]) % 256]);
    }
    return Buffer.from(result).toString('base64');
  } catch (e) { return null; }
}

async function fetchHomeInfo(ndus) {
  try {
    const res = await axios.get("https://www.1024terabox.com/api/home/info", {
      params: { app_id: "250528", web: "1", channel: "dubox", clienttype: "0" },
      headers: { "Cookie": `ndus=${ndus}` }
    });
    return { success: true, data: res.data.data };
  } catch (e) { return { success: false, message: e.message }; }
}

async function generateDownload(sign, fid, timestamp, ndus, appId, jsToken, dpLogId) {
  try {
    const res = await axios.get("https://www.1024terabox.com/api/download", {
      params: {
        app_id: appId || "250528", web: "1", channel: "dubox", clienttype: "0",
        jsToken, "dp-logid": dpLogId, fidlist: `[${fid}]`, type: "dlink",
        vip: "2", sign, timestamp, need_speed: "0"
      },
      headers: { "Cookie": `ndus=${ndus}` }
    });
    if (!res.data.dlink) return { success: false, message: res.data.errmsg };
    return { success: true, downloadLink: res.data.dlink };
  } catch (e) { return { success: false, message: e.message }; }
}

module.exports = { generateSign, fetchHomeInfo, generateDownload };