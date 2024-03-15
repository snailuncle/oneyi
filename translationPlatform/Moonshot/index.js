const TranslationProvider = require("../TranslationProvider");
const service = require("./service");
const utils = require("../utils");
const axios = require("axios");
/* -------------------------------------------------------------------------- */
class MoonshotProvider extends TranslationProvider {
  async translate(translationOption) {
    const config = this.config;
    const qps = config[config.defaultProvider].QPS;
    const waitTime = 1000 / qps;
    await utils.sleep(waitTime);
    const languageKey = service.findKeyInObject(config.language, translationOption.targetLanguage);
    /* -------------------------------------------------------------------------- */
    const token = config[config.defaultProvider].Token;
    const model = config[config.defaultProvider].model;
    const question = `
把下面的内容翻译为${languageKey}, 我只要译文, 不要原文:
------
${translationOption.text}
------
`;
    const requestBody = {
      model,
      messages: [
        {
          role: "system",
          content:
            "你是多语言者, 语言专家, 能够准确无误地理解和表达多种语言，包括但不限于英语、汉语、西班牙语、阿拉伯语等世界上的主要语言。现在做同声传译员的工作。"
        }, // 省略部分内容以节省空间
        { role: "user", content: question }
      ],
      temperature: 0.3
    };
    const moonshotApiUrl = "https://api.moonshot.cn/v1/chat/completions";
    let response = false;
    try {
      response = await axios.post(moonshotApiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      const result = {
        success: false,
        platform: config.defaultProvider,
        error: {
          message: error.response.data.error.message,
          code: error.response.status,
          text: translationOption.text,
          sourceLanguage: translationOption.sourceLanguage,
          targetLanguage: translationOption.targetLanguage
        }
      };
      return result;
    }
    let aiMessage = response.data.choices?.[0]?.message?.content;
    if (aiMessage) {
      aiMessage = aiMessage.replace(/------------/g, "").trim();
    }
    /* -------------------------------------------------------------------------- */
    let result = {};
    if (aiMessage) {
      result = {
        success: true,
        platform: config.defaultProvider,
        data: {
          text: aiMessage,
          sourceLanguage: translationOption.sourceLanguage,
          targetLanguage: translationOption.targetLanguage,
          usage: response.data.usage
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
module.exports = MoonshotProvider;
