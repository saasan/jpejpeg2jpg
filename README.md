# jpejpeg2jpg

拡張子が `.jpe` または `.jpeg` となっているファイル名を `.jpg` へ変更する。

## 実行

    deno run --allow-read --allow-write main.ts 対象ファイル/フォルダ

## コンパイル (Windows 用)

    deno compile --allow-read --allow-write --target x86_64-pc-windows-msvc main.ts

Visual Studio Code ならデフォルトのビルドタスク
(`Ctrl + Shift + B`) でコンパイル可能。
この場合 build ディレクトリに出力される。
