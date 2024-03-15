const axios = require("axios");
const crypto = require("crypto");
const TranslationProvider = require("../TranslationProvider");
const service = require("./service");
const utils = require("../utils");
class 百度翻译Provider extends TranslationProvider {
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
    const appId = config[config.defaultProvider].APP_ID;
    const key = config[config.defaultProvider].密钥;
    const query = translationOption.text;
    const from = translationOption.sourceLanguage;
    const to = translationOption.targetLanguage;
    const salt = new Date().getTime();
    const str1 = `${appId}${query}${salt}${key}`;
    const sign = crypto.createHash("md5").update(str1).digest("hex");
    const data = {
      q: query,
      appid: appId,
      salt: salt,
      from: from,
      to: to,
      sign: sign,
    };
    const API_URL = "https://fanyi-api.baidu.com/api/trans/vip/translate";
    const response = await axios.post(API_URL, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    let result = {};
    if (response.data.trans_result) {
      result = {
        success: true,
        platform: config.defaultProvider,
        data: {
          text: response.data.trans_result[0].dst,
          sourceLanguage: response.data.from,
          targetLanguage: response.data.to,
        },
      };
    } else {
      result = {
        success: false,
        platform: config.defaultProvider,
        error: {
          message: response.data.error_msg,
          code: response.data.error_code,
          text: translationOption.text,
          sourceLanguage: translationOption.sourceLanguage,
          targetLanguage: translationOption.targetLanguage,
        },
      };
    }
    return result;
  }
}
module.exports = 百度翻译Provider;
