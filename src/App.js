import React from 'react';
import './app.css';
import Router from './Router';
import Snackbar from './containers/Snackbar';

const App = () => {
    return (
        <div className="of_community">
            <Router/>
            <Snackbar/>
        </div>
    );
};

export default App;
