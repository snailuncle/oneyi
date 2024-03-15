const ini = require("ini");
const fs = require("fs");
const path = require("path");
const utils = require("../utils.js");
function convertToPlatformLanguageCode(userLanguageCode, config) {
  const languageTable = ini.parse(fs.readFileSync(path.join(__dirname, "language.ini"), "utf-8"));
  return utils.convertToPlatformLanguageCode(userLanguageCode, languageTable, config);
}
module.exports = {
  convertToPlatformLanguageCode,
};
