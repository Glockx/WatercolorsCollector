const {
    Scraper,
    Root,
    DownloadContent,
    OpenLinks,
    CollectContent
} = require('nodejs-web-scraper');

const fs = require('fs');


(async () => {

    const config = {
        baseSiteUrl: `https://usdawatercolors.nal.usda.gov/`,
        startUrl: `https://usdawatercolors.nal.usda.gov/pom/search.xhtml`,
        filePath: './images/',
        concurrency: 10, // Maximum concurrent jobs. More than 10 is not recommended.Default is 3.
        maxRetries: 3, // The scraper will try to repeat a failed request few times(excluding 404). Default is 5.       
        logPath: './logs/' // Highly recommended: Creates a friendly JSON for each operation object, with all the relevant data. 
    }
    const scraper = new Scraper(config); //Create a new Scraper instance, and pass config to it.

    // Adding pagination to the start URL.
    const root = new Root({
        pagination: {
            queryString: 'start',
            begin: 0,
            end: 480,
            offset: 20
        }
    }); //The root object fetches the startUrl, and starts the process. 

    //Any valid cheerio-advanced-selectors selector can be passed
    // Collecting the pages
    const pages = new OpenLinks('h3.index_title a', {
        name: 'pages'
    }); //Opens each category page.

    // Downloading Images
    const images = new DownloadContent('#linkDownloadJPGinfo', {
        contentType: 'file', //The "contentType" makes it clear for the scraper that this is NOT an image(therefore the "href is used instead of "src").
        name: 'image',

    });

    root.addOperation(pages); // First collecting links with pagination from website
    pages.addOperation(images); // Then downloading images from collected links
    await scraper.scrape(root); // Starting scraping...
    //console.log(root.data)
})();
