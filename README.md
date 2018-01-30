# boxescms

ExpressJS based API centric CMS.

# Underlying tools

1. [Express](https://expressjs.com/)
2. [Gulp](https://gulpjs.com/)
3. [Sass](http://sass-lang.com/)
4. [Pug](https://pugjs.org)
5. [Webpack](https://webpack.js.org/)
6. [Babel](https://babeljs.io/)
7. [Bootstrap](https://getbootstrap.com/)
8. [Vue.js](https://vuejs.org/)

# Structure

## /.env

Env variables. Generate basic one with `boxes file .env`.

## /server/

Server and node related files.

### /server/api/

Only API routes. All routes are prepended with `/api`. Routes should be declared using `require('express').Router()`.

### /server/routes/

Additional custom routes.

## /web/

Web related files (html, pug, css, sass, js, images, fonts).

## /public/

Contents should be ignored. Web files will be compiled here, and served as root static by Node server.

## /storage/

Contents should be ignored. Storage folder for various runtime data usage.

## /conf/

External configuration files.
