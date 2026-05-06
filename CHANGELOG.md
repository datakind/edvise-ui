# Changelog

## [1.0.0] - 2026-05-06

Initial production release of Edvise.

### Added
- Introduced a reusable Alert component for consistent user messaging
- Display institution name in application layout
- Added QA (staging) environment for release validation
- Improved model card naming and structure

### Changed
- Aligned institution type handling with API-defined school type rules
- Updated application navigation (logo and home link behavior)
- Upgraded backend framework and frontend dependencies for improved security and maintainability

### Fixed
- Fixed login synchronization issue when institution ID is missing
- Resolved accessibility issues by ensuring proper document heading structure (h1)
- Fixed home link routing behavior
- Fixed regressions related to institution ID handling and data visualization (Plotly)
- Removed incorrect version ID display on Create Model screen
- Improved backend proxy timeout handling and validation error responses

### Removed
- Removed legacy school classifier UI