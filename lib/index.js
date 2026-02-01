const axios = require('axios');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const FormData = require('form-data');
const {
  buildPrecreateUrl,
  buildUploadUrl,
  buildCreateUrl,
  buildListUrl,
} = require('./helpers/utils');
const getDownloadLink = require('./helpers/download/download');
const { deleteFile } = require('./helpers/fileDelete');
const { moveFile } = require('./helpers/fileMove');
const getShortUrl = require('./helpers/getShortUrl');

class TeraboxUploader {
  constructor(credentials) {
    if (!credentials || !credentials.ndus || !credentials.appId || !credentials.jsToken) {
      throw new Error('Credentials are required (ndus, appId, jsToken).');
    }

    this.credentials = {
      ndus: credentials.ndus,
      cookies: `lang=en; ndus=${credentials.ndus};`,
      appId: credentials.appId,
      jsToken: credentials.jsToken,
      bdstoken: credentials.bdstoken || '',
      browserId: credentials.browserId || '',
      dpLogId: credentials.dpLogId || this._generateDpLogId(),
    };
  }

  _generateDpLogId() {
    return crypto.randomBytes(10).toString('hex').toUpperCase();
  }

  async uploadFile(filePath, progressCallback, directory = '/') {
    try {
      const fileName = path.basename(filePath);
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;
      const fileMd5 = crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');

      const precreateUrl = buildPrecreateUrl(this.credentials.appId, this.credentials.jsToken, this.credentials.dpLogId);
      const precreateResponse = await axios.post(
        precreateUrl,
        new URLSearchParams({
          path: `${directory}/${fileName}`,
          autoinit: '1',
          target_path: directory,
          block_list: JSON.stringify([fileMd5]),
          size: fileSize,
          local_mtime: Math.floor(stats.mtimeMs / 1000),
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: this.credentials.cookies } }
      );

      if (precreateResponse.data.errno !== 0) {
        throw new Error(`Precreate failed: ${precreateResponse.data.errmsg || 'Unknown error'}`);
      }

      const uploadId = precreateResponse.data.uploadid;
      const uploadUrl = buildUploadUrl(fileName, uploadId, this.credentials.appId);
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      await axios.post(uploadUrl, formData, {
        headers: { ...formData.getHeaders(), Cookie: this.credentials.cookies },
        onUploadProgress: (e) => progressCallback && progressCallback(e.loaded, e.total),
      });

      const createUrl = buildCreateUrl(this.credentials.appId, this.credentials.jsToken, this.credentials.dpLogId);
      const createParams = new URLSearchParams({
        path: `${directory}/${fileName}`,
        size: fileSize,
        uploadid: uploadId,
        target_path: directory,
        block_list: JSON.stringify([fileMd5]),
        local_mtime: Math.floor(stats.mtimeMs / 1000),
        isdir: '0',
        rtype: '1',
      });
      if (this.credentials.bdstoken) createParams.append('bdstoken', this.credentials.bdstoken);

      const createResponse = await axios.post(createUrl, createParams.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: this.credentials.cookies },
      });

      return { success: true, message: 'File uploaded successfully.', fileDetails: createResponse.data };
    } catch (error) {
      return { success: false, message: error.response?.data || error.message };
    }
  }

  async createDirectory(directoryPath) {
    try {
      const createUrl = buildCreateUrl(this.credentials.appId, this.credentials.jsToken, this.credentials.dpLogId);
      const createParams = new URLSearchParams({
        path: directoryPath,
        isdir: '1',
        size: '0',
        block_list: '[]',
        local_mtime: Math.floor(Date.now() / 1000),
      });
      if (this.credentials.bdstoken) createParams.append('bdstoken', this.credentials.bdstoken);

      const response = await axios.post(createUrl, createParams.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: this.credentials.cookies },
      });
      return { success: true, message: 'Directory created successfully.', data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data || error.message };
    }
  }

  async fetchFileList(directory = '/') {
    try {
      const listUrl = buildListUrl(this.credentials.appId, directory, this.credentials.jsToken, this.credentials.dpLogId);
      const response = await axios.get(listUrl, { headers: { Cookie: this.credentials.cookies } });
      return { success: true, message: 'File list retrieved successfully.', data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || error.message };
    }
  }

  async downloadFile(fileId) {
    try {
      const { ndus, appId, jsToken, dpLogId } = this.credentials;
      return await getDownloadLink(ndus, fileId, appId, jsToken, dpLogId);
    } catch (error) {
      return { success: false, message: error.response?.data?.error || error.message };
    }
  }

  async deleteFiles(fileList) {
    try {
      const config = { ...this.credentials };
      const result = await deleteFile(fileList, config);
      return { success: true, message: 'Files deleted successfully.', result };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || error.message };
    }
  }

  async moveFiles(sourcePath, destinationPath, newName) {
    try {
      const config = { ...this.credentials };
      const fileList = [{ path: sourcePath, dest: destinationPath, newname: newName }];
      return await moveFile(fileList, config);
    } catch (error) {
      throw error;
    }
  }

  async generateShortUrl(filePath, fileId) {
    try {
      const { ndus, appId, jsToken, dpLogId } = this.credentials;
      const res = await getShortUrl(ndus, filePath, fileId, appId, jsToken, dpLogId);
      if (res && res.errno === 0) {
        return { success: true, message: 'Short URL generated successfully.', shortUrl: res.shorturl };
      }
      return { success: false, message: res?.errmsg || 'Failed to generate short URL.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = TeraboxUploader;
