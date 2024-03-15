const types = require("../types");
class TranslationProvider {
  constructor(name, config) {
    this.name = name;
    this.config = config;
  }
  /**
   * @param {types.TranslationOption} translationOption - The translation options.
   * @returns {Promise<types.TranslationResponse>} - 翻译响应
   */
  async translate(translationOption) {
    throw new Error("translate method must be implemented by the provider");
  }
}
module.exports = TranslationProvider;
