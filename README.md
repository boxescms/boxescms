# boxescms

ExpressJS based API centric static site CMS.

## Underlying tools

* [Express](https://expressjs.com/)
* [Sass](http://sass-lang.com/)
* [Pug](https://pugjs.org)
* [Webpack](https://webpack.js.org/)
* [Babel](https://babeljs.io/)
* [Vue.js](https://vuejs.org/)

## Kickstart Development

1. `npm init` (If you haven't already)

2. `npm install boxescms`

3. `npx boxes init`

4. `npm start dev`

## Folder/File Structure

### /.env

Env variables. Copy from .env.example.

### /app.js (optional)

Optional `app.js` to extend the Express app instantiated from BoxesCMS. Must export a function or `preinit`/`postinit` functions that receives the app as first argument.

### /data/**/*.{js,json,yml}

Data layer as Pug locals for static HTML generation. For `js` type, it must export an object. See [Template Data](#template-data) section for more details.

### /server/

Server and node related files.

#### /server/api/

Only API routes. All routes are prepended with `/api`, appended with folder/file relative path. Routes should be declared using `require('express').Router()`.

#### /server/routes/

Additional custom routes.

### /web/

Web related files (html, pug, sass, scss, js, images, statics).

#### /web/pug

Pug files that will be compiled `/public/**/*.html`.

#### /web/{sass,scss}

SASS/SCSS files that will be compiled to `/public/css/**/*.css`.

#### /web/js

JS files that will be compiled to `/public/js/**/*.js`.

#### /web/images

Images that will be copied to `/public/images`.

#### /web/static

Statics that will be copied to `/public/static`.

#### /web/template

Pug template files for data use. See [Template Data](#template-data) section for more details.

### /public/

Web files will be compiled here, and served as root static by Node server.

### /storage/

Contents should be ignored. Storage folder for various runtime data usage.

### /conf/

External configuration files.

### /webpack.merge.js

Optional Webpack configuration. This configuration will be merged into the default configuration.

## Builders

### JS

There is 2 special env var that you can use in your JS files:

- process.env.VERSION
- process.env.BUILD_HASH

`process.env.VERSION` is taken from your project's `package.json`.version.

`process.env.BUILD_HASH` is a randomly generated per build 64 length hex char.

## Template Data

The data files in `/data/**/*.{js,json,yml}` is used in 2 ways:

1. When compiling `/web/pug/[**/*].pug` file, if there is a matching `/web/data/[**/*].{js,json,yml}` file, it will use the data file as the locals for Pug compilation. The pug files will be compiled to `/public/[**/*].html`.

  - /web/pug/page.pug

  ```
  head
    title=pagetitle
  ```

  - /data/page.yml

  ```
  pagetitle: Hello World
  ```

  - /public/page.html

  ```
  <head><title>Hello World</title></head>
  ```

2. If a data file in `/data/**/*.{js,json,yml}` has a key `.template`, the `.template` value will use `/web/template` as root to search for the pug file to compile, e.g.: `/web/template/['.template'].pug}`. The output file for `/data/[**/*].{js,json,yml}` is `/public/[**/*].html`

  - /data/page.json

  ```
  {
    ".template": "base.pug",
    "pagetitle": "Hello World"
  }
  ```

  - /web/template/base.pug

  ```
  head
    title=pagetitle
  ```

  - /public/page.html

  ```
  <head><title>Hello World</title></head>
  ```

## Server Debug Mode

The node inspector can be enabled by passing `--inspect [port=9229]` to `boxes start` command. You can either use `chrome://inspect` on Chrome browser to use the default `.vscode/launch.json` from init to attach debugger.
