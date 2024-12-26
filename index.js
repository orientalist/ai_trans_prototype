const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { OpenAIClient } = require('@azure/openai');
const { AzureKeyCredential } = require('@azure/core-auth');

// 建立 AOAI Client
const client = new OpenAIClient(
    `https://domain/`,
    new AzureKeyCredential(`key`)
);

const deploymentId = "gpt4-32k";

// 讀取專有名詞翻譯檔
function loadTranslations(language, originLanguage) {
    return new Promise((resolve, reject) => {
        const translations = [];
        fs.createReadStream(path.join(__dirname, 'keywords_new.csv'))
            .pipe(csv())
            .on('data', (row) => {
                if (row[originLanguage]) {
                    translations.push({ origin: row[originLanguage] ? row[originLanguage] : '', target: row[language] ? row[language] : '' });
                }
            })
            .on('end', () => {
                resolve(translations);
            })
            .on('error', reject);
    });
}

const promptByLanguage = {
    en: {
        translation: [
            {
                role: 'user',
                content: `
> 過濾資料簡單又快速，輕鬆{{%匯出|Export%}}一鍵搞定！

hint~新版面，新{{%升級|UPGRADE%}}！{{%明細匯出|Data Report%}}已於 2023 {{%年|year%}} 8 {{%月|mo%}}推出全新介面！

{{%除|÷%}}了{{%統計圖表|Chart Report%}}以外，進行{{%問卷|Survey%}}分析的時候，填答者明細也{{%是|Yes%}}相當重要的一環，而在 SurveyCake 裡，可以透過「{{%明細匯出|Data Report%}}」瀏覽、{{%刪除|Delete%}}、篩選、{{%分享|Share%}}資料，還可以直接下載 Excel {{%或|or%}} SPSS 檔做進一步的{{%專業|PRO%}}分析{{%或|or%}}資料留存！

在{{%問卷後台|Survey Dashboard%}}的「{{%明細匯出|Data Report%}}」中，可以一覽所有填答者的詳細{{%回覆|Response(s)%}}資訊{{%。|.%}}

![](~!1~!)

而以下將逐一介紹**{{%明細匯出|Data Report%}}**常用的功能：
                `.trim()
            },
            {
                role: 'assistant',
                content: `
> Filtering data simply and quickly, a one-click {{%Export%}} can easily get the job done!

hint~A new look, a new {{%UPGRADE%}}! The {{%Data Report%}} feature was launched with a brand new interface in August 2023! 

Besides the {{%Chart Report%}}, the detailed information of respondents is also a significant part while analyzing a {{%Survey%}}. At SurveyCake, you can browse, {{%Delete%}}, filter, and {{%Share%}} data through the "{{%Data Report%}}" feature. Moreover, you can directly download Excel or SPSS files for further {{%PRO%}} analysis or data retention!

Within the "{{%Data Report%}}" in the {{%Survey Dashboard%}}, you can access the detailed {{%Response(s)%}} information of all respondents.

![](~!1~!)

Additionally, we will introduce the common functionalities of the **{{%Data Report%}}** one by one:
            `.trim()
            }],
        adjusting: [
            {
                role: 'system',
                content: `
# 執行步驟：
1. 優化內容：
1-1. 確定文本的語言。
1-2. 識別並保留Markdown元素識別文本中的Markdown元素，如圖片語法(![alt text](image_url))和超連結語法([link text](URL))，並確保這些元素在最終輸出中保持原樣。
1-3. 「SurveyCake」、「hint~」、「sum~」是固定不變的文字，不論要翻譯成哪種語言，這三者禁止變更或移除，務必保持原始樣貌，也不准變更大小寫。
1-4. 精讀文本，識別出主要觀點和關鍵信息。
1-5. 提取關鍵點，簡要概述文本的主要內容。
1-6. 將文本的風格轉換成更親切和對話式的表達。
1-7. 增加個性化和參與性，在文本中加入個性化元素（如使用假定的讀者名字）和參與性特徵（如提問）。
1-8. 保持原意和語調，確保在轉換風格時，文本的原始意圖和適當的語調得以保留。
1-9. 最終檢查，檢查轉換後的文本是否忠於原意，並確保其更具吸引力和互動性。
2. 處理專有詞(以{{%%}}包圍的文字):
2-1. 調整專有詞的大、小寫，例如，非句首的專有名詞應使用小寫（例如，句中的 'Export' 應調整為 'export'）。
2-2. 若為動詞，調整專有詞為正確的時態。
2-3. 若為名詞，調整專有詞為正確的單、複數。
                `.trim()
            },
            {
                role: 'user',
                content: `
> Filtering data simply and quickly, a one-click {{%Export%}} can easily get the job done!

hint~A new look, a new {{%UPGRADE%}}! The {{%Data Report%}} feature was launched with a brand new interface in August 2023! 

Besides the {{%Chart Report%}}, the detailed information of respondents is also a significant part while analyzing a {{%Survey%}}. At SurveyCake, you can browse, {{%Delete%}}, filter, and {{%Share%}} data through the "{{%Data Report%}}" feature. Moreover, you can directly download Excel or SPSS files for further {{%PRO%}} analysis or data retention!

Within the "{{%Data Report%}}" in the {{%Survey Dashboard%}}, you can access the detailed {{%Response(s)%}} information of all respondents.

![](~!1~!)

Additionally, we will introduce the common functionalities of the **{{%Data Report%}}** one by one:
                `.trim()
            },
            {
                role: 'assistant',
                content: `
> Easily and swiftly sift through data with just a click! The {{%Export%}} function is your go-to tool. 

hint~ Gear up for a fresh look with our latest {{%upgrade%}}! In August 2023, we introduced a new and improved interface for our {{%Data Report%}} feature. 

Aside from the {{%Chart Report%}}, getting the detailed insights into your respondents forms a crucial part of your {{%survey%}} analysis. Here at SurveyCake, the "{{%Data Report%}}" feature allows you to go through, {{%delete%}}, filter, and {{%share%}} data seamlessly! Plus, you can easily download your data in Excel or SPSS formats for a more in-depth {{%PRO%}} level analysis or data preservation. 

Going into the "{{%Data Report%}}" on your {{%Survey Dashboard%}}, you'll gain access to the comprehensive {{%response(s)%}} data of all your respondents.

![](~!1~!)

Let's further hone in on some of the key features of the **{{%Data Report%}}**:
                `.trim()
            },
        ]
    },
    jp: {
        translation: [
            {
                role: 'user',
                content: `
> 過濾資料簡單又快速，輕鬆{{%匯出|翻訳を書き出す%}}一鍵搞定！

hint~新版面，新{{%升級|アップグレード%}}！{{%明細匯出|回答結果一覧%}}已於 2023 {{%年|年%}} 8 {{%月|月%}}推出全新介面！

{{%除|÷割る%}}了{{%統計圖表|統計レポート%}}以外，進行{{%問卷|フォーム%}}分析的時候，填答者明細也{{%是|はい%}}相當重要的一環，而在 SurveyCake 裡，可以透過「{{%明細匯出|回答結果一覧%}}」瀏覽、{{%刪除|削除%}}、篩選、{{%分享|シェア%}}資料，還可以直接下載 Excel {{%或|あるいは%}} SPSS 檔做進一步的{{%專業|PRO%}}分析{{%或|あるいは%}}資料留存！

在{{%問卷後台|フォームダッシュボード%}}的「{{%明細匯出|フォーム詳細の確認%}}」中，可以一覽所有填答者的詳細{{%回覆|回答%}}資訊{{%。|。%}}

![](~!1~!)

而以下將逐一介紹**{{%明細匯出|回答結果一覧%}}**常用的功能：
                `.trim()
            }, 
            {
                role: 'assistant',
                content: `
> データのフィルタリングは簡単かつ迅速で、ワンクリックで{{%翻訳を書き出す%}}が簡単に完了します！

hint~新しい外観、新しい{{%アップグレード%}}！{{%回答結果一覧%}}機能は2023年8月にまったく新しいインターフェイスで導入されました！

{{%統計レポート%}}に加えて、{{%フォーム%}}を分析する際には、回答者の詳細情報も重要な部分です。SurveyCakeでは、「{{%回答結果一覧%}}」機能を通じて、データを閲覧、{{%削除%}}、フィルタリング、{{%シェア%}}することができます。さらに、ExcelやSPSSファイルを直接ダウンロードして、さらなる{{%PRO%}}分析やデータ保持のために使用することもできます！

「{{%フォームダッシュボード%}}」内の「{{%フォーム詳細の確認%}}」では、すべての回答者の詳細な{{%回答%}}情報にアクセスできます。

![](~!1~!)

さらに、**{{%回答結果一覧%}}**の一般的な機能を順番に紹介します：
            `.trim()
            }],
        adjusting: [
            {
                role: 'system',
                content: `
# 執行步驟：
1. 優化內容：
1-1. 確定文本的語言。
1-2. 識別並保留Markdown元素識別文本中的Markdown元素，如圖片語法(![alt text](image_url))和超連結語法([link text](URL))，並確保這些元素在最終輸出中保持原樣。
1-3. 「SurveyCake」、「hint~」、「sum~」是固定不變的文字，不論要翻譯成哪種語言，這三者禁止變更或移除，務必保持原始樣貌，也不准變更大小寫。
1-4. 精讀文本，識別出主要觀點和關鍵信息。
1-5. 提取關鍵點，簡要概述文本的主要內容。
1-6. 將文本的風格轉換成更親切和對話式的表達。
1-7. 增加個性化和參與性，在文本中加入個性化元素（如使用假定的讀者名字）和參與性特徵（如提問）。
1-8. 保持原意和語調，確保在轉換風格時，文本的原始意圖和適當的語調得以保留。
1-9. 最終檢查，檢查轉換後的文本是否忠於原意，並確保其更具吸引力和互動性。
2. 處理專有詞(以{{%%}}包圍的文字):
2-1. 調整專有詞以符合日文的使用習慣，考慮到日文中沒有大小寫之分，這一步主要關注於詞語的正確使用。
2-2. 若為動詞，根據上下文調整專有詞的敬體或常體形式，以及時態（如：ます形、た形等）。
2-3. 若為名詞，考慮是否需要使用助數詞或是否有特定的表達方式。

## 特別注意：
- 在調整專有詞時，注意日文的特殊表達，如敬語的使用、助詞的正確選擇等。
- 確保最終內容忠實於原意，並且更具吸引力和互動性。
                `.trim()
            },
            {
                role: 'user',
                content: `
> データのフィルタリングは簡単かつ迅速で、ワンクリックで{{%翻訳を書き出す%}}が簡単に完了します！

hint~新しい外観、新しい{{%アップグレード%}}！{{%回答結果一覧%}}機能は2023年8月にまったく新しいインターフェイスで導入されました！

{{%統計レポート%}}に加えて、{{%フォーム%}}を分析する際には、回答者の詳細情報も重要な部分です。SurveyCakeでは、「{{%回答結果一覧%}}」機能を通じて、データを閲覧、{{%削除%}}、フィルタリング、{{%シェア%}}することができます。さらに、ExcelやSPSSファイルを直接ダウンロードして、さらなる{{%PRO%}}分析やデータ保持のために使用することもできます！

「{{%フォームダッシュボード%}}」内の「{{%フォーム詳細の確認%}}」では、すべての回答者の詳細な{{%回答%}}情報にアクセスできます。

![](~!1~!)

さらに、**{{%回答結果一覧%}}**の一般的な機能を順番に紹介します：
                `.trim()
            },
            {
                role: 'assistant',
                content: `
> データのフィルタリングがこれまでになく簡単かつ迅速になりました。ワンクリックで{{%翻訳を書き出す%}}がすぐに完了します！

hint~新しいデザイン、そして新しい{{%アップグレード%}}が施されたんです！{{%回答結果一覧%}}機能は、2023{{%年%}}8{{%月%}}に全く新しいインターフェースでデビューしました！

{{%統計レポート%}}だけではなく、{{%フォーム%}}分析を行う上で回答者の詳細情報も非常に大切です。SurveyCakeでは、「{{%回答結果一覧%}}」機能を利用して、データの閲覧、{{%削除%}}、フィルタリング、そして{{%シェア%}}が可能です。さらに、ExcelやSPSSのファイルを直接ダウンロードし、より深い{{%PRO%}}分析やデータの保管を行うこともできますよ！

「{{%フォームダッシュボード%}}」にある「{{%フォーム詳細の確認%}}」セクションでは、全ての回答者の詳細な{{%回答%}}情報をチェックできます。

![](~!1~!)

これから、{{%回答結果一覧%}}の便利な機能を順にご紹介していきます：
                `.trim()
            },
        ]
    }
}

// 主執行函式
const main = async (data, targetLanguage, originalLanguage, tempLinks, dictionary) => {
    try {
        let match;
        let count = 1;
        let countDictionary = 1;
        let newContent = data;

        // 使用正則表達式匹配傳入的內容中的網址
        const urlRegex = /https?:\/\/[^\s\]\)]+/g;

        // 尋找並替換所有網址
        // 這麼做是為了減少呼叫 AOAI 時網址所佔用的 token
        while ((match = urlRegex.exec(data)) !== null) {
            const url = match[0];
            // 將網址替換成 ~!{數字序號}~!
            const placeholder = `~!${count}~!`;
            newContent = newContent.replace(url, placeholder);
            // 將原始的網址與數字序號成對儲存，用以當 AOAI 回傳翻譯好的文字後替換回去
            tempLinks.push({ id: count, link: url });
            count++;
        }

        // 將換行替換成 /r/n
        newContent = newContent.replace(/\r\n/g, '\n');
        newContent = newContent.replace(/\n/g, '\r\n');

        // 將 SurveyCake 替換成特殊字串，避免 Survey 或 Cake 被翻譯
        newContent = newContent.replace(/SurveyCake/g, '_@&');

        // 將 hint~ 與 sum~ 也替換成特殊字串，避免被翻譯
        newContent = newContent.replace(/hint~/g, '_@=');
        newContent = newContent.replace(/sum~/g, '_@%');

        // 讀取專有名詞翻譯檔
        const translateTable = await loadTranslations(targetLanguage, originalLanguage);

        // 將專有名詞由長到短排序
        // 這麼做是為了避免包含較短專有名詞的較長專有名詞沒有被優先翻譯
        translateTable.sort((a, b) => {
            // 避免 origin 沒有值導致取 length 噴錯
            const lengthA = a.origin ? a.origin.length : 0;
            const lengthB = b.origin ? b.origin.length : 0;

            return lengthB - lengthA;
        });

        // 將傳入的內容中的專有名詞替換成對應語系的專有名詞
        // 替換後的專有名詞以 $%$% 包圍
        if (originalLanguage !== 'en') {
            // 當原始語系非英文時（其實就是中文）
            translateTable.forEach((t) => {
                // 將字典中每個專有名詞的特殊符號加上 '\' ，用以透過正則表達式比對
                const escapedOrigin = t.origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedOrigin, 'g');

                // 檢查傳入的內容中是否有應該被替代的文字
                if (regex.test(newContent)) {
                    // 若有，將傳入的內容中的 origin 替換為 $%序号$%
                    newContent = newContent.replace(regex, () => {
                        const placeholder = `{{%${countDictionary}%}}`;
                        // 將序號與字典原文、翻譯後的文字存入陣列
                        dictionary.push({ id: countDictionary, origin: t.origin, target: t.target });
                        countDictionary++;
                        return placeholder;
                    });
                }
            });
        } else {
            translateTable.forEach(t => {
                // 將字串以空白分割
                const words = t.origin.split(' ');
                const regexPattern = words.map(word => {
                    // 將每個字的字首取出
                    const firstLetter = word.charAt(0);
                    const restOfWord = word.slice(1);
                    // 將每個字的字首產生大、小寫，並組上其餘文字，最後在每個字的開始與結尾加上邊界 \b，避免黏在一起的字被錯誤翻譯，例如 filtering 就不要把 filter 拿出來翻
                    return `\\b(${firstLetter.toLowerCase()}|${firstLetter.toUpperCase()})${restOfWord}\\b`;
                }).join('\\s+'); // 字與字間可能會有多個空格

                const regex = new RegExp(regexPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

                // 使用正則表達式將相符的文字替換
                newContent = newContent.replace(regex, `$%${t.target}$%`);
            });
        }

        // 將內文中以 $%序號$% 標記出的應翻譯部分替換成 $%翻譯前文字 ^ 翻譯後文字$%
        dictionary.forEach(dic => {
            newContent = newContent.replace(new RegExp(`\\{{%${dic.id}\\%}}`, 'g'), `{{%${dic.origin}|${dic.target}%}}`);
        });

        newContent = newContent.replace(/_@&/g, 'SurveyCake');
        newContent = newContent.replace(/_@=/g, 'hint~');
        newContent = newContent.replace(/_@%/g, 'sum~');

        //console.log(newContent);

        const promptTranslate=[];

        promptTranslate.push({
            role: 'system',
            content: `
            # 任務背景說明：
            1. 你是服務於 SurveyCake 的 AI 翻譯師，負責將文本翻譯成${targetLanguage}語系。重要的是，你需要能夠識別文本中的專有詞，並根據上下文正確處理那些可能看起來像專有名詞但實際上不是的詞語。
            2. 本文已經透過字串比對的方式，將原始本文中與專有詞字典上完全相同的文字以{{%原文|翻譯%}}標示出來，其中以|分成前部分的原文字與後部分的字典上的翻譯後文字，例如{{%題目|Questions%}}。
            3. 本文已經把原始文本中的網址替換成數字序號並以~!~!包圍起來，例如~!1~!。
            4. 傳遞給你的是markdown文本。

            # 你的任務：
            1. 將本文轉換成${targetLanguage}語系，特別注意文本中的專有詞與普通詞的區分，並將專有詞維持以{{%%}}包圍。

            # 執行步驟：
            1. 處理專有詞(以{{%%}}包圍的文字)：
            1-1. 根據上下文判斷{{%%}}的詞語是否應保持為專有名詞的翻譯。
            1-2. 如果上下文表明標記內的詞語不應作為專有名詞處理，保留原文並忽略翻譯，並剔除用以標記的{{%%}}與分割符號|，例如「問{{%題目|Question%}}的是收集滿意度」，「Question」結合上下文是不通順的，表示這個「題目」不是一個獨立的專有名詞，因此你要修改成「問題目的是收集滿意度」並剔除用以標記的{{%%}}與分割符號|，產出「問題目的是收集滿意度」。
            1-3. 如果上下文確認標記內的詞語是專有名詞，使用提供的翻譯，並維持以{{%%}}包圍專有詞，最後剔除分割符號|，例如「問卷{{%題目|Question%}}有三題」根據上下文，「Question」結合上下文是通順的，表示這個「題目」是一個獨立的專有名詞，因此你要修改成「問卷{{%Question%}}有三題」。
            1-4. 在判斷過程中，仔細考慮詞語的上下文含義和句子結構，確保正確理解每個詞語的用途。
            1-5. 若以|區隔的前後兩字將同，留下其中一個，並剔除|區隔符號。
            2. 通篇翻譯為${targetLanguage}語系：
            2-1. 翻譯時注意維持markdown內容不變，包括任何超連結和圖片的排版，禁止刪除任何markdown內容，尤其是"![圖片文字](圖片路徑)"與"[超連結文字](超連結路徑)"兩種markdown內容絕對不准變更乃至於刪除。
            2-2. 不准擅自變更任何~!~!包圍的文字(包含~!~!本身也不准變更、移除)。
            2-3. 「SurveyCake」、「hint~」、「sum~」是固定的文字，不論要翻譯成哪種語言，這三者禁止變更或移除，務必保持原始樣貌，不准變更大小寫。

            ## 不應作為專有詞的普通詞處理示例：
            1. 你收到的內文：「川{{%普通|normal%}}通過了問卷調查」。
            2. 閱讀上下文，你會知道「普通」在這裡並不是作為「normal」專有詞，因此，你要保留原文並剔除翻譯後的專有詞，產生「川普通通過了問卷調查」。
            3. 將「川普通通過了問卷調查」翻譯成指定語系語系，以en舉例：「Trump passed the questionnaire」。

            ## 應作為專有詞的普通詞處理示例：
            1. 你收到的內文：「將問卷題目{{%隱藏|Hide%}}以避免被使用者瀏覽」。
            2. 閱讀上下文，你會知道「隱藏」在這裡是作為「Hide」專有詞，因此，你要保留翻譯後的專有詞並維持以{{%%}}圍繞，產生「將問卷題目{{%Hide%}}以避免被使用者瀏覽」。
            3. 將「將問卷題目{{%Hide%}}以避免被使用者瀏覽」翻譯成指定語系語系，以en舉例：「{{%Hide%}} survey questions to avoid being viewed by users」。

            # 特別注意：
            1. 不准移除任何markdown內容。
            2. 注意中文的「萬」應轉換成「10,000」的倍數。例如，「18萬」應該轉換成「180,000」。
            3. 在處理文本時，始終保持對句子結構和上下文的敏感度，這對於正確解讀和翻譯文本至關重要。
            4. please do not word-by-word translate, translate content in a high readability way(中文很多贅詞不要翻，像「若您目前非 SurveyCake 企業版用戶」>> If you are currently not a …. 現在式就無需加 currently)。
            5. 確保翻譯後的文本自然流暢，並遵循${targetLanguage}語系的表達習慣。
            `.replace(/\s+/g, '').trim()
        });

        promptByLanguage[targetLanguage].translation.forEach(t=>{
            promptTranslate.push(t);
        });

        promptTranslate.push({
            role: 'user',
            content: newContent
        });

        //console.log(promptTranslate);

        // 調用 AOAI，將專有名詞以外的其他文字翻譯成指定語系
        const result = await client.getChatCompletions(deploymentId, 
            promptTranslate
        );

        let translatedContent = result.choices[0].message.content;

        //console.log(translatedContent);

        const promptAdjusting = [];

        promptAdjusting.push(
            {
                role: 'system',
                content: `
                # 任務背景說明：
                1. 你是服務於SurveyCake的AI文章優化師，你的任務是在維持本文${targetLanguage}語系下，優化文章內容。
                2. 本文已經把原始文本中的網址替換成數字序號並以~!~!包圍起來，例如~!1~!。
                3. 傳遞給你的是markdown文本。
                4. 我希望你成為 SaaS 技術行業的專家翻譯和拼寫糾正者。你擅長說話和寫作。
                5. 我會用任何語言與您交談，您將檢測該語言，翻譯它並以我的文本的更正和改進版本進行回答。
                6. 首先，請以一個使用${targetLanguage}語言的本土作家的身份用友善的語氣表達。然後，保持要點的意思相同，並刪除文字中的一些次要要點，使其更清晰。
                7. 採用逐意翻譯，使原文更加簡潔，同時以SaaS技術行業術語為主。
                8. 我希望你只回覆更正、改進，不要寫任何其他內容，不要寫解釋。
                9. 最後，將其改寫為較短的句子，確保更容易理解。
                10. 「SurveyCake」、「hint~」、「sum~」是固定的文字，不論要翻譯成哪種語言，這三者禁止變更或移除，務必保持原始樣貌，不准變更大小寫。

                # 你的任務：
                1. 維持本篇文章為${targetLanguage}語系，在最大程度保留以{{%%}}標示出的專有詞為前提下，將接收到的多語言文本轉換成具有吸引力和對話感的風格。
                2. 識別文本中以{{%%}}標記的專有名詞，並將這些專有名詞調整為符合語法的正確形式。
                `.trim()
            }
        );

        promptByLanguage[targetLanguage].adjusting.forEach(j => {
            promptAdjusting.push(j);
        });

        promptAdjusting.push(
            {
                role: 'user',
                content: translatedContent
            }
        );

        //console.log('-----------------------');

        //console.log(promptAdjusting);

        // 調用 AOAI，將專有名詞以外的其他文字翻譯成指定語系
        const resultAdjust = await client.getChatCompletions(deploymentId, promptAdjusting);

        let adjustedContent = resultAdjust.choices[0].message.content;

        // 將包圍翻譯好的專有名詞的 $% 全部移除
        adjustedContent = adjustedContent.replace(/\{\{%([^%]+)%\}\}/g, '$1');

        //console.log('--------------------');
        console.log(adjustedContent);
        //console.log('--------------------');

        // 將網址替換回原文中
        tempLinks.forEach((l) => {
            adjustedContent = adjustedContent.replace(new RegExp(`\\~!${l.id}\\~!`, 'g'), l.link);
        });

        return {
            status: 200,
            msg: adjustedContent
        };

    } catch (err) {
        console.error('無法讀取檔案', err);
        return {
            status: 400, msg: err
        };
    }
};

exports.handler = async (event) => {
    const tempLink = [];
    const diction = [];

    if (event.requestContext.http.method === 'OPTIONS') {
        return {
            statusCode: 200, // No content for OPTIONS preflight
            body: null,
        };
    }

    const { language, text, originLanguage } = JSON.parse(event.body);

    try {
        const result = await main(text, language, originLanguage, tempLink, diction);

        return {
            statusCode: 200,
            body: JSON.stringify({ msg: result.msg }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

//main(`若您想要禁止填答者往前翻到已填答的題目去做修改，您可以將的**往前翻頁按鈕**關掉，由預設的 **ON** 轉換回 **OFF**。 `, 'en', 'cn', [], []);