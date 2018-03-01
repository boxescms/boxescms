# Changelog

## [0.3.0] - 2018-03-01
### Added
- Global data with data/global.js

## [0.2.3] - 2018-02-28
### Changed
- Fixed webpack configuration to build to public path

## [0.2.2] - 2018-02-28
### Changed
- Fixed deploy to npm to include project files

## [0.2.1] - 2018-02-28
### Changed
- Include lock files

## [0.2.0] - 2018-02-28
### Notes
- Delete `webpack.config.js` and `webpack.production.js`, then re-run `boxes init` for existing upgrades

### Changed
- Updated Webpack to v4
- Updated dotenv to v5
- Updated normalize.css to v8
- Updated StandardJS to v11
- Updated all packages minor/patch version

## [0.1.3] - 2018-02-28
### Fixed
- Wrong variable type on knexfile pool
- Server watcher on dev to including files properly

### Added
- Add .editorconfig on init
- WIP Admin Server

## [0.1.2] - 2018-02-09
### Added
- Server watcher for dev mode

## [0.1.1] - 2018-02-09
### Changed
- Updated README
- Updated `boxes init` to set default package.scripts.{build,watch} to `boxes build` and `boxes watch` instead of Gulp
- Removed `knex` related scripts from package.scripts

## [0.1.0] - 2018-02-09
### Added
- Frontend build and watch (pug, js, sass, scss, png, jpg)
- Data for content management and static html generation
- `boxes {build,watch}` CLI

### Changed
- Temporary removed Admin authentication API for Admin server separation
- Shift App convention loading to /app folder for api and routes

## [0.0.5] - 2018-02-07

### Fixed
- Add missing knex as dependency

## [0.0.4] - 2018-02-07

### Fixed
- Use correct knexfile

## [0.0.3] - 2018-02-06

### Added
- DB layer using knex.js
- Init .editorconfig file
- Init .env.example file
- Init knexfile.js file

### Changed
- Admin authentication to use custom JsonStore for storage

## [0.0.2] - 2018-02-05

### Added
- `boxes` CLI

## [0.0.1] - 2018-01-30

### Added
- API convention
- Custom routes
- Admin authentication API
