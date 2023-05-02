//import { Component, useState, createContext } from 'react';
import { ApeHome } from './APE/ApeHome.js'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import './css/style.css';
import LoginPage from './login/index.js';
import RegisterPage from './login/register.js';
import { ProvideAuth, AuthRequired } from './services/AuthService';

export default function App() {
  //const [user, setUser] = useAuth();

  return (
    <ProvideAuth>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<AuthRequired />}>
            <Route path="/" element={ <ApeHome />} />
          </Route>
        </Routes>
      </Router>
    </ProvideAuth>
  );
}
