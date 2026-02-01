const TeraboxUploader = require('./lib/index');
const fs = require('fs');
const path = require('path');

if (fs.existsSync('.env')) {
  const envFile = fs.readFileSync('.env', 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
      if (value.includes('ndus=')) {
        const match = value.match(/ndus=([^;]+)/);
        if (match && match[1]) process.env.ndus = match[1];
      }
    }
  });
}

const credentials = {
  ndus: process.env.TERABOX_NDUS || process.env.ndus || 'YOUR_NDUS',
  appId: process.env.TERABOX_APPID || process.env.appId || '250528',
  jsToken: process.env.TERABOX_JSTOKEN || process.env.jsToken || 'YOUR_JS_TOKEN',
  bdstoken: process.env.TERABOX_BDSTOKEN || process.env.bdstoken || '',
  browserId: process.env.TERABOX_BROWSERID || process.env.browserId || ''
};

async function runTest() {
  if (credentials.ndus === 'YOUR_NDUS' || credentials.jsToken === 'YOUR_JS_TOKEN') {
    console.log('Skipping real API tests: Credentials not provided.');
    return;
  }

  const uploader = new TeraboxUploader(credentials);
  const testFileName = 'test_file.txt';
  const testFilePath = path.join(__dirname, testFileName);
  const testDirPath = '/test_dir_' + Date.now();

  try {
    fs.writeFileSync(testFilePath, 'Hello Terabox! This is a test file.');

    console.log('--- Testing createDirectory ---');
    const createDirRes = await uploader.createDirectory(testDirPath);
    console.log('Result:', createDirRes.success ? 'Success' : 'Failed');

    console.log('--- Testing uploadFile ---');
    const uploadRes = await uploader.uploadFile(testFilePath, null, testDirPath);
    console.log('Result:', uploadRes.success ? 'Success' : 'Failed');

    if (uploadRes.success) {
      const fsId = uploadRes.fileDetails.fs_id;
      const remotePath = uploadRes.fileDetails.path || `${testDirPath}/${testFileName}`;

      console.log('--- Testing fetchFileList ---');
      const listRes = await uploader.fetchFileList(testDirPath);
      console.log('Result:', listRes.success ? 'Success' : 'Failed');

      console.log('--- Testing downloadFile ---');
      const downloadRes = await uploader.downloadFile(fsId);
      console.log('Result:', downloadRes.success ? 'Success' : 'Failed');

      console.log('--- Testing generateShortUrl ---');
      const shortUrlRes = await uploader.generateShortUrl(remotePath, fsId);
      console.log('Result:', shortUrlRes.success ? 'Success' : 'Failed');

      console.log('--- Testing moveFiles ---');
      const moveRes = await uploader.moveFiles(remotePath, testDirPath, 'moved_test_file.txt');
      console.log('Result:', moveRes.errno === 0 ? 'Success' : 'Failed');
    }

    console.log('--- Final Cleanup skipped. Files remain in:', testDirPath);
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
  }
}

runTest();
