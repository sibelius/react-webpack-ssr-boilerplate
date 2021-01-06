import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from '@koa/router';
import logger from 'koa-logger';
import { renderToString } from 'react-dom/server';
import path from 'path';

import App from '../App';
import { ReactElement } from 'react';

const port = process.env.PORT || 4000;

// TODO - improve this
const assets = {
  client: {
    css: null,
    // improve this
    js: `http://localhost:${port}/main.js`,
  },
}

const renderApp = (tree: ReactElement): string => {
  return renderToString(tree);
};

const indexHtml = ({ assets, html }) => {
  return `
    <!doctype html>
      <html lang="">
      <head>
          <meta charset="utf-8" />
          <title>React Webpack SSR Boilerplate</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
          ${
            process.env.NODE_ENV === 'production'
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`
          }
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `;
};

// Initialize `koa-router` and setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
const router = new Router();

router.get('/(.*)', async ctx => {
  // eslint-disable-next-line
  console.log('* ', ctx.url, ctx.request.hostname);

  const html = renderApp(
    <App />
  );

  const fullHtml = indexHtml({
    assets,
    html,
  });

  // eslint-disable-next-line
  console.log({
    html,
    fullHtml,
  });

  // eslint-disable-next-line
  ctx.status = 200;
  // eslint-disable-next-line
  ctx.body = fullHtml;
});

const publicDir = path.join(__dirname, '../public');
const buildDir = path.join(__dirname, '../build');

// Intialize and configure Koa application
const app = new Koa();
app
  .use(logger())
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  .use(helmet())
  .use(serve(publicDir, {
    index: false, // index.html does not make sense on server side renderizing
  }))
  .use(serve(buildDir, {
    index: false,
  }))
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', err => {
  // eslint-disable-next-line no-console
  console.error('Error while answering request', err);
});

export default app;
