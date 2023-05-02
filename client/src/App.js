//import { Component, useState, createContext } from 'react';
import ApeHome from './APE/ApeHome.js'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import './css/style.css';
import LoginPage from './login/index.js';
import FacultyPage from './APE/faculty.js';
import RegisterPage from './login/register.js';
import { ProvideAuth, AuthRequiredStudent, AuthRequiredFaculty } from './services/AuthService';

export default function App() {
  //const [user, setUser] = useAuth();

  return (
    <ProvideAuth>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/student/:name" element={<AuthRequiredStudent />}>
            <Route path="/student/:name" element={ <ApeHome />} />
          </Route>
          <Route path="/faculty/:name" element={<AuthRequiredFaculty/>}>
            <Route path="/faculty/:name" element={<FacultyPage/>}/>
          </Route>
        </Routes>
      </Router>
    </ProvideAuth>
  );
}
