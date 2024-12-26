# 專案名稱

Multi-Language Translation Service

## 簡介

這是一個基於 Node.js 的專案，用於自動化翻譯文本，尤其是包含專有名詞的 Markdown 文檔，並支持多種語言的翻譯。它利用 Azure OpenAI 服務進行高效的文字轉換，並能夠識別和正確處理專有名詞，以確保翻譯的一致性和準確性。

## 功能

- 支持多種語言的翻譯（如英語、日語、中文等）。
- 自動識別並處理文本中的專有名詞，保證翻譯質量。
- 透過 Azure OpenAI API 進行高效的文本處理。
- 讀取 CSV 格式的專有名詞翻譯對照表。
- 保持 Markdown 格式的文檔結構，包括圖片鏈接及超鏈接格式。

## 安裝與使用方式

1. 先確保你的系統上已安裝 Node.js (版本 14.x 或以上)。
2. 克隆此專案的 GitHub 倉庫：
   ```bash
   git clone https://github.com/你的用戶名/Multi-Language-Translation-Service.git
   ```
3. 進入專案目錄：
   ```bash
   cd Multi-Language-Translation-Service
   ```
4. 安裝必要的依賴模組：
   ```bash
   npm install
   ```
5. 配置 Azure OpenAI 的 endpoint 和 key，並確保將其放在程式碼的相應位置。
6. 運行服務：
   ```bash
   node index.js
   ```
7. 透過 HTTP POST 請求發送要翻譯的文本和語言參數進行使用。

## 必要的依賴模組清單

- `fs` - 用於文件System交互。
- `csv-parser` - 用於解析 CSV 格式的專有名詞翻譯對照檔。
- `path` - 用於操作文件和目錄路徑。
- `@azure/openai` - 用於 Azure OpenAI 服務的 Node.js 客戶端。
- `@azure/core-auth` - 用於 Azure 認證的模組。

## 授權條款

這個專案是基於 MIT 授權發佈的。您可以自由使用、修改和分發此專案的副本，只要包含不帶修改的 LICENSE 文件及原作者的聲明。在商業用途上，請務必遵循 MIT 授權的所有條款。