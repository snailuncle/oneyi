const ini = require("ini");
const fs = require("fs");
const path = require("path");
function loadConfig() {
  const defaultContent = fs.readFileSync(path.join(__dirname, "default.ini"), "utf-8");
  const defaultConfig = ini.parse(defaultContent);
  if (!["dev", "prod", "development", "production"].includes(defaultConfig.environment)) {
    throw new Error("Invalid environment: " + defaultConfig.environment);
  }
  switch (defaultConfig.environment) {
    case "development":
      defaultConfig.environment = "dev";
      break;
    case "production":
      defaultConfig.environment = "prod";
      break;
    default:
      break;
  }
  const envFile = `${defaultConfig.environment}.ini`;
  const envContent = fs.readFileSync(path.join(__dirname, envFile), "utf-8");
  const envConfig = ini.parse(envContent);
  const mergedConfig = { ...defaultConfig, ...envConfig };
  return mergedConfig;
}
module.exports = loadConfig;
