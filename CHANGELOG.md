# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Created `FAQ.md` covering technical architecture, privacy, and roadmap.

## [0.3.0] - 2026-01-21
### ✨ Nuevas Características
- **Gravity Falls Theme**: Implemented a complete "Vintage Journal" aesthetic theme, togglable via header.
  - Custom font integration (`Special Elite`, `Caesar Dressing`).
  - Full Sprite extraction and animation system (Bill Cipher, Gnome, Items).
  - Semantic CSS variable system for easy theming.
- **Persistent Preferences**: Implemented `localStorage` persistence for Theme and Language selection.
- **Branding**: Added SVG Favicon (Security Shield) and comprehensive SEO/Open Graph tags.
- **Governance**: Added GitHub Issue Template for Feature Requests (`.github/ISSUE_TEMPLATE`).

### 🔧 Refactorización y Mejoras
- **Tailwind CSS**: Migrated from CDN to local PostCSS build (v3.4) for production performance.
- **Deployment**: Moved static assets (`css/`, `img/`) to `public/` directory to fix Vite build/deploy issues on GitHub Pages.
- **Architecture**: Enforced relative paths in `index.html` and `App.tsx` for subdirectory hosting support.
- **Stability**: Fixed Recharts dimension warning (`width(-1)`) by stabilizing container layout.

## [0.2.0] - 2026-01-20
### Added
- **Export**: CSV now includes explicit columns for "Org Level" costs alongside PAYG.
- **Export**: Added pricing date (`lastUpdated`) and separated totals for PAYG vs Org in the CSV footer.
- **Docs**: Added link to official Google Cloud pricing documentation in the disclaimer.
- **Docs**: Integrated `CONTRIBUTING.md` and `FAQ.md` into the `README.md`.

### Changed
- **License**: Updated project license to **CC BY 4.0** (Attribution 4.0 International) across documentation and `package.json`.

## [0.1.0] - 2026-01-20
### Changed
- Updated to simplified flat directory structure in `src/`.

## [0.0.1] - 2026-01-19
### Added
- Initial release with support for:
  - Compute Engine, GKE (Standard/Autopilot), Cloud SQL
  - App Engine (Standard/Flex), Dataflow, Dataproc
  - Cloud Storage (Class A/B Operations)
  - BigQuery (On-Demand and Capacity)
  - Artifact Registry (Scanning)
  - Model Armor (GenAI Security)
- Multi-language support (ES, EN, PT)
- CSV export functionality
- Cost visualization charts
- Demo data mode
