import React from 'react';
import ReactDOM from 'react-dom';


import App from './App';
import './styles.css'; //global styles

//To see how can we hook this up to our components
//to get our context inside of components, import ContextProvider in index.js file/src
import { ContextProvider } from './SocketContext.js';


ReactDOM.render(
    //wrap app with ContextProvider
    <ContextProvider>
        <App />
    </ContextProvider>,
 document.getElementById('root') 
 //having document that we set the application to our div root
 //entire react application hook onto this root div
);
 

 /*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ContextProvider>
        <App />
    </ContextProvider>
);
*/