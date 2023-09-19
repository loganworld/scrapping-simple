const cheerio = require('cheerio');
const Axios = require("axios");
const fs = require('fs');
const { saveFiles, delay } = require('./utils');
const tagData = require("../build/tagNames-n.json");

const requestPerSecond = 10;
const request = async (tagNames, id) => {
    console.log(tagNames, id);

    // request
    const requestPromise = []
    for (var i = 0; i < requestPerSecond; i++) {
        const url = `https://stackoverflow.com/tags/${encodeURIComponent(tagNames[i])}/popup`;
        // console.log(url);
        const apiRequest = Axios.get(url)
        requestPromise.push(apiRequest);
    }
    var res = await Promise.all(requestPromise);

    // save requests
    for (var i = id - requestPerSecond; i < id; i++) {
        console.log(res[i].data);
        await saveFiles("tagInfos" + i, res[i].data);
    }


}

const getTempData = (tagId) => {
    const data = fs.readFileSync('./build/tags/tagInfos' + tagId, 'utf8');
    // console.log(data);
    return data
}

const analyze = (pageData, tagNum) => {

    const pageDom = cheerio.load(pageData);
    pageDom(".fc-light").children("a").remove();
    var desTag = pageDom(".fc-light").text();
    desTag = desTag.replace(/^\s+|\s+$/g, "");
    // console.log(desTag, tagNum);
    return {
        id: tagNum,
        tagName: tagData[tagNum].tagName,
        description: desTag
    }
}

const getDes = async () => {
    // for (var i = 65340; i < 65400;) {  //69543
    //     var tagNames = []
    //     for (var counter = 0; counter < requestPerSecond; counter++) {
    //         tagNames.push(tagData[i].tagName)
    //         i++;
    //     }
    //     await request(tagNames, i);
    //     await delay(1000);
    // }

    var tagNames = []
    for (var i = 0; i < 65340; i++) {
        const pageData = getTempData(i);
        const tagNameList = analyze(pageData, i);
        tagNames.push(tagNameList);
        if (i % 10000 == 0) console.log(tagNameList);
        // console.log(tagNameList);
    }
    await saveFiles("tagNames-d.json", JSON.stringify(
        tagNames,
        undefined,
        4
    ));
}

module.exports = { getDes }