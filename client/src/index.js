import React from 'react';
import ReactDOM from 'react-dom';


import App from './App';
import './styles.css'; 

//to get our context inside of components
import { ContextProvider } from './SocketContext.js';


ReactDOM.render(
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
