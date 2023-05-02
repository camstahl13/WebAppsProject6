//import { Component, useState, createContext } from 'react';
import { ApeHome } from './APE/ApeHome.js'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import './css/style.css';
import LoginPage from './login/index.js';
import { ProvideAuth, PrivateRoute } from './services/AuthService';

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={ <ApeHome />} />
          </Route>
        </Routes>
      </Router>
    </ProvideAuth>
  );
}

export default App;
