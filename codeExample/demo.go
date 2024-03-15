package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	url := "http://localhost:36315/translate"
	method := "POST"

	// 请求体数据
	var data = map[string]string{
		"text":         "an angry man say: who care, get out, out",
		"targetLanguage": "zh",
		"sourceLanguage": "en",
	}

	// 将请求体编码为JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	// 创建HTTP请求
	req, err := http.NewRequest(method, url, bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	// 发送HTTP请求并获取响应
	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	// 读取响应体
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return
	}

	// 打印响应体内容
	fmt.Println(string(body))
}