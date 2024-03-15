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
    const token = config[config.defaultProvider]["API_KEY"];
    const model = config[config.defaultProvider].model;
    const question = `
    把下面的内容翻译为${languageKey}, 我只要译文, 不要原文:
    ------
    ${translationOption.text}
    ------
    `;
    const systemContent =
      "你是多语言者, 语言专家, 能够准确无误地理解和表达多种语言，包括但不限于英语、汉语、西班牙语、阿拉伯语等世界上的主要语言。现在做同声传译员的工作。";
    const requestBody = {
      model,
      input: {
        messages: [
          {
            role: "system",
            content: systemContent
          },
          { role: "user", content: question }
        ]
      },
      temperature: 0.3
    };
    const url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
    let response = false;
    let errorResult = false
    try {
      response = await axios.post(url, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      errorResult =error
    }
    let aiMessage = response?.data?.output?.text;
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
          usage: response.data.usage
        }
      };
    } else {
      result = {
        success: false,
        platform: config.defaultProvider,
        error: {
          message: errorResult.response.data.message,
          code: errorResult.response.status,
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
