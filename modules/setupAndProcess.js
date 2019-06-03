const puppeteer = require('puppeteer');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const port = 3000;
const snap = require('./snap');

async function setupAndProcess(posts) {
	app.engine('.hbs', exphbs({
		defaultLayout: 'main',
		extname: '.hbs',
	}));
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', '.hbs');

	app.listen(port, () => console.log('Listening...'));

	browser = await puppeteer.launch({ headless: true });
	page = await browser.newPage();

	slug = posts.slug;
	fullName = posts.blog_author.full_name;
	avatar = posts.blog_author.avatar;
	fileName = slug.replace(/[/]/g, "").replace(/blog/g, "");
	quote = posts.widgets.module_155380159866860.body.text;
	background = posts.featured_image;
	title = posts.html_title;

	let templateType = process.argv[3];

	app.get("/", (req, res) => {
		res.render(templateType, {
			templateType: templateType,
			slug: posts.slug,
			fullName: posts.blog_author.full_name,
			avatar: posts.blog_author.avatar,
			fileName: slug.replace(/[/]/g, "").replace(/blog/g, ""),
			quote: posts.widgets.module_155380159866860.body.text,
			background: posts.featured_image,
			title: posts.html_title
		});
	});

	console.log('Setup: done');
	await snap.snap( posts[0], fileName );
	browser.close();
}

module.exports = { setupAndProcess }
