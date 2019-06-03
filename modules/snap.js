const fileUpload = require('./fileUpload');

async function snap( post, fileName ) {
	try {
		await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
		await page.goto(`http://localhost:3000`, { waitUntil: 'load', timeout: 0 });
		await page.screenshot({
			path: `./images/${fileName}.jpg`,
			type: `jpeg`
		});
		console.log('Snapped:', fileName);
		await fileUpload.fileUpload(fileName);
	}
	catch (err) {
		console.log('err :', err);
	}
}

module.exports = { snap };
