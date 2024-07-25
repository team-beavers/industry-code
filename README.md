# プロジェクト概要

このプロジェクトは、日本標準産業分類と東京商工リサーチのTSR業種コードブックを使用して、マスターデータを作成するスクリプトを提供します。

## 前提条件

- **日本標準産業分類**:
  - 第14回改定日本産業分類
  - (https://www.e-stat.go.jp/classifications/terms/10) で取得したcsvファイルを使用

- **東京商工リサーチ**:
  - データは[東京商工リサーチ](https://www.tsr-net.co.jp/service/detail/file-corporate.html)の「TSR業種コードブック」を使用
  - CSVファイルが用意されていないため、日本標準産業分類との差分(p3)を手動で登録。改訂は数年に一度なので...
  - 第12回改訂日本標準産業分類がベース => 結構古いな...

# パッケージのインストール
```zsh
$ yarn install
```

# masterデータの作成
```zsh
$ yarn run generate_master
```
