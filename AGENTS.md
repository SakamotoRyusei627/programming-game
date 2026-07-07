# AIエージェント向け入口

このファイルは AI エージェント向けの入口です。

最初に [AGENT_GUIDE.md](./AGENT_GUIDE.md) を読み、その指示に従ってください。

## 補足

- 次に読む共通入口は [docs/index.md](./docs/index.md) です
- エージェント固有の追加指示がない限り、運用ルールは `AGENT_GUIDE.md` を正本とします

## 今回の実装メモ

- Next.js の初期作成直後は `next/font/google` 依存が入る場合があるため、オフライン検証を前提にするなら外部フォント依存を避ける
- 最低限の検証でも `npm run lint`、`npm run typecheck`、`npm run test`、`npm run build` を `make check` で束ねておくと次の実装に入りやすい
