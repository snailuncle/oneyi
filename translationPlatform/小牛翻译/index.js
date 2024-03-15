const axios = require("axios");
const TranslationProvider = require("../TranslationProvider");
const service = require("./service");
const utils = require("../utils");
class 小牛翻译Provider extends TranslationProvider {
  async translate(translationOption) {
    if (!translationOption.sourceLanguage) {
      return {
        success: false,
        error: {
          message: "小牛翻译Provider: sourceLanguage is required",
        },
      };
    }
    const config = this.config;
    const qps = config[config.defaultProvider].QPS;
    const waitTime = 1000 / qps;
    await utils.sleep(waitTime);
    translationOption.sourceLanguage = service.convertToPlatformLanguageCode(translationOption.sourceLanguage, config);
    translationOption.targetLanguage = service.convertToPlatformLanguageCode(translationOption.targetLanguage, config);
    const data = {
      apikey: config[config.defaultProvider].apiKey,
      src_text: translationOption.text,
      from: translationOption.sourceLanguage,
      to: translationOption.targetLanguage,
    };
    const API_URL = "http://api.niutrans.com/NiuTransServer/translation";
    const response = await axios.post(API_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    let result = {};
    if (response.data.tgt_text) {
      result = {
        success: true,
        platform: config.defaultProvider,
        data: {
          text: response.data.tgt_text,
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
          text: response.data.src_text,
          sourceLanguage: response.data.from,
          targetLanguage: response.data.to,
        },
      };
    }
    return result;
  }
}
module.exports = 小牛翻译Provider;
