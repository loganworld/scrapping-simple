const cheerio = require('cheerio');
const Axios = require("axios");
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

const analyze = async (pageData, pageNum) => {

}

const getDes = async () => {
    for (var i = 0; i < 69543;) {  //69543
        var tagNames = []
        for (var counter = 0; counter < requestPerSecond; counter++) {
            tagNames.push(tagData[i].tagName)
            i++;
        }
        await request(tagNames, i);
        await delay(1000);
    }
    console.log("getDes");
}

module.exports = { getDes }