function convertToPlatformLanguageCode(userLanguageCode, languageTable, config) {
  const platformLanguageCode = findValueInBFromValueInA(config.language, languageTable, userLanguageCode);
  if (!platformLanguageCode) {
    throw new Error(`Unsupported language code: ${userLanguageCode}`);
  }
  return platformLanguageCode;
}
function findValueInBFromValueInA(objA, objB, value) {
  for (const key in objA) {
    if (objA[key] === value) {
      return objB[key];
    }
  }
  return undefined;
}
async function sleep(time) {
  return new Promise((rs) => setTimeout(rs, time));
}
module.exports = {
  convertToPlatformLanguageCode,
  findValueInBFromValueInA,
  sleep,
};
