const cheerio = require('cheerio');
const Axios = require("axios");
const fs = require('fs');
const { saveFiles } = require('./utils');

// temp

const request = async (pageNum) => {
    const baseurl = "https://stackoverflow.com/tags";
    const url = `${baseurl}?page=${pageNum}&tab=popular`;
    const res = await Axios.get(url);
    console.log(res.data);
    await saveFiles("test", res.data);
    return res.data
}
const getTempData = () => {
    const data = fs.readFileSync('./build/test', 'utf8');
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
        const tagName = tagDom("div").children("div").children("div").children("a").html();
        tagNames.push(tagName);
    })

    return tagNames;
}

const main = async () => {
    // var data = await request(1);
    const pageData = getTempData();
    const tagNames = analyze(pageData);
    console.log(tagNames);
}

main()