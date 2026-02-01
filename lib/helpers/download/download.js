const { generateSign, fetchHomeInfo, generateDownload } = require('./downloadHelper');

async function getDownloadLink(ndus, fid, appId, jsToken, dpLogId) {
  try {
    const homeInfo = await fetchHomeInfo(ndus);
    if (!homeInfo || !homeInfo.data.sign3 || !homeInfo.data.sign1 || !homeInfo.data.timestamp) {
      return { success: false, message: "Invalid home information received." };
    }

    const sign = generateSign(homeInfo.data.sign3, homeInfo.data.sign1);
    if (!sign) return { success: false, message: "Failed to generate sign." };

    const res = await generateDownload(sign, fid, homeInfo.data.timestamp, ndus, appId, jsToken, dpLogId);
    if (!res || !res.downloadLink[0]?.dlink) {
      return { success: false, message: res.message || "Failed to retrieve download link." };
    }

    return { success: true, message: "Download link retrieved successfully.", downloadLink: res.downloadLink[0].dlink };
  } catch (error) {
    return { success: false, message: error.message || "Unknown error occurred." };
  }
}

module.exports = getDownloadLink;
