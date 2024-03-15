var axios = require("axios");
var data = {
  text: "an angry man say: who care, get out, out",
  targetLanguage: "zh",
  sourceLanguage: "en"
};
var config = {
  method: "post",
  url: "http://localhost:36315/translate",
  headers: {
    "Content-Type": "application/json"
  },
  data: data
};
axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
