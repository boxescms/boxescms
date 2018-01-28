# boxescms
ExpressJS based API centric CMS.

# Underlying tools

1. [Express](https://expressjs.com/)
2. [Knex.js](http://knexjs.org/)
3. [Gulp](https://gulpjs.com/)
4. [Sass](http://sass-lang.com/)
5. [Pug](https://pugjs.org)
6. [Webpack](https://webpack.js.org/)
7. [Babel](https://babeljs.io/)
8. [Bootstrap](https://getbootstrap.com/)
9. [Vue.js](https://vuejs.org/)
10. [Commander.js](https://tj.github.io/commander.js/)
11. [Ava](https://github.com/avajs/ava)

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

Should be ignored. Web files will be compiled here, and served as root static by Node server.

## /cli/

Custom cli scripts.

## /migrations/

Custom migrations. Uses Knex.js.

## /seeds/

Custom seeds. Uses Knex.js.
