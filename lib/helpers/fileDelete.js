const axios = require("axios");

// ファイル削除APIリクエスト関数
const deleteFile = async (filelist, config) => {
  // config が { credentials: { ... } } か、直接 { ndus, appId, jsToken, browserId } かを判定
  const { appId, jsToken, browserId, ndus } = config.credentials || config;
  const url = "https://www.1024terabox.com/api/filemanager"; // URLを変更

  // クエリパラメータを設定
  const params = {
    opera: "delete",
    app_id: appId,
    jsToken: jsToken,
  };

  // URLSearchParamsは自動的にエンコードしますが、
  // さらに明示的にエンコードしたい場合は encodeURIComponent を使います。
  const data = new URLSearchParams();
  // JSON形式の filelist をエンコードして追加
  data.append("filelist", JSON.stringify(filelist));

  // ヘッダー情報を設定
  const headers = {
    "Cookie": `browserid=${browserId}; ndus=${ndus};`,
  };

  try {
    // APIリクエストを送信
    const response = await axios.post(url, data.toString(), {
      headers,
      params,
    });

    // レスポンスを返す
    return response.data;
  } catch (error) {
    // エラーを投げる
    throw error.response ? error.response.data : error.message;
  }
};

// モジュールとしてエクスポート
module.exports = {
  deleteFile,
};
