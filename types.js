/**
 * @typedef {Object} TranslationOption
 * @property {string} text - 需要翻译的文本。
 * @property {string} targetLanguage - 目标语言的名称或代码（例如：'中文' 或 'zh'）。
 * @property {string} [sourceLanguage] - 文本的原始语言名称或代码（可选）。
 */
const TranslationOption = {
  text: "string",
  targetLanguage: "string",
  sourceLanguage: "string", // 可选字段
};
/**
 * @typedef {Object} TranslationResponse
 * @property {boolean} success - 指示翻译请求是否成功完成。
 * @property {UnifiedTranslationResponse} [data] - 如果成功，包含翻译的详细信息。
 * @property {TranslationError} [error] - 如果失败，包含错误详情。
 */
const TranslationResponse = {
  success: "boolean",
  data: "UnifiedTranslationResponse", // 可选字段
  translationError: "TranslationError", // 可选字段
};
/**
 * @typedef {Object} UnifiedTranslationResponse
 * @property {string} text - 翻译后的文本。
 * @property {string} sourceLanguage - 原文本的语言代码。
 * @property {string} targetLanguage - 目标语言的代码。
 */
const UnifiedTranslationResponse = {
  text: "string",
  sourceLanguage: "string",
  targetLanguage: "string",
};
/**
 * @typedef {Object} TranslationError
 * @property {string} message - 错误的描述信息。
 * @property {number} [code] - 可选的错误代码。
 * @property {string} [text] - 翻译前的文本。
 * @property {string} [sourceLanguage] - 原文本的语言代码。
 * @property {string} [targetLanguage] - 目标语言的代码。
 */
const TranslationError = {
  message: "string",
  code: "number", // 可选字段
  text: "string",
  sourceLanguage: "string",
  targetLanguage: "string",
};
module.exports = {
  TranslationOption,
  UnifiedTranslationResponse,
  TranslationResponse,
  TranslationError,
};
