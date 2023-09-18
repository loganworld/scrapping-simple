const cheerio = require('cheerio');
const Axios = require("axios");
const fs = require('fs');
const { saveFiles } = require('./utils');

// temp

const request = async (pageNum) => {
    const baseurl = "https://stackoverflow.com/tags";
    const url = `${baseurl}?page=${pageNum}&tab=popular`;
    const res = await Axios.get(url);
    await saveFiles("test" + pageNum, res.data);
}
const getTempData = () => {
    const data = fs.readFileSync('./build/test2', 'utf8');
    // console.log(data);
    return data
}

const analyze = (pageData) => {
    const tagNames = [];
    const pageDom = cheerio.load(pageData);
    const tagBrowserDom = pageDom("#tags-browser");
    const tagDoms = tagBrowserDom.children("div")
    // console.log(tagDoms.children("div").html());
    // console.log(.html());
    tagDoms.map((index, tagData) => {
        const tagDom = cheerio.load(tagData);
        tagDom("div").children("div").children("div").children("a").children("img").remove()
        const tagName = tagDom("div").children("div").children("div").children("a").html();
        tagNames.push(tagName);
    })

    return tagNames;
}

const main = async () => {
    for (var i = 1; i < 1933; i++)
        await request(i);
    // const pageData = getTempData();
    // const tagNames = analyze(pageData);
    // console.log(tagNames);
}

main()