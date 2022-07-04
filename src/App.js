import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ROUTES from './routes';
import { ToastContainer } from 'react-toastify';

import './assets/css/app.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        { ROUTES.map( (route, i) => <Route key={i} {...route} element={<route.component/>}/>) }
      </Routes>
      <ToastContainer/>
    </>
  );
}

export default App;
