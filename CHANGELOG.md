# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-01-20
### Changed
- Refactored project structure: Flattened the source files. Moved `LanguageContext.tsx`, `translations.ts`, and `types.ts` to the project root for simpler access.
- Updated `vite.config.ts` and `tsconfig.json` to support the new flat structure with `@` alias pointing to root.

### Added
- Initial release of SCC Cost Calculator.
- Core calculation engine for Compute, GKE, Storage, BigQuery, and Model Armor.
- Internationalization support (ES, EN, PT).
- Premium vs. Enterprise comparison logic.
- Export to CSV functionality.
