> PR タイトルは [Conventional Commits](https://www.conventionalcommits.org/) に準拠してください。
> 形式: `<type>(<scope>): <summary>`
> scope は `apps/**/project.json` の `name` を優先します（現状は `site` と `site-e2e`）。
> プロジェクト非依存の変更は `github` / `docs` / `ci` / `workspace` / `skills` を使ってください。
>
> 例:
>
> - `feat(site): プロジェクトカードを追加する`
> - `docs(github): プルリクエストテンプレートを更新する`

## Summary

<!-- 何を・なぜ変更したかを 1〜3 行で書いてください -->

## Type of change

<!-- 該当するものにチェックを入れてください -->

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation
- [ ] Chore (build/test/ci)
- [ ] Breaking change

## Related issues

<!-- 関連する Issue があれば記載してください。"Fixes #123" で Issue を自動クローズできます -->

- Fixes #

## What changed?

<!-- 主な変更点を箇条書きで書いてください -->

-
-

## API / Compatibility

<!-- 公開 API や互換性への影響があれば明記してください -->

- [ ] Public API changes (export / function signature / behavior)
  - Details:
- [ ] This change is backward compatible
- [ ] This change introduces a breaking change
  - Migration notes:

## How to test

<!-- 動作確認の手順を具体的に書いてください -->

1.
2.
3.

## Environment (if relevant)

<!-- バグ修正・挙動変更の場合は記載してください -->

- Browser:
- OS: macOS / Windows / Linux
- Node version:
- pnpm version:

## Checklist

<!-- PR 作成前の確認事項です -->

- [ ] PR title follows Conventional Commits (`<type>(<scope>): <summary>`)
- [ ] Commit messages follow Conventional Commits
- [ ] I ran tests locally (if available)
- [ ] I updated docs/README if needed
- [ ] I considered error handling where relevant
