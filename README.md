Create static pages using ES6+ (babel), pug and stylus with this *webpack 4* boilerplate. It uses some cool features picked from [Vue.js webpack boilerplate](https://github.com/vuejs-templates/webpack). Supports HMR.

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

## Mulitple pages

This boilerplate handles multi static pages creation: all you have to do is to specify your entries in `webpack.common.js`:
```javascript

/* YOUR DIFFERENT ENTRIES HERE */
const entries = [
  {
    name: 'index'
  },
  {
    name: 'page1',
    entryPoint: './src/entries/page1_entry.js',
    viewPoint: './src/views/page1_view.pug',
    outputPoint: 'page1/index.html'
  }
];
/* */

```
If you provide only a name, say `name`, to your entry, if will automatically look to entry point `./src/entries/name.js` and view `./src/views/name.pug`, and output `name.html`. However, you can specify custom path, as shown in example above.

## Other features

The content of `src/favicons` and `src/root` will be copied in the root `dist` directory. This allows to use recommandations by the awsome favicon generator [https://realfavicongenerator.net](https://realfavicongenerator.net) and to add for example `sitemap.xml` or `_redirects` in the root of the dist website.

## Example

The files here provide an example on how wepback can handles assets, see built `index.html` or `localhost:8080` in dev.

#### Todo

- In depth documentation
- Testing