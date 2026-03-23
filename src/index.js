import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import { HelmetProvider } from "react-helmet-async";
const container = document.getElementById('App'); // تأكد من أن الـ id هنا هو 'root'
const root = createRoot(container);

root.render(
    <HelmetProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </HelmetProvider>
);
