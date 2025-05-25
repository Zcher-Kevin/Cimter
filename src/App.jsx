import React, {useState, useEffect, useRef} from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
// Importing pages and components
import Home from './pages/Home';
import Clock from './pages/Clock';
import Stopwatch from './pages/Stopwatch';
import Timer from './pages/Timer';
import Button from './components/Button';
import { TimerProvider } from './context/TimerContext';
import { TimerCountProvider } from './context/TimerCountContext';

function App() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const moveTimeout = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            
            // Set moving state to true when mouse moves
            setIsMoving(true);
            
            // Clear existing timeout
            if (moveTimeout.current) {
                clearTimeout(moveTimeout.current);
            }
            
            // Set a timeout to set moving to false after mouse stops
            moveTimeout.current = setTimeout(() => {
                setIsMoving(false);
            }, 100);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (moveTimeout.current) {
                clearTimeout(moveTimeout.current);
            }
        };
    }, []);

    return (
        <Router>
            <TimerProvider>
                <TimerCountProvider>
                    <div className="App"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}>
                        
                        {/* Fixed grid pattern */}
                        <div className="fixed-grid-background"></div>
                        
                        {/* Spotlight that follows the mouse */}
                        <motion.div 
                            className="grid-spotlight"
                            animate={{
                                x: mousePosition.x - 125,
                                y: mousePosition.y - 125,
                                opacity: isMoving ? 1 : 0.8,
                                scale: isMoving ? 1.1 : 1,
                            }}
                            transition={{
                                type: "spring",
                                damping: 15,
                                stiffness: 300,
                                mass: 0.6,
                                opacity: { duration: 0.3 }
                            }}
                        />
                        
                        <div className="Menu">
                            <Button to="/">Home</Button>
                            <Button to="/clock">Clock</Button>
                            <Button to="/stopwatch">Stopwatch</Button>
                            <Button to="/timer">Timer</Button>
                        </div>
                        
                        <div className="Page">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/stopwatch" element={<Stopwatch />} />
                                <Route path="/timer" element={<Timer />} />
                                <Route path="/clock" element={<Clock />} />
                            </Routes>
                        </div>
                        
                        <div className="Menu">
                            <Button to="/">Home</Button>
                            <Button to="/clock">Clock</Button>
                            <Button to="/stopwatch">Stopwatch</Button>
                            <Button to="/timer">Timer</Button>
                        </div>
                    </div>
                </TimerCountProvider>
            </TimerProvider>
        </Router>
    )
}

export default App;