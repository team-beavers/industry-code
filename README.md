# プロジェクト概要

このプロジェクトは、日本標準産業分類と東京商工リサーチのTSR業種コードブックを使用して、マスターデータを作成するスクリプトを提供します。

## 前提条件

- **日本標準産業分類**:
  - 第14回改定日本産業分類
  - (https://www.e-stat.go.jp/classifications/terms/10) で取得したcsvファイルを使用

- **TSR(東京商工リサーチ)_master**:
  - データは[東京商工リサーチ](https://www.tsr-net.co.jp/service/detail/file-corporate.html)の「TSR業種コードブック」を使用
  - CSVファイルが用意されていないため、日本標準産業分類との差分(p3)を手動で登録。改訂は数年に一度なので...
  - 第12回改訂日本標準産業分類がベース


# パッケージのインストール
```zsh
$ yarn install
```

# masterデータの作成
```zsh
# jsic業種コードmasterデータの作成
$ yarn run generate_jsic_master

# TSR業種コードmasterデータの作成
$ yarn run generate_tsr_master


```
