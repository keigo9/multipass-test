const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Multipassify = require('multipassify');
require('dotenv').config();

// Multipassのシークレットキー
const multipassSecret = process.env.SECREAT_KEY;

// Construct the Multipassify encoder
const multipassify = new Multipassify(multipassSecret);

const shopifyShopUrl = process.env.SHOP_URL;


// ログイン画面ルート
app.get('/login', (req, res) => {
  // ログインページを表示するか、ユーザーがログインフォームに送信した場合にMultipassトークンを生成してリダイレクトするかを処理します
  if (req.query.login) {
    // ユーザーがログインフォームに送信したデータを取得
    const now = new Date();
    const isoString = now.toISOString();
    const customerData = {
      email: req.query.email,
      created_at: isoString,
    };
    console.log("customerData",customerData)
    // Multipassトークン生成
    const multipassToken = multipassify.encode(customerData);
    // Multipass認証URLへリダイレクト
    const multipassURL = multipassify.generateUrl(customerData, `${shopifyShopUrl}.myshopify.com`);
    res.redirect(multipassURL);
  } else {
    // ログインフォームを表示
    res.send(`
      <h1 style="font-size:15px;">keigo-test-camp.myshopify.com Multipassログイン</h1>
      <form action="/login" method="get">
        <label for="email">Email:</label>
        <input type="text" id="email" name="email" required>
        <input type="hidden" name="login" value="true">
        <button type="submit">ログイン</button>
      </form>
    `);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
