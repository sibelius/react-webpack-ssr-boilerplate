import { hydrate } from 'react-dom';

import App from './App';

const rootEl = document.getElementById('root');

hydrate(<App />, rootEl);
