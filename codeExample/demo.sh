curl --location --request POST 'http://localhost:36315/translate' \
--header 'User-Agent: apifox/1.0.0 (https://www.apifox.cn)' \
--header 'Content-Type: application/json' \
--data-raw '{"text": "an angry man say: who care, get out, out", "targetLanguage": "zh", "sourceLanguage": "en"}'