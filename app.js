const axios = require('axios');
const express = require('express');
const pugStatic = require('express-pug-static');
const puppeteer = require('puppeteer');
const unirest = require('unirest');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const config = require("./config.json");
let { token } = config;

const url = `https://api.hubapi.com/content/api/v2/blog-posts?hapikey=${token}`;
const fileManagerUrl = `https://api.hubapi.com/filemanager/api/v2/files?hapikey=${token}`;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(pugStatic({
	baseDir: path.join(__dirname, '/views'),
	baseUrl: '/views',
	maxAge: 86400,
	pug: { pretty: true }
}));

app.listen(port, () => console.log('Listening...'));

var slug,
	fullName,
	avatar,
	description,
	browser,
	page,
	quote,
	background,
	title,
	templateType;


axios.get( url )
	.then((response) => {
		const postURL = process.argv[2];
		const filteredObject = response.data.objects.filter( item => item.absolute_url === postURL );
		setupAndProcess( filteredObject[0] );
	})
	.catch((error) => {
		console.log(error);
	});

async function setupAndProcess(posts) {
	browser = await puppeteer.launch({ headless: true });
	page = await browser.newPage();

	slug = posts.slug;
	fullName = posts.blog_author.full_name;
	avatar = posts.blog_author.avatar;
	description = posts.meta_description;
	fileName = slug.replace(/[/]/g, "").replace(/blog/g, "");
	quote = posts.widgets.module_155380159866860.body.text;
	background = posts.featured_image;
	title = posts.html_title;

	const templateQuote =
`html
head
	style
		include style.css
	title= "${fileName}"
body
	div(class='container' style="background: linear-gradient(to right, rgba(1,27,55,.8),rgba(0,89,113,.8)), url(${background}) no-repeat center / cover;")
		img(class="logo" src="https://cdn2.hubspot.net/hubfs/175296/kyan_images/vieo-logo-2015-WHITE-648977-edited.png")
		div(class='quote')
			p ${quote}
	script.
		const getFontSize = (textLength) => {
			if ( textLength < 259 ) {
			return "45px";
			} else if ( textLength < 450 ) {
				return "35px";
			}
		}

		const boxes = document.querySelectorAll('.quote p')

		boxes.forEach(box => {
		box.style.fontSize = getFontSize(box.textContent.length)
		})`;

	const templateTitle =
`html
head
	style
		include style-title.css
	title="${fileName}"
body
	div(class='container' style="background: url(${background}) no-repeat center / cover;")
		div(class="gradient")
		div(class="section" style="margin-right: 4.75rem;")
			div(class="section__avatar")
				img(src="${avatar}")
			h1(class="name") ${fullName}
		div(class="section")
			img(class="logo" src="https://cdn2.hubspot.net/hubfs/175296/kyan_images/vieo-logo-2015-WHITE-648977-edited.png")
			h1(class="title") ${title}`;

	if ( process.argv[3] === "quote" ) {
		templateType = templateQuote;
	} else if ( process.argv[3] === "title" ) {
		templateType = templateTitle;
	} else {
		console.log("Error: Unspecified template type");
	};

	fs.writeFileSync(`./views/index.pug`, templateType, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log('writeFileSync: done');
	});

	console.log('Setup: done');
	await snap( posts[0], fileName );
	browser.close();
}

async function snap( post, fileName ) {
	try {
		await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
		await page.goto(`http://localhost:3000/views/index${i}.html`, { waitUntil: 'load', timeout: 0 });
		await page.screenshot({
			path: `./images/${fileName}.jpg`,
			type: `jpeg`
		});
		console.log('Snapped:', fileName);
		await fileUpload(fileName);
	}
	catch (err) {
		console.log('err :', err);
	}
}

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
