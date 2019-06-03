const unirest = require('unirest');

const config = require("./config.json");
let { token } = config;
const setupAndProcess = require('./modules/setupAndProcess');

const url = `https://api.hubapi.com/content/api/v2/blog-posts?hapikey=${token}`;

unirest.get(url)
	.end((res) => {
		if (res.error) {
			console.log('GET error: ', res.error);
		} else {
			const postURL = process.argv[2];
			const filteredObject = res.body.objects.filter( item => item.absolute_url === postURL );
			setupAndProcess.setupAndProcess( filteredObject[0] );
		}
	});
