const TranslationProvider = require("../TranslationProvider");
const service = require("./service");
const utils = require("../utils");
const alimt20181012 = require("@alicloud/alimt20181012").default;
const $alimt20181012 = require("@alicloud/alimt20181012");
const OpenApi = require("@alicloud/openapi-client");
const Util = require("@alicloud/tea-util");
/**
 * 使用AK&SK初始化账号Client
 * @param accessKeyId
 * @param accessKeySecret
 * @return Client
 * @throws Exception
 */
function createClient(oneyiConfig) {
  let config = new OpenApi.Config({
    accessKeyId: oneyiConfig[oneyiConfig.defaultProvider].AccessKey_ID,
    accessKeySecret: oneyiConfig[oneyiConfig.defaultProvider].AccessKey_Secret
  });
  config.endpoint = "mt.cn-hangzhou.aliyuncs.com";
  return new alimt20181012(config);
}
class 阿里翻译Provider extends TranslationProvider {
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
    let client = createClient(config);
    let translateGeneralRequest = new $alimt20181012.TranslateGeneralRequest({
      formatType: "text",
      sourceLanguage: translationOption.sourceLanguage,
      targetLanguage: translationOption.targetLanguage,
      sourceText: translationOption.text,
      scene: "general"
    });
    let runtime = new Util.RuntimeOptions({});
    let response = false;
    try {
      response = await client.translateGeneralWithOptions(translateGeneralRequest, runtime);
    } catch (error) {
      let result = {
        success: false,
        platform: config.defaultProvider,
        error: {
          message: error.data.Message,
          code: error.data.statusCode,
          text: translationOption.text,
          sourceLanguage: translationOption.sourceLanguage,
          targetLanguage: translationOption.targetLanguage
        }
      };
      return result;
    }
    response = await client.translateGeneralWithOptions(translateGeneralRequest, runtime);
    let result = {};
    if (response.body.code === 200) {
      result = {
        success: true,
        platform: config.defaultProvider,
        data: {
          text: response.body.data.translated,
          sourceLanguage:
            translationOption.sourceLanguage === "auto"
              ? response.body.data?.detectedLanguage
              : translationOption.sourceLanguage,
          targetLanguage: translationOption.targetLanguage
        }
      };
    } else {
      result = {
        success: false,
        platform: config.defaultProvider,
        error: {
          message: response.body.message,
          code: response.body.code,
          text: translationOption.text,
          sourceLanguage: translationOption.sourceLanguage,
          targetLanguage: translationOption.targetLanguage
        }
      };
    }
    return result;
  }
}
module.exports = 阿里翻译Provider;
