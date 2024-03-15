import requests
import json

url = "http://localhost:36315/translate"
payload = {
    "text": "an angry man say: who care, get out, out",
    "targetLanguage": "zh",
    "sourceLanguage": "en",
}
headers = {
    "User-Agent": "apifox/1.0.0 (https://www.apifox.cn)",
    "Content-Type": "application/json",
}
response = requests.post(url, headers=headers, data=json.dumps(payload))
response_dict = response.text
print("response_dict", response_dict)