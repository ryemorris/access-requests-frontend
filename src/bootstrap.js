import React from 'react';
import ReactDOM from 'react-dom';
import AppEntry from './AppEntry';

const root = document.getElementById('root');
root.setAttribute('data-ouia-safe', true);

ReactDOM.createRoot(root).render(<AppEntry />);
