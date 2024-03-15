const types = require("./types");
const translationService = require("./translationService");
function validateRequestBody(ctx) {
  const requiredFields = ["text", "targetLanguage"];
  for (const field of requiredFields) {
    if (typeof ctx.request.body[field] === "undefined") {
      return { isValid: false, error: `body missing required field: ${field}` };
    }
  }
  return { isValid: true };
}
/**
 * Translates the given text to the target language.
 * @param {types.TranslationOption} translationOption - The translation options.
 * @returns {Promise<types.TranslationResponse>} - 翻译响应
 */
async function translate(translationOption) {
  const result = await translationService.translate(translationOption);
  return result;
}
module.exports = {
  validateRequestBody,
  translate,
};
