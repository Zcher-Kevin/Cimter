import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const TimerContext = createContext();

export function TimerProvider({ children }) {
    const [timers, setTimers] = useState(() => {
        const saved = localStorage.getItem('stopwatches');
        // Reset isRunning to false on initial load but preserve times
        return saved ? JSON.parse(saved).map(timer => ({
            ...timer,
            isRunning: false // Ensure all timers start stopped
        })) : [];
    });
    const timerRefs = useRef({});

    // Save timers to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('stopwatches', JSON.stringify(timers));
    }, [timers]);

    // Clean up intervals on unmount
    useEffect(() => {
        return () => {
            Object.values(timerRefs.current).forEach(interval => clearInterval(interval));
        };
    }, []);

    // Handle page close/refresh
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Stop all timers but preserve their current times
            setTimers(prevTimers =>
                prevTimers.map(timer => ({
                    ...timer,
                    isRunning: false
                }))
            );
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const startTimer = (id) => {
        const timer = timers.find(t => t.id === id);
        if (!timer.isRunning && timer.time > 0) {
            setTimers(prevTimers => prevTimers.map(t => 
                t.id === id ? {...t, isRunning: true} : t
            ));
            
            timerRefs.current[id] = setInterval(() => {
                setTimers(prevTimers => {
                    return prevTimers.map(t => {
                        if (t.id === id) {
                            if (t.time <= 1) {
                                clearInterval(timerRefs.current[id]);
                                return {...t, time: 0, isRunning: false};
                            }
                            return {...t, time: t.time - 1};
                        }
                        return t;
                    });
                });
            }, 1000);
        }
    };

    const stopTimer = (id) => {
        clearInterval(timerRefs.current[id]);
        setTimers(timers.map(t => 
            t.id === id ? {...t, isRunning: false} : t
        ));
    };

    const removeTimer = (id) => {
        clearInterval(timerRefs.current[id]);
        setTimers(timers.filter(t => t.id !== id));
    };

    const addTimer = (seconds) => {
        const newTimer = {
            id: Date.now(),
            time: seconds,
            isRunning: false
        };
        setTimers([...timers, newTimer]);
    };

    return (
        <TimerContext.Provider value={{ 
            timers, 
            startTimer, 
            stopTimer, 
            removeTimer, 
            addTimer 
        }}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    return useContext(TimerContext);
}