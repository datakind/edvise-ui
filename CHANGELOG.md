# Changelog

## [1.5.0] - 2026-07-22

### Added
- School type shown in the set-institution dropdown
- DC and US territories in the Create Institution state selector

### Fixed
- Archived models no longer appear under Model Results in the navigation

## [1.4.1] - 2026-07-16

### Fixed
- App version now reports 1.4.1 (1.4.0 shipped without bumping `package.json`)

## [1.4.0] - 2026-07-15

### Added
- DataKinders can delete any model run from Model Run History (with confirmation)

### Changed
- Larastan raised to level 4
- Post-release reusable workflow pinned to `main`

### Removed
- Unused local institutions database table (canonical institution data is the API)

## [1.3.0] - 2026-07-01

### Added
- GenAI institution type on Create Institution
- Edvise Design System form inputs and standard form validation on Create Institution
- PostHog product analytics

### Changed
- Start Prediction nav visible to DataKinders only
- Model Results top features charts use client-side filtering and progressive loading

### Fixed
- Model Run History error alert stays inside the content container
- Model Results top features fetched client-side to avoid memory limit errors
- EDA dashboard GPA chart y-axis scale

## [1.2.0] - 2026-06-23

### Added
- Model Run History page replaces the Dashboard as the primary model results view, aligned with Figma

### Changed
- Data Dictionary route now requires authentication
- Introduced `_NOTIFY_SLACK` Cloud Build substitution to control deploy Slack notifications (off by default; enable on the production trigger only)
- Consolidated CI into a single workflow with org-wide shared checks; Larastan raised to level 3

### Fixed
- Footer responsive layout and dynamic copyright year
- Removed unused state from Model Run History

## [1.1.1] - 2026-06-10

### Fixed
- EDA dashboard stacked bar charts (e.g. Student Enrollment Type by Intensity) now render when the API returns `{ count, percentage }` data points

## [1.1.0] - 2026-05-27

Released on Caroline's last week with DataKind. Thank you, Caroline.

### Added
- Standard deviation column in the Data Dictionary
- Upload progress bar on file upload
- Optional `clear-cache=1` query parameter on the EDA route to refresh cached results

### Changed
- Simplified Create Model to a single name field
- Aligned buttons, accordions, and input borders with the Edvise Design System
- Removed client-side upload timeout so large files can complete validation

### Fixed
- Served Microsoft login icon from the app instead of a remote URL
- Improved accessibility: default link styles, login email autocomplete, Data Dictionary table header scope, input labels, accessible names for model run View and Download links, higher-contrast input borders

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