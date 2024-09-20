# プロジェクト概要

このプロジェクトは、日本標準産業分類と東京商工リサーチのTSR業種コードブックを使用して、マスターデータを作成するスクリプトを提供します。

## 前提条件
本プロジェクトのデータソースはそれぞれ異なる業種分類コードを持つ
- JSIC (日本産業分類)
- TSR (東京商工リサーチ)
- SalesNow


- **JSIC(日本標準産業分類)_master**:
  - 第14回改定日本産業分類を使用
  - (https://www.e-stat.go.jp/classifications/terms/10) で取得したcsvファイルを[大・中・小・細]分類別で作成

- **TSR(東京商工リサーチ)_master**:
  - データは[東京商工リサーチ](https://www.tsr-net.co.jp/service/detail/file-corporate.html)の「TSR業種コードブック」を使用
  - 第12回改訂日本標準産業分類をベースにTSRコードとの差分(p3)を埋めて、[大・中・小・細]分類別で作成


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
