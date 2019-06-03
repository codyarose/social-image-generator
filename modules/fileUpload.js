const unirest = require('unirest');
const fs = require('fs');

const config = require("../config.json");
let { token } = config;
const fileManagerUrl = `https://api.hubapi.com/filemanager/api/v2/files?hapikey=${token}`;

async function fileUpload(file) {
	unirest.post(fileManagerUrl)
		.headers({
			'Content-Type': 'multipart/form-data'
		})
		.query({
			'overwrite': 'false',
			'hidden': 'false'
		})
		.field('folder_paths', 'Social_Sharing_Images')
		.attach('file', fs.createReadStream(`./images/${file}.jpg`))
		.end(function (response) {
			console.log(`Uploaded: ${file}`)
			process.exit();
		});
}

module.exports = { fileUpload };
