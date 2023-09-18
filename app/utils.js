const fs = require("fs");

const saveFiles = async (fileName, data) => {
    const contractsDir = "./build/";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(contractsDir + fileName, data);
    console.log("export file", fileName);
};


module.exports = { saveFiles }