const axios = require('axios');

const getShortUrl = async (ndus, path, fid, appId, jsToken, dpLogId) => {
  try {
    const url = `https://www.1024terabox.com/share/pset?app_id=${appId}&jsToken=${jsToken}&dp-logid=${dpLogId}`;
    const cookies = `ndus=${ndus}`;

    const formData = new URLSearchParams({
      app_id: appId,
      web: '1',
      channel: 'dubox',
      clienttype: '0',
      app: 'universe',
      schannel: '0',
      channel_list: '[0]',
      period: '0',
      path_list: `["${path}"]`,
      fid_list: `[${fid}]`,
      pwd: '',
      public: '1',
      scene: ''
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies,
      'Referer': 'https://www.1024terabox.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    const response = await axios.post(url, formData.toString(), { headers });
    return response.data;
  } catch (error) {
    return null;
  }
};

module.exports = getShortUrl;
