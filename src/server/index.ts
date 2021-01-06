import http from 'http';

const app = require('./server').default;

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback
let currentHandler = app.callback();
const server = http.createServer(currentHandler);

const port = process.env.PORT || 4000;
server.listen(port, error => {
  if (error) {
    // eslint-disable-next-line
    console.log(error);
  }

  // eslint-disable-next-line
  console.log(`🚀 started ${port}`);
});

if (module.hot) {
  // eslint-disable-next-line
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    // eslint-disable-next-line
    console.log('🔁  HMR Reloading `./server`...');

    try {
      const newHandler = require('./server').default.callback();
      server.removeListener('request', currentHandler);
      server.on('request', newHandler);
      currentHandler = newHandler;
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  });
}
