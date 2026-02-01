# Terabox Upload Tool

A robust Node.js library for seamless integration with TeraBox. Effortlessly upload, download, manage files and directories, and retrieve file lists.

## Features
- **Automated Upload Flow**: Handles `precreate`, MD5 calculation, and finalization automatically.
- **File Management**: Create directories, move, rename, and delete files.
- **Downloads**: Generate direct download links (`dlink`).
- **Sharing**: Generate short URLs for file sharing.
- **Latest API Support**: Includes `jsToken`, `dp-logid`, and `appId` support to bypass modern restrictions.

## Installation
```bash
npm install terabox-upload-tool
```

## Setup & Credentials

To use this library, you need to extract three key parameters from your browser while logged into TeraBox:

1.  **ndus**: Found in your Browser Cookies (`Application` -> `Cookies` -> `https://www.terabox.com`).
2.  **jsToken**: Found in the response or query parameters of API calls (e.g., `api/list` or `api/home/info`) in the `Network` tab.
3.  **appId**: Usually `250528`, but verify by looking at the `app_id` parameter in any API request in the `Network` tab.

## Usage

### Initialization
```javascript
const TeraboxUploader = require('terabox-upload-tool');

const uploader = new TeraboxUploader({
  ndus: "YOUR_NDUS",
  jsToken: "YOUR_JS_TOKEN",
  appId: "250528",
  bdstoken: "OPTIONAL",
  browserId: "OPTIONAL"
});
```

### API Methods

#### Upload File
```javascript
const result = await uploader.uploadFile('./myfile.txt', (loaded, total) => {
  console.log(`Progress: ${Math.round((loaded / total) * 100)}%`);
}, '/remote/dir');
```

#### Download File
```javascript
const result = await uploader.downloadFile(fs_id);
console.log('Download Link:', result.downloadLink);
```

#### File List
```javascript
const result = await uploader.fetchFileList('/remote/dir');
console.log(result.data.list);
```

#### Directory Operations
```javascript
await uploader.createDirectory('/new_folder');
await uploader.moveFiles('/old/path.txt', '/new/dir', 'newname.txt');
await uploader.deleteFiles(['/file_to_delete.txt', '/folder_to_delete']);
```

#### Sharing
```javascript
const result = await uploader.generateShortUrl('/path/file.txt', fs_id);
console.log('Short URL:', result.shortUrl);
```

## License
MIT
