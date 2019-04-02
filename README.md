## Social Image Generator

Node script that generates a jpg using Puppeteer with data from the Hubspot blog API then uploads the image to the Hubspot file manager, for use as the `og:image` of blog posts.

To run the script:

`node app.js [url] [templateType]`

Where `[url]` is the exact url of the blog post and `[templateType]` is the template you want to use (currently `title` or `quote`)

Ex: `node app.js https://www.vieodesign.com/blog/blog-post-slug quote`

---

## How it works

1. An Express local server is spun up where the Pug templates can be rendered using express-pug-static
1. A request to the Husbpot API using the token from `config.json` and the url of the blog post to filter the results to a single post object
1. A headless Puppeteer is launched and a Pug file is created with the selected template written to it including the API data used
1. Puppeteer goes to the url where the Pug file is locally served and takes a screenshot (1200 x 630), saving it to `/images`
1. Unirest uploads (because Axios would not cooperate) the file to the folder "Social_Sharing_Images" in our Hubspot file manager
1. `process.exit()`