const axios = require("axios");
const crypto = require("crypto");
const path = require("path");
const TranslationProvider = require("../TranslationProvider");
const service = require("./service");
const utils = require("../utils");
class 有道翻译Provider extends TranslationProvider {
  async translate(translationOption) {
    if (!translationOption.sourceLanguage) {
      translationOption.sourceLanguage = "auto";
    }
    const config = this.config;
    const qps = config[config.defaultProvider].QPS;
    const waitTime = 1000 / qps;
    await utils.sleep(waitTime);
    if (!(translationOption.sourceLanguage === "auto")) {
      translationOption.sourceLanguage = service.convertToPlatformLanguageCode(
        translationOption.sourceLanguage,
        config
      );
    }
    translationOption.targetLanguage = service.convertToPlatformLanguageCode(translationOption.targetLanguage, config);
    const appKey = config[config.defaultProvider].应用ID;
    const key = config[config.defaultProvider].应用密钥;
    const query = translationOption.text;
    const from = translationOption.sourceLanguage;
    const to = translationOption.targetLanguage;
    const salt = new Date().getTime();
    const hash = crypto.createHash("sha256");
    var curtime = Math.round(new Date().getTime() / 1000);
    var str1 = appKey + truncate(query) + salt + curtime + key;
    hash.update(str1);
    const hashDigest = hash.digest("hex");
    var sign = hashDigest;
    const data = {
      q: query,
      from: from,
      to: to,
      appKey: appKey,
      salt: salt,
      sign: sign,
      signType: "v3",
      curtime: curtime
    };
    const API_URL = "https://openapi.youdao.com/api";
    const response = await axios.post(API_URL, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    let result = {};
    if (response.data.errorCode === "0") {
      result = {
        success: true,
        platform: config.defaultProvider,
        data: {
          text: response.data.translation[0],
          sourceLanguage: response.data.l.split("2")[0],
          targetLanguage: response.data.l.split("2")[1]
        }
      };
    } else {
      result = {
        success: false,
        platform: config.defaultProvider,
        error: {
          message: service.errorCodeToMeaning(response.data.errorCode, path.join(__dirname, "错误代码列表.ini")),
          code: response.data.errorCode,
          text: translationOption.text,
          sourceLanguage: response.data.l.split("2")[0],
          targetLanguage: response.data.l.split("2")[1]
        }
      };
    }
    return result;
  }
}
function truncate(q) {
  var len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}
module.exports = 有道翻译Provider;
