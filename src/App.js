import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Clock from './pages/Clock';
import Stopwatch from './pages/Stopwatch';
import Timer from './pages/Timer';
import Button from './components/Button';

function App() {
  return (
    <Router>
        <div className="App">
            <div className = "Menu">
                <Button to="/">Home</Button>
                <Button to="/clock">Clock</Button>
                <Button to="/stopwatch">Stopwatch</Button>
                <Button to="/timer">Timer</Button>
            </div>
            <div className = "Page">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/stopwatch" element={<Stopwatch />} />
                    <Route path="/timer" element={<Timer />} />
                    <Route path="/clock" element={<Clock />} />
                </Routes>
            </div>
        </div>
    </Router>
  )
}

export default App;
