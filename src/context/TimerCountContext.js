import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const TimerCountContext = createContext();

export function TimerCountProvider({ children }) {
    const [timers, setTimers] = useState(() => {
        const saved = localStorage.getItem('timerCounts');
        if (saved) {
            // Reset all isRunning states to false on initial load
            const parsedTimers = JSON.parse(saved);
            return parsedTimers.map(timer => ({
                ...timer,
                isRunning: false // Ensure all timers start stopped
            }));
        }
        return [];
    });
    
    const intervalRefs = useRef({});

    useEffect(() => {
        localStorage.setItem('timerCounts', JSON.stringify(timers));
    }, [timers]);

    useEffect(() => {
        return () => {
            // Cleanup all intervals on unmount
            Object.values(intervalRefs.current).forEach(interval => clearInterval(interval));
        };
    }, []);

    const startTimer = (id) => {
        if (!intervalRefs.current[id]) {
            setTimers(prevTimers => 
                prevTimers.map(t => 
                    t.id === id ? { ...t, isRunning: true } : t
                )
            );

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
            isRunning: false,
            lastStopped: null // Add tracking for when timer was last stopped
        };
        setTimers(prevTimers => [...prevTimers, newTimer]);
    };

    // New function to preserve timer time but reset running state
    const preserveTimerState = () => {
        setTimers(prevTimers =>
            prevTimers.map(timer => ({
                ...timer,
                isRunning: false,
                lastStopped: Date.now()
            }))
        );
    };

    const removeTimer = (id) => {
        stopTimer(id);
        setTimers(prevTimers => prevTimers.filter(t => t.id !== id));
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            preserveTimerState();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

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