# AIエージェント向け入口

このファイルは AI エージェント向けの入口です。

最初に [AGENT_GUIDE.md](./AGENT_GUIDE.md) を読み、その指示に従ってください。

## 補足

- 次に読む共通入口は [docs/index.md](./docs/index.md) です
- エージェント固有の追加指示がない限り、運用ルールは `AGENT_GUIDE.md` を正本とします

## 今回の実装メモ

- Next.js の初期作成直後は `next/font/google` 依存が入る場合があるため、オフライン検証を前提にするなら外部フォント依存を避ける
- 最低限の検証でも `npm run lint`、`npm run typecheck`、`npm run test`、`npm run build` を `make check` で束ねておくと次の実装に入りやすい
- 静的 HTML を Next.js へ移植するときは、`src/lib` にゲームロジックを先に分離すると `node:test` で挙動確認しやすい
- 画像付きの静的プロトタイプ移植では、配信用アセットを `public/` へ寄せて CSS の `url()` 参照を絶対パスに統一すると崩れにくい
- 複数ゲーム前提に広げるときは、`src/app/page.tsx` を一覧専用にして、各ゲームは `src/app/games/[gameId]/page.tsx` と `src/features/games/<game-id>/` に寄せると AI が責務を追いやすい
- 既存コードを一気に移動すると差分が大きくなるため、最初は `src/features/games/<game-id>/` から既存実装を参照するブリッジ構成にすると安全に段階移行できる
- 依存追加なしで小規模な 3D 風ゲームを増やすなら、`src/features/games/<game-id>/lib` に純粋関数のロジックを置き、見た目は CSS の perspective と段階的な座標変換で表現すると TDD を維持しやすい
