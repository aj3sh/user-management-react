import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ROUTES from './routes';

function App() {
  return (
    <Routes>
      { ROUTES.map( (route, i) => <Route key={i} {...route} element={<route.component/>}/>) }
    </Routes>
  );
}

export default App;
