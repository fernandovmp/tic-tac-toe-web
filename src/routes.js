import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';

export default function Routes() {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Home}/>
            <Route path="/login" component={Login}/>
        </BrowserRouter>
    );
}