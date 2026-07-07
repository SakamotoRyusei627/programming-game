# Docs Index

## AI向け要約

- このファイルは、AIエージェント向けの入口となる索引です。
- まずここを読み、作業内容に合うカテゴリだけを選択します。
- 詳細は各カテゴリの `index.md` から必要最小限だけ読む前提です。
- 実装や運用の断定情報ではなく、どこを見るべきかを示します。
- 実装後に仕様や制約が変わった場合だけ、該当 `docs` を更新します。

## 作業別ナビゲーション

| 作業内容 | 次に読むファイル |
|---|---|
| 全体構成・ディレクトリ構成 | [docs/architecture/index.md](./architecture/index.md) |
| React / UI / フロント実装 | [docs/frontend/index.md](./frontend/index.md) |
| Spring Boot / API / 業務ロジック | [docs/backend/index.md](./backend/index.md) |
| 認証・ログイン・権限 | [docs/auth/index.md](./auth/index.md) |
| DB / Entity / Migration | [docs/database/index.md](./database/index.md) |
| テスト追加・テスト修正 | [docs/testing/index.md](./testing/index.md) |
| CI/CD / デプロイ | [docs/deployment/index.md](./deployment/index.md) |
| ログ・監視・アラート | [docs/monitoring/index.md](./monitoring/index.md) |
| XSS / CSP / HTMLサニタイズ / 秘密情報 | [docs/security/index.md](./security/index.md) |
| 過去の技術判断 | [docs/decisions/index.md](./decisions/index.md) |
| mdの書き方 | [docs/_templates/doc-template.md](./_templates/doc-template.md) |
| タスク運用 / TDD / 実行コマンド | [AGENT_GUIDE.md](../AGENT_GUIDE.md) |
| タスク検討メモ / 要確認事項 | [NOTES.md](../NOTES.md) |
| スコープ外の改善提案 | [PROPOSALS.md](../PROPOSALS.md) |

## 読み方ルール

- このファイルを読んだ後、作業に関係するカテゴリの `index.md` だけ読む
- 各カテゴリ配下の詳細 `md` は、必要になったものだけ読む
- 関係ないカテゴリの `md` をまとめ読みしない
- 実装前に、作業対象に関係する `docs` だけ確認する
- 実装指示がある場合は `TASKS.md` と `AGENT_GUIDE.md` も確認する
- タスク化前の論点整理が必要なら `NOTES.md` を確認する
- 実装中に見送られた改善提案を確認したいなら `PROPOSALS.md` を確認する
- `docs` 配下の `index.md` 以外は `3,000文字以内を基本` とし、超えそうなら別ファイルを検討する
- 別ファイルへ分割した場合は、該当カテゴリの `index.md` にリンクを追加する
- 実装後、仕様・設計・コマンド・注意点が変わった場合だけ `docs` を更新する
- 単なる作業ログは `docs` に残さない
- 古くなった記述を見つけたら、追記ではなく修正する

## 現在の前提

- 現時点のリポジトリ内には、実装コードや設定ファイルが未確認です。
- そのため、カテゴリ配下の初期文書には `未確認` と `要確認` を残しています。
- 実装が追加されたら、該当カテゴリから具体的なパス・コマンド・制約へ置き換えてください。
