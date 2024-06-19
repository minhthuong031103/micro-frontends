import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'react-medium-image-zoom/dist/styles.css';

import { Toaster } from 'react-hot-toast';
import { AuthContext, AuthProvider } from './AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <>
        <Toaster />

        <App />
      </>
    </AuthProvider>
  </React.StrictMode>
);
