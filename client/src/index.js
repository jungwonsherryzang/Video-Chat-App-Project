import React from 'react';
import ReactDOM from 'react-dom';


import App from './App';
import './styles.css'; //global styles


import { ContextProvider } from './SocketContext.js';


ReactDOM.render(
    //wrap app with ContextProvider
    <ContextProvider>
        <App />
    </ContextProvider>,
 document.getElementById('root') 
);
 

 /*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ContextProvider>
        <App />
    </ContextProvider>
);
*/
