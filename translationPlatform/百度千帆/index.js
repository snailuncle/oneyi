const TranslationProvider = require("../TranslationProvider");
const service = require("./service");
const utils = require("../utils");
/* -------------------------------------------------------------------------- */
class 百度千帆Provider extends TranslationProvider {
  async translate(translationOption) {
    const qianfan = require("@baiducloud/qianfan");
    const config = this.config;
    const qps = config[config.defaultProvider].QPS;
    const waitTime = 1000 / qps;
    await utils.sleep(waitTime);
    const languageKey = service.findKeyInObject(config.language, translationOption.targetLanguage);
    /* -------------------------------------------------------------------------- */
    const QIANFAN_ACCESS_KEY = config[config.defaultProvider]["安全认证_Access_Key"];
    const QIANFAN_SECRET_KEY = config[config.defaultProvider]["安全认证_Secret_Key"];
    const model = config[config.defaultProvider].model;
    const question = `
    把下面的内容翻译为${languageKey}, 我只要译文, 不要原文:
    ------
    ${translationOption.text}
    ------
    `;
    const systemContent =
      "你是多语言者, 语言专家, 能够准确无误地理解和表达多种语言，包括但不限于英语、汉语、西班牙语、阿拉伯语等世界上的主要语言。现在做同声传译员的工作。";
    const client = new qianfan.ChatCompletion({ QIANFAN_ACCESS_KEY, QIANFAN_SECRET_KEY });
    let response = false;
    try {
      response = await client.chat(
        {
          messages: [{ role: "user", content: question }],
          system: systemContent,
          temperature: 0.3
        },
        model
      );
    } catch (error) {
      let result = {
        success: false,
        platform: config.defaultProvider,
        error: {
          message: error.message,
          text: translationOption.text,
          sourceLanguage: translationOption.sourceLanguage,
          targetLanguage: translationOption.targetLanguage
        }
      };
      return result;
    }
    let aiMessage = response.result;
    if (aiMessage) {
      aiMessage = aiMessage.replace(/------------/g, "").trim();
    }
    /* -------------------------------------------------------------------------- */
    let result = {};
    if (response) {
      result = {
        success: true,
        platform: config.defaultProvider,
        data: {
          text: aiMessage,
          sourceLanguage: translationOption.sourceLanguage,
          targetLanguage: translationOption.targetLanguage,
          usage: response.usage
        }
      };
    } else {
      result = {
        success: false,
        platform: config.defaultProvider,
        error: {
          message: config.defaultProvider + "翻译异常",
          text: translationOption.text,
          sourceLanguage: translationOption.sourceLanguage,
          targetLanguage: translationOption.targetLanguage
        }
      };
    }
    return result;
  }
}
module.exports = 百度千帆Provider;
