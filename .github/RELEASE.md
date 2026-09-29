# Release Process

The project uses trunk-based development: `main` is always releasable, and releases are cut from it whenever there is something worth shipping — no need to batch changes.

## How to Release

1. Go to GitHub Actions → Release workflow
2. Click "Run workflow" (on the `main` branch)
3. Leave the version empty to auto-calculate it, or enter one explicitly (e.g., `2026.9.0`)
4. Click "Run workflow"

The workflow sets the version in `package.json`, builds the card, updates `CHANGELOG.md`, commits them to `main` as `chore(release): vX` and publishes a GitHub Release tagged `vX`.

## Commit Message Convention

To generate meaningful changelogs, use conventional commit messages:

- `feat:` or `feature:` - New features (appears in ✨ Features)
- `fix:` or `bugfix:` - Bug fixes (appears in 🐛 Bug Fixes)
- `docs:` - Documentation changes (appears in 📚 Documentation)
- `chore:`, `build:`, `ci:` - Maintenance tasks (appears in 🔧 Chores & Maintenance)
- Other prefixes will appear in "Other Changes"

### Examples:

```bash
git commit -m "feat: add dark mode toggle"
git commit -m "fix: correct temperature display in night mode"
git commit -m "docs: update README with new configuration options"
git commit -m "chore: update dependencies"
```

## What Gets Released

The release workflow automatically includes:
- `dynamic-weather-card.js` - Built JavaScript file
- `hacs.json` - HACS configuration
- `README.md` - English documentation
- `README.ru.md` - Russian documentation
- `LICENSE` - License file
- `CHANGELOG.md` - Full changelog history

## Changelog

The changelog is automatically:
- Generated from git commits between releases
- Categorized by commit type (features, fixes, docs, etc.)
- Saved to CHANGELOG.md in the repository
- Included in the GitHub Release notes

## Versioning

This project uses [Calendar Versioning](https://calver.org/) in the same style as Home Assistant: `YYYY.M.PATCH`, tagged as `vYYYY.M.PATCH`.

- **YYYY.M** — year and month of the release (no leading zero)
- **PATCH** — starts at `0` and increments with each release in that month

Examples: `v2026.9.0` → `v2026.9.1` → `v2026.10.0`.

Breaking changes are not signalled by the version number, so call them out in the release notes (use `feat!:` / `fix!:` in commit messages).

Releases up to `v0.5.2` used Semantic Versioning; CalVer versions always sort after them, so HACS updates work as usual.
