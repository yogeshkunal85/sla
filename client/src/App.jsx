import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="app-nav">
          <div className="nav-brand">
            <Link to="/">Ticket SLA System</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/tickets">Tickets</Link>
          </div>
        </nav>

      </div>
    </BrowserRouter>
  );
}

export default App;