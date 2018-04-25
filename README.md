Create static pages using ES6+ (babel), pug and stylus with this webpack boilerplate. It uses some cool features picked from [Vue.js webpack boilerplate](https://github.com/vuejs-templates/webpack). Supports HMR.

# Usage

## Installation

Clone or download this repository, then `npm install` or `yarn`.

## Commands

- `npm start` which will run `npm run dev` for development.
- `npm run dev-ip` for which host local IP is explicitly specified in `package.json`:
```json
    "dev-ip": "webpack-dev-server --mode development --inline --progress --host 192.168.<x>.<y> --config webpack.dev.js",
```
- `npm run build`, build static files in `dist` directory.
- `npm run serve`: a minimalistic express script (`server.js`) serves `dist` on port 3000.
- `npm run report` opens the webpack bundle analyzer report generated in `report` directory by the build process.

## Other features

The content of `src/favicons` and `src/root` will be copied in the root `dist` directory. This allows to use recommandations by the awsome favicon generator [https://realfavicongenerator.net](https://realfavicongenerator.net) and to add for example `sitemap.xml` or `_redirects` in the root of the dist website.

## Example

The files here provide an example on how wepback can handles assets.

### Todo

- Easy creation of multipage static website
- In depth documentation
- Testing