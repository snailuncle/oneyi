const types = require("./types");
const loadConfig = require("./config/configLoader");
const 小牛翻译Provider = require("./translationPlatform/小牛翻译/index.js");
const 火山翻译Provider = require("./translationPlatform/火山翻译/index.js");
const 百度翻译Provider = require("./translationPlatform/百度翻译/index.js");
const 阿里翻译Provider = require("./translationPlatform/阿里翻译/index.js");
const 智谱AIProvider = require("./translationPlatform/智谱AI/index.js");
const 有道翻译Provider = require("./translationPlatform/有道翻译/index.js");
const MoonshotProvider = require("./translationPlatform/Moonshot/index.js");
const 通义千问Provider = require("./translationPlatform/通义千问/index.js");
const 百度千帆Provider = require("./translationPlatform/百度千帆/index.js");
/* -------------------------------------------------------------------------- */
const config = loadConfig();
const defaultProvider = config.defaultProvider;
async function getTranslator(providerName) {
  let Translator;
  switch (providerName) {
    case "小牛翻译":
      Translator = 小牛翻译Provider;
      break;
    case "火山翻译":
      Translator = 火山翻译Provider;
      break;
    case "百度翻译":
      Translator = 百度翻译Provider;
      break;
    case "阿里翻译":
      Translator = 阿里翻译Provider;
      break;
    case "智谱AI":
      Translator = 智谱AIProvider;
      break;
    case "有道翻译":
      Translator = 有道翻译Provider;
      break;
    case "Moonshot":
      Translator = MoonshotProvider;
      break;
    case "通义千问":
      Translator = 通义千问Provider;
      break;
    case "百度千帆":
      Translator = 百度千帆Provider;
      break;
    default:
      throw new Error("Unsupported translation provider: " + providerName);
  }
  return new Translator(providerName, config);
}
/**
 * @param {types.TranslationOption} translationOption - The translation options.
 * @returns {Promise<types.TranslationResponse>} - 翻译响应
 */
async function translate(translationOption) {
  const translator = await getTranslator(defaultProvider);
  return await translator.translate(translationOption);
}
module.exports = {
  translate
};
