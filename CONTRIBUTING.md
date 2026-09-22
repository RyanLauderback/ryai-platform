# Contributing

## Branches

Create a focused branch from the latest `main` using one of:

- `feat/*` for features
- `fix/*` for bug fixes
- `chore/*` for maintenance
- `docs/*` for documentation
- `test/*` for test-only changes

## Commits and pull requests

Use [Conventional Commits](https://www.conventionalcommits.org/) such as `feat(explorer): add sector filters`. Husky runs lint-staged before commits and commitlint validates commit messages.

`main` is protected. Never commit or push directly to it. Open a pull request using the template, request the CODEOWNERS review, and use the normal protected-main review flow.

All CI checks are required before merge:

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run test:e2e
```

Keep components focused, route all dynamic data through MSW handlers, preserve stable `data-testid` selectors used by tests, and centralize branded copy in `src/config/brand.ts`.
