# 宵鳴き館

スマホ横画面対応の、短編ドット絵探索ホラーゲームです。  
HTML / CSS / JavaScript だけで動くので、GitHub Pages でそのまま公開できます。

## 収録内容
- タイトル画面
- スマホ向け方向ボタン
- 調べるボタン
- 保存 / 続きから
- 鍵アイテム
- 小謎解き
- 追跡イベント
- NORMAL END / TRUE END / GAME OVER

## 使い方
### ローカルで遊ぶ
`index.html` をブラウザで開くだけで遊べます。

### GitHub Pagesで公開
1. このフォルダ一式を GitHub リポジトリにアップロード
2. GitHub の `Settings` → `Pages`
3. `Deploy from a branch` を選択
4. `main` ブランチ / `root` を指定
5. 数分待つと公開URLが発行されます

## ファイル構成
- `index.html` : 画面本体
- `style.css` : UI / レイアウト / スマホ対応
- `main.js` : ゲームロジック
- `README.md` : 説明書

## 操作
### スマホ
- 左の方向ボタン：移動
- 右の「調べる」：会話送り / 調査
- 右の「走る」：押している間だけ移動速度アップ
- 上部「保存」：セーブ

### PC
- 矢印キー or WASD：移動
- E / Enter / Space：調べる
- Shift：走る

## メモ
- セーブはブラウザの `localStorage` を使っています
- Safari / Chrome でも動く軽量構成です
- 画像素材なしでも世界観が出るよう、描画はコード内で行っています
