# boxescms

ExpressJS based API centric CMS.

# Underlying tools

1. [Express](https://expressjs.com/)
2. [Sass](http://sass-lang.com/)
3. [Pug](https://pugjs.org)
4. [Webpack](https://webpack.js.org/)
5. [Babel](https://babeljs.io/)
6. [Bootstrap](https://getbootstrap.com/)
7. [Vue.js](https://vuejs.org/)

# Folder/File Structure

## /.env

Env variables. Copy from .env.example.

## /app.js (optional)

Optional `app.js` to extend the Express app instantiated from BoxesCMS. Must export a function that receives the app as first argument.

## /data/**/*.js

Data layer for static HTML generation from `/web/pug/**/*.pug`. `**/*` portion must match between `/data` and `/web/pug`. Data must be exported using `module.exports = {}`

## /server/

Server and node related files.

### /server/api/

Only API routes. All routes are prepended with `/api`, appended with folder/file relative path. Routes should be declared using `require('express').Router()`.

### /server/routes/

Additional custom routes.

## /web/

Web related files (html, pug, sass, scss, js, images, fonts).

## /public/

Web files will be compiled here, and served as root static by Node server.

## /storage/

Contents should be ignored. Storage folder for various runtime data usage.

## /conf/

External configuration files.
