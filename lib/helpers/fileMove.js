const axios = require("axios");

// ファイル移動APIリクエスト関数
const moveFile = async (filelist, config) => {
  // config が { credentials: { ... } } か、直接 { ndus, appId, jsToken, browserId } かを判定
  const { appId, jsToken, browserId, ndus } = config.credentials || config;
  const url = "https://www.1024terabox.com/api/filemanager"; // URLを変更

  // クエリパラメータを設定（operaの値を "move" に変更）
  const params = {
    opera: "move",
    app_id: appId,
    jsToken: jsToken,
  };

  // URLSearchParamsを使用してForm dataを作成
  const data = new URLSearchParams();
  // JSON形式の filelist をエンコードして追加
  // 例: [{"path":"/b","dest":"/a","newname":"c"}]
  data.append("filelist", JSON.stringify(filelist));

  // ヘッダー情報を設定
  const headers = {
    "Cookie": `browserid=${browserId}; ndus=${ndus};`,
    "Content-Type": "application/x-www-form-urlencoded",
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
  moveFile,
};