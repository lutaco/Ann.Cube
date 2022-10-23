import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {makeModal, ModalProvider} from "./context";

const rootEl = document.getElementById('root');
const root = ReactDOM.createRoot(rootEl);

const modal = makeModal();
rootEl.parentElement.insertBefore(modal, rootEl.parentElement.firstChild);


const modalSett = {
    root: rootEl, modal
};


root.render(
    <ModalProvider value={modalSett}>
        <App />
    </ModalProvider>
);

reportWebVitals();
