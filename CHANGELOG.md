# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Created `FAQ.md` covering technical architecture, privacy, and roadmap.

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
