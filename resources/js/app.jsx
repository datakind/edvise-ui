import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactGA from 'react-ga4';
import posthog from 'posthog-js';

const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: name =>
    resolvePageComponent(
      `./Pages/${name}.jsx`,
      import.meta.glob('./Pages/**/*.jsx'),
    ),
  setup({ el, App, props }) {
    (ReactGA.default ?? ReactGA).initialize('G-5K6031PFQT');
    posthog.init('phc_BRwLRRRpfCqRiGvOvwNYyX1dDvhy3OPuucMl7eXW0AM', {
      api_host: 'https://us.i.posthog.com',
      defaults: '2026-05-30',
    });

    const root = createRoot(el);

    root.render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
}).catch(error => {
  console.error('Error initializing Inertia app:', error);
});
