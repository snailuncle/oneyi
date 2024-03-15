const TranslationProvider = require("../TranslationProvider");
const volcengineOpenAPI = require("@volcengine/openapi");
const { Service } = volcengineOpenAPI;
const platformService = require("./service");
const utils = require("../utils");
/* -------------------------------------------------------------------------- */
class 火山翻译Provider extends TranslationProvider {
  async translate(translationOption) {
    const config = this.config;
    const qps = config[config.defaultProvider].QPS;
    const waitTime = 1000 / qps;
    await utils.sleep(waitTime);
    translationOption.targetLanguage = platformService.convertToPlatformLanguageCode(
      translationOption.targetLanguage,
      config
    );
    if (translationOption.sourceLanguage) {
      translationOption.sourceLanguage = platformService.convertToPlatformLanguageCode(
        translationOption.sourceLanguage,
        config
      );
    }
    const service = new Service({
      host: "open.volcengineapi.com",
      serviceName: "translate",
      region: "cn-north-1",
      accessKeyId: config[config.defaultProvider].ak,
      secretKey: config[config.defaultProvider].sk,
    });
    const postBody = {
      SourceLanguage: translationOption.sourceLanguage,
      TargetLanguage: translationOption.targetLanguage,
      TextList: [translationOption.text],
    };
    const fetchOpenAPI = service.createAPI("TranslateText", {
      Version: "2020-06-01",
      method: "POST",
      contentType: "json",
    });
    let response = await fetchOpenAPI(postBody);
    let result = {};
    if (!response.ResponseMetadata.Error) {
      result = {
        success: true,
        platform: config.defaultProvider,
        data: {
          text: response.TranslationList[0]["Translation"],
          sourceLanguage: translationOption.sourceLanguage,
          targetLanguage: response.TranslationList[0]["DetectedSourceLanguage"]
            ? response.TranslationList[0]["DetectedSourceLanguage"]
            : translationOption.targetLanguage,
        },
      };
    } else {
      result = {
        success: false,
        platform: config.defaultProvider,
        error: {
          message: response.ResponseMetadata["Error"]["Message"],
          code: response.ResponseMetadata["Error"]["Code"],
          text: translationOption.text,
          sourceLanguage: translationOption.sourceLanguage,
          targetLanguage: translationOption.targetLanguage,
        },
      };
    }
    return result;
  }
}
module.exports = 火山翻译Provider;
