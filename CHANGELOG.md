# Changelog

## [0.10.4] - 2018-09-27
### Fixed
- Inspect mode on `--inspect` option
- Babel 7 upgrade issues on webpack build

## [0.10.1] - 2018-09-27
### Added
- Inspect mode on server watch

## [0.10.0] - 2018-09-25
### Added
- PORT env support

### Updated
- Babel updated to v7

## [0.9.3] - 2018-09-05
### Updated
- Builders to log consistent output

## [0.9.2] - 2018-09-04
### Updated
- Major performance bump on Webpack watch

## [0.9.1] - 2018-08-23
### Fixed
- Webpack config not loading PostCSS plugins properly

## [0.9.0] - 2018-08-21
### Updated
- Webpack devtool to use `inline-cheap-source-map`
- Vue linting with eslint-plugin-vue@next
- New JsonStore interface
- Admin API
- Dependencies version

## [0.8.3] - 2018-08-01
### Updated
- `boxes init` to set app key into .env by default

## [0.8.2] - 2018-07-31
### Added
- Vue linting with eslint-plugin-html

## [0.8.1] - 2018-07-30
### Fixed
- Regression on 0.8.0 with typo for indentedSyntax on Webpack config

## [0.8.0] - 2018-07-27
### Updated
- Update vue-loader to v15
- Update boxes init to include browserlist
- Update all package version

## [0.7.3] - 2018-07-26
### Added
- `npm run dev` script for dev start up

### Fixed
- Reverted 0.7.2 for prerendering Mustacha on SASS/SCSS compiler

## [0.7.1] - 2018-07-25
### Added
- Mustache render on SASS/SCSS compiler to support ENV

### Fixed
- Shift dotenv requirement to parent builder
- Avoid using reserved name for static

## [0.7.0] - 2018-07-24
### Added
- Added Webpack Merge to utilise app `webpack.merge.js` file

## [0.6.8] - 2018-07-20
### Fixed
- Update Webpack to generate chunk with querystring

## [0.6.7] - 2018-07-19
### Fixed
- Fixed regression on wrong Webpack configuration plugin declaration

## [0.6.6] - 2018-07-19
### Fixed
- Update Webpack with moment and lodash performance upgrade

## [0.6.5] - 2018-07-12
### Added
- Added Promise support to data layer for pug compilation

## [0.6.4] - 2018-07-03
### Fixed
- Update Webpack JSONP function parameter to prevent multiple runtime collision

## [0.6.3] - 2018-06-27
### Added
- babel-eslint parser to support dynamic import syntax

### Fixed
- Babel stage-2 preset not enabled on js files

## [0.6.2] - 2018-06-26
### Added
- Babel stage 2 preset in Webpack config

## [0.6.1] - 2018-06-26
### Added
- App preinit and postinit support

## [0.6.0] - 2018-06-20
### Updated
- Update all dependencies version

### Removed
- Removed imagemin and image compression build

## [0.5.11] - 2018-06-13
### Added
- Add 2 new env vars for JS build: VERSION and BUILD_HASH

## [0.5.10] - 2018-06-04
### Fixed
- Fix static builder stops building process when there is no static files

### Updated
- Update all dependencies version

### Removed
- Remove Bootstrap package

## [0.5.9] - 2018-05-24
### Fixed
- Fix build statics not handling folder properly

## [0.5.8] - 2018-05-24
### Fixed
- Fix webpack config typo on devtool

## [0.5.7] - 2018-05-11
### Fixed
- Temporary downgrade vue-loader to v14 (https://vue-loader.vuejs.org/migrating.html)

## [0.5.6] - 2018-05-04
### Fixed
- Set devtool for development build
- Invalid targets in webpack configuration for browserslist

### Updated
- Update all dependencies version

## [0.5.5] - 2018-03-21
### Fixed
- JS file watch path changed to `web/**/*.js`

## [0.5.4] - 2018-03-20
### Fixed
- Use random free port for App and Admin if not defined

## [0.5.3] - 2018-03-19
### Fixed
- Remove `webpack.config.js` requirement on base project
- Vue file watch path changed to `web/**/*.vue`
- JS file build supports folders
- Catch static build error to prevent possible errors

### Changed
- Remove `webpack.config.js` from `boxes init`

## [0.5.2] - 2018-03-14
### Fixed
- Remove unnecessary `index.js` from `boxes init`
- Server start to use `index.js` from package

## [0.5.1] - 2018-03-08
### Fixed
- Static path to serve from web folder directly

## [0.5.0] - 2018-03-08
### Added
- Static assets support @ `web/static/**/*` to `public/static`

## [0.4.0] - 2018-03-04
### Added
- JSON data support @ `data/**/*.json`
- Custom template support in data file with `.template` key basing from `web/template`

## [0.3.0] - 2018-03-01
### Added
- Global data with `data/global.js`
- YML data support @ `data/**/*.yml`

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
