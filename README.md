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

Optional `app.js` to extend the Express app instantiated from BoxesCMS. Must export a function that receives the app as first argument.

### /data/**/*.{js,json,yml}

Data layer for static HTML generation from `/web/pug/**/*.pug`. `**/*` must match between the relative path of `/data` and `/web/pug`. See [Template Data](#template-data) section for more details.

### /server/

Server and node related files.

#### /server/api/

Only API routes. All routes are prepended with `/api`, appended with folder/file relative path. Routes should be declared using `require('express').Router()`.

#### /server/routes/

Additional custom routes.

### /web/

Web related files (html, pug, sass, scss, js, images, statics).

### /public/

Web files will be compiled here, and served as root static by Node server.

### /storage/

Contents should be ignored. Storage folder for various runtime data usage.

### /conf/

External configuration files.
