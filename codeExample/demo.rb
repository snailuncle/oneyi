# -*- coding: UTF-8 -*-
require "uri"
require "json"
require "net/http"
# 构建URI对象
url = URI("http://localhost:36315/translate")
# 创建HTTP对象
http = Net::HTTP.new(url.host, url.port)
# 创建POST请求
request = Net::HTTP::Post.new(url)
# 设置Content-Type头部
request["Content-Type"] = "application/json"
# 这里替换为您的实际请求体数据
request_body = JSON.generate({
  text: "an angry man say: who care, get out, out",
  targetLanguage: "zh",
  sourceLanguage: "en"
})
# 设置请求体
request.body = request_body
# 发送请求并获取响应
response = http.request(request)
# 打印响应体
puts response.read_body