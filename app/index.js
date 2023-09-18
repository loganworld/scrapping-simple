const cheerio = require('cheerio');
const Axios = require("axios");
const fs = require('fs');
const { saveFiles, delay } = require('./utils');
const { getDes } = require('./description');

// temp
var count = 0;

const request = async (pageNum) => {
    const baseurl = "https://stackoverflow.com/tags";
    const url = `${baseurl}?page=${pageNum}&tab=popular`;
    const res = await Axios.get(url);
    await saveFiles("test" + pageNum, res.data);
}
const getTempData = (pageNum) => {
    const data = fs.readFileSync('./build/pages/test' + pageNum, 'utf8');
    // console.log(data);
    return data
}

const analyze = (pageData, pageNum) => {
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

        // check if description exist
        var tagDesString = "Doesn't exsit"
        var childCount = tagDom("div").children().length;
        if (childCount >= 9) {
            const tagDes = tagDom("div").children(":nth-child(2)").text();
            tagDesString = tagDes.replace(/^\s+|\s+$/g, "");
        }
        // console.log(tagDes);
        tagNames.push({ "id": count, "tagName": tagName, "description": tagDesString, "pageId": pageNum });
        count++;
    })

    return tagNames;
}

const getNames = async () => {
    // for (var i = 200; i < 1933; i++) {  //1933
    //     await request(i);
    //     if (i % 10 == 0)
    // await delay(2000);
    // }
    var tagNames = []
    for (var i = 1; i < 1933; i++) {
        const pageData = getTempData(i);
        const tagNameList = analyze(pageData, i);
        tagNames.push(...tagNameList);
    }
    // console.log(tagNames);
    await saveFiles("tagNames-n.json", JSON.stringify(
        tagNames,
        undefined,
        4
    ));

}

const main = async () => {
    // await getNames();
    await getDes()
}

main()