# Frontend Index

## AI向け要約

- このカテゴリは、UI実装、ルーティング、状態管理、APIクライアント、フォーム、スタイリングを扱います。
- 画面本体は Next.js App Router 上で実装済みです。
- React 系の変更時に最初にここを読み、必要な詳細だけ開きます。
- 静的プロトタイプとの差分確認にも使います。

## このカテゴリを読むべきとき

- 画面やUIを変更するとき
- ルーティングやページ遷移を変更するとき
- フロント側のAPI呼び出しや状態管理を変更するとき

## 収録ドキュメント

| ファイル | 役割 | いつ読むか |
|---|---|---|
| [routing.md](./routing.md) | 画面遷移とURL設計 | ルート変更時 |
| [components.md](./components.md) | コンポーネント責務 | UI変更時 |
| [api-client.md](./api-client.md) | API呼び出し方針 | 通信変更時 |
| [state-management.md](./state-management.md) | 状態管理方針 | 状態追加時 |
| [form-validation.md](./form-validation.md) | 入力検証 | フォーム変更時 |
| [styling.md](./styling.md) | スタイル方針 | 見た目変更時 |

## 現在の前提

- フロントエンド基盤として Next.js App Router を導入しています。
- 画面実装は `src/app` にあり、トップページ `/` はゲーム一覧、各ゲーム本体は `/games/[gameId]` で表示します。
- ゲーム追加の起点は `src/features/games` で、一覧登録は `src/features/games/catalog.ts` に集約します。
- 現行のプログラミングゲームは互換のため `src/components/programming-game.tsx` と `src/lib/programming-game.ts` を残しつつ、`src/features/games/programming-basics/` から参照しています。
- 旧静的プロトタイプは `HTML/` に残しています。
