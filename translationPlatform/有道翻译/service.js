const ini = require("ini");
const fs = require("fs");
const path = require("path");
const utils = require("../utils.js");
function convertToPlatformLanguageCode(userLanguageCode, config) {
  const languageTable = ini.parse(fs.readFileSync(path.join(__dirname, "language.ini"), "utf-8"));
  return utils.convertToPlatformLanguageCode(userLanguageCode, languageTable, config);
}
function errorCodeToMeaning(errorCode, iniFilePath) {
  const iniContent = ini.parse(fs.readFileSync(iniFilePath, "utf-8"));
  if (Object.prototype.hasOwnProperty.call(iniContent, errorCode)) {
    return iniContent[errorCode];
  } else {
    return `未知错误码: ${errorCode}`;
  }
}
module.exports = {
  convertToPlatformLanguageCode,
  errorCodeToMeaning
};
