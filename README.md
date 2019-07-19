## Social Image Generator

Node script that generates a jpg file using Puppeteer.js with data pulled from the Hubspot blog API then uploads the image to the Hubspot file manager, for use as the `og:image` of blog posts.

## Built with
+ Node 10.16.0
+ [Puppeteer](https://github.com/GoogleChrome/puppeteer)
+ [Express](https://expressjs.com/)
+ [Pug](https://github.com/pugjs/pug)
+ [Unirest](https://github.com/Kong/unirest-nodejs)

## Getting Started

***(These steps only work for blogs hosted by HubSpot)***

A `config.json` file must be created with your api key in the root directory containing:
```
{
	"token": "api-key"
}
```

---

In `modules/fileUpload.js` change the folder paths in the POST function to the folder you'd like your images to be uploaded into in your HubSpot file manager.

Ex: `.field('folder_paths', 'NAME_OF_FOLDER')`

---

### To use the 'quote' template:

1. Create a text module file and include it somewhere in your blog post template
1. Copy the module's ID and paste it in the `quote` variable in `modules/setupAndProcess.js`

	`quote = posts.widgets.module_[MODULE-ID].body.text;`
1. The module should show up in the "Edit modules" panel on the blog post editing page. There the author can paste in a quote from the post (400 char. max seems to work best) so it can be pulled into the generated social image via the HubSpot API - if the `quote` template is specified.

---

### To run the script:

`node app.js [url] [templateType]`

Where `[url]` is the exact url of the blog post and `[templateType]` is the template you want to use (currently `title` or `quote`)

Ex: `node app.js https://www.website.com/blog/blog-post-slug quote`

---

### Example images: 
+ [title](https://cdn2.hubspot.net/hubfs/175296/Social_Sharing_Images/how-to-create-authentic-content.jpg)
+ [quote](https://cdn2.hubspot.net/hubfs/175296/Social_Sharing_Images/how-to-get-high-quality-google-reviews.jpg)

---

### Inserting as og:image in HubSpot Blog template

In the `<head>` of your HubSpot blog template insert:
```
<meta property="og:image" content='https://url-to-your.com/FOLDER/{{ content.slug|regex_replace("/", "")|regex_replace("blog", "") }}.jpg' />
```

Where `https://url-to-your.com/FOLDER/` is the URL path to the HubSpot file manager folder you specified in `fileUpload.js` above.

---

## How it works

1. An Express local server is spun up where the Pug templates can be rendered using express-pug-static
1. A request to the Husbpot API using the token from `config.json` and the url of the blog post to filter the results to a single post object
1. A headless Puppeteer is launched and a Pug file is created with the selected template written to it including the API data used
1. Puppeteer goes to the url where the Pug file is locally served and takes a screenshot (1200 x 630), saving it to `/images`
1. Unirest uploads (because Axios would not cooperate) the file to the folder "Social_Sharing_Images" in our Hubspot file manager
1. `process.exit()`
