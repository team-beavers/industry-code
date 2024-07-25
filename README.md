# プロジェクト概要

このプロジェクトは、日本標準産業分類と東京商工リサーチのTSR業種コードブックを使用して、マスターデータを作成するスクリプトを提供します。

## 前提条件

- **日本標準産業分類**:
  - データは[総務省](https://www.soumu.go.jp/toukei_toukatsu/index/seido/sangyo/H25index.htm)の「分類項目名(CSVファイル)」を使用
  - 第13回改定（2024年7月20日時点）

- **東京商工リサーチ**:
  - データは[東京商工リサーチ](https://www.tsr-net.co.jp/service/detail/file-corporate.html)の「TSR業種コードブック」を使用
  - CSVファイルが用意されていないため、日本標準産業分類との差分(p3)を手動で登録。改訂は数年に一度なので...
  - 第12回改訂日本標準産業分類がベース （2024年7月20日時点）

# パッケージのインストール
```zsh
$ yarn install
```

# masterデータの作成
```zsh
$ yarn run generate_master
```
