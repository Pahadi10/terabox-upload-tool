const TeraboxUploader = require('./lib/index');
const fs = require('fs');
const path = require('path');

// NOTE: Replace these with your actual credentials to run the test
// NOTE: Manual .env parsing
if (fs.existsSync('.env')) {
  const envFile = fs.readFileSync('.env', 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
      
      // Try to extract ndus if it's inside a cookie-like string
      if (value.includes('ndus=')) {
        const match = value.match(/ndus=([^;]+)/);
        if (match && match[1]) {
          process.env.ndus = match[1];
        }
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
    console.log('Please set TERABOX_NDUS and TERABOX_JSTOKEN environment variables.');
    return;
  }

  const uploader = new TeraboxUploader(credentials);
  const testFileName = 'test_file.txt';
  const testFilePath = path.join(__dirname, testFileName);
  const testDirPath = '/test_dir_' + Date.now();

  try {
    // 0. Prepare dummy file
    fs.writeFileSync(testFilePath, 'Hello Terabox! This is a test file.');

    // 1. Create Directory
    console.log('\n--- Testing createDirectory ---');
    const createDirRes = await uploader.createDirectory(testDirPath);
    console.log('Result:', JSON.stringify(createDirRes, null, 2));

    // 2. Upload File
    console.log('\n--- Testing uploadFile ---');
    const uploadRes = await uploader.uploadFile(testFilePath, (loaded, total) => {
      console.log(`Upload progress: ${Math.round((loaded / total) * 100)}%`);
    }, testDirPath);
    console.log('Result:', JSON.stringify(uploadRes, null, 2));

    if (uploadRes.success) {
      const fsId = uploadRes.fileDetails.fs_id;
      const remotePath = uploadRes.fileDetails.path || `${testDirPath}/${testFileName}`;

      // 3. Fetch File List
      console.log('\n--- Testing fetchFileList ---');
      const listRes = await uploader.fetchFileList(testDirPath);
      console.log('Result:', JSON.stringify(listRes, null, 2));

      // 4. Download File
      console.log('\n--- Testing downloadFile ---');
      const downloadRes = await uploader.downloadFile(fsId);
      console.log('Result:', JSON.stringify(downloadRes, null, 2));

      // 5. Short URL
      console.log('\n--- Testing generateShortUrl ---');
      const shortUrlRes = await uploader.generateShortUrl(remotePath, fsId);
      console.log('Result:', JSON.stringify(shortUrlRes, null, 2));

      // 6. Move File
      console.log('\n--- Testing moveFiles ---');
      const newFileName = 'moved_test_file.txt';
      const moveRes = await uploader.moveFiles(remotePath, testDirPath, newFileName);
      console.log('Result:', JSON.stringify(moveRes, null, 2));

      // 7. Delete File (SKIPPED per user request)
      // console.log('\n--- Testing deleteFiles ---');
      // const deleteRes = await uploader.deleteFiles([`${testDirPath}/${newFileName}`]);
      // console.log('Result:', JSON.stringify(deleteRes, null, 2));
    }

    // Cleanup: Delete test directory (SKIPPED per user request)
    console.log('\n--- Final Cleanup skipped per user request. Files remain in:', testDirPath);
    // const cleanupRes = await uploader.deleteFiles([testDirPath]);
    // console.log('Result:', JSON.stringify(cleanupRes, null, 2));

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

runTest();
