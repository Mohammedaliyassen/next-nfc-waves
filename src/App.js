import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductsShow from './comp/Card.js';
import EditPage from './comp/EditPage.js';
import HomePage from './comp/HomePage.js';
import Login from './comp/Login.js';
import ProtectedRoute from './comp/ProtectedRoute.js';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios' need network
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/:id" element={<ProductsShow />}></Route>
          {/* <Route path="/edit/:id" element={<EditPage />}></Route> */}

          <Route path="/login" element={<Login />} />

          <Route
            path="/edit"
            element={
              <ProtectedRoute>
                <EditPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<ProductsShow />}></Route>
        </Routes>
      </Router>

    </div>
  );
}

export default App;
