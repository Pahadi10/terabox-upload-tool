function buildPrecreateUrl(appId, jsToken, dpLogId) {
  return `https://www.1024terabox.com/api/precreate?app_id=${appId}&web=1&channel=dubox&clienttype=0&jsToken=${jsToken}&dp-logid=${dpLogId}`;
}

function buildUploadUrl(fileName, uploadId, appId) {
  return `https://c-jp.1024terabox.com/rest/2.0/pcs/superfile2?method=upload&app_id=${appId}&channel=dubox&clienttype=0&web=1&path=%2F${encodeURIComponent(fileName)}&uploadid=${uploadId}&uploadsign=0&partseq=0`;
}

function buildCreateUrl(appId, jsToken, dpLogId) {
  return `https://www.1024terabox.com/api/create?app_id=${appId}&web=1&channel=dubox&clienttype=0&jsToken=${jsToken}&dp-logid=${dpLogId}`;
}

function buildListUrl(appId, directory, jsToken, dpLogId) {
  return `https://www.1024terabox.com/api/list?app_id=${appId}&web=1&channel=dubox&clienttype=0&jsToken=${jsToken}&dp-logid=${dpLogId}&order=time&desc=1&dir=${encodeURIComponent(directory)}&num=100&page=1&showempty=0`;
}

function buildVideoDownloadUrl(appId, videoPath) {
  return `https://www.1024terabox.com/api/streaming?path=${encodeURIComponent(videoPath)}&app_id=${appId}&clienttype=0&type=M3U8_FLV_264_480&vip=1`;
}

module.exports = { buildPrecreateUrl, buildUploadUrl, buildCreateUrl, buildListUrl, buildVideoDownloadUrl };