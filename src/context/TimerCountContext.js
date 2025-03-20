import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const TimerCountContext = createContext();

export function TimerCountProvider({ children }) {
    const [timers, setTimers] = useState(() => {
        const saved = localStorage.getItem('timerCounts');
        return saved ? JSON.parse(saved) : [];
    });
    
    const intervalRefs = useRef({});

    // Save timers to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('timerCounts', JSON.stringify(timers));
    }, [timers]);

    // Cleanup intervals when component unmounts
    useEffect(() => {
        return () => {
            Object.values(intervalRefs.current).forEach(interval => clearInterval(interval));
        };
    }, []);

    const startTimer = (id) => {
        if (!intervalRefs.current[id]) {
            // Set isRunning to true immediately
            setTimers(prevTimers => 
                prevTimers.map(t => 
                    t.id === id ? { ...t, isRunning: true } : t
                )
            );

            // Start the interval
            intervalRefs.current[id] = setInterval(() => {
                setTimers(prevTimers => {
                    const updatedTimers = prevTimers.map(t => {
                        if (t.id === id) {
                            return { ...t, time: t.time + 1 };
                        }
                        return t;
                    });
                    return updatedTimers;
                });
            }, 1000);
        }
    };

    const stopTimer = (id) => {
        if (intervalRefs.current[id]) {
            clearInterval(intervalRefs.current[id]);
            delete intervalRefs.current[id];
            
            setTimers(prevTimers =>
                prevTimers.map(t =>
                    t.id === id ? { ...t, isRunning: false } : t
                )
            );
        }
    };

    const resetTimer = (id) => {
        stopTimer(id);
        setTimers(prevTimers =>
            prevTimers.map(t =>
                t.id === id ? { ...t, time: 0, isRunning: false } : t
            )
        );
    };

    const addTimer = () => {
        const newTimer = {
            id: Date.now(),
            time: 0,
            isRunning: false
        };
        setTimers(prevTimers => [...prevTimers, newTimer]);
    };

    const removeTimer = (id) => {
        stopTimer(id);
        setTimers(prevTimers => prevTimers.filter(t => t.id !== id));
    };

    return (
        <TimerCountContext.Provider value={{
            timers,
            startTimer,
            stopTimer,
            resetTimer,
            removeTimer,
            addTimer
        }}>
            {children}
        </TimerCountContext.Provider>
    );
}

export function useTimerCount() {
    return useContext(TimerCountContext);
}