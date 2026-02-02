# Google Chat Shortcut for Sheets

Googleスプレッドシートの右サイドバーにGoogle Chatへのショートカットボタンを追加するChrome拡張機能です。

## 機能

- Googleスプレッドシートのサイドバー（カレンダー、Keep、ToDoなどが並ぶエリア）にGoogle Chatボタンを追加
- ボタンをクリックすると、画面右端に細長いポップアップウィンドウでGoogle Chatを表示
- Google Chatは`X-Frame-Options: SAMEORIGIN`制限によりiframe埋め込みができないため、ポップアップウィンドウ方式を採用

## インストール方法

1. このリポジトリをクローンまたはダウンロード
2. Chrome で `chrome://extensions/` を開く
3. 右上の「デベロッパーモード」を有効化
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. このプロジェクトのフォルダを選択

## ファイル構成

```
add-googlechat/
├── manifest.json    # 拡張機能の設定ファイル
├── content.js       # コンテンツスクリプト（ボタン追加ロジック）
├── icons/           # アイコン画像（オプション）
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## 技術的な実装詳細

### DOM要素の検出
GoogleスプレッドシートのDOMは動的に生成され、クラス名が難読化されています。そのため、以下の複数の方法で要素を検出します：

- `role="complementary"` など属性ベースのセレクタ
- `.waffle-assistant-entry-region` などクラスベースのセレクタ
- ボタンの親要素を辿る構造ベースの検出

### MutationObserver
ページ読み込み後もDOMが変化するため、`MutationObserver`でサイドバーの出現を監視し、ボタンを追加します。

### 重複防止
ボタンにユニークなIDを付与し、追加前に既存チェックを行うことで重複を防止します。

### ポップアップウィンドウ
- 画面右端に配置
- 幅: 400px
- 高さ: 画面の90%
- リサイズ・スクロール可能

## 注意事項

- Google Chatのログイン状態はブラウザのセッションに依存します
- ポップアップブロッカーが有効な場合、ポップアップが開かない可能性があります

## ライセンス

MIT License