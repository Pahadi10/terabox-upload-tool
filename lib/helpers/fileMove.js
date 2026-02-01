const axios = require("axios");

const moveFile = async (filelist, config) => {
  const { appId, jsToken, browserId, ndus, dpLogId } = config.credentials || config;
  const url = "https://www.1024terabox.com/api/filemanager";

  const params = {
    opera: "move",
    app_id: appId,
    jsToken: jsToken,
    "dp-logid": dpLogId,
  };

  const data = new URLSearchParams();
  data.append("filelist", JSON.stringify(filelist));

  const headers = {
    "Cookie": `browserid=${browserId}; ndus=${ndus};`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    const response = await axios.post(url, data.toString(), {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

module.exports = { moveFile };
