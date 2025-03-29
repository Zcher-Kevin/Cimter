import React, { useState } from "react";
import { useTimer } from '../context/TimerContext';
import "../Css/Stopwatch.css";
import "../Css/Common.css";

function Stopwatch() {
    const [input, setInput] = useState("");
    const { timers, startTimer, stopTimer, removeTimer, addTimer } = useTimer();

    const parseTimeStringToSeconds = (timeString) => {
        const paddedTime = timeString.padStart(6, "0");
        const hours = parseInt(paddedTime.slice(0, 2), 10) || 0;
        const minutes = parseInt(paddedTime.slice(2, 4), 10) || 0;
        const seconds = parseInt(paddedTime.slice(4, 6), 10) || 0;
        return hours * 3600 + minutes * 60 + seconds;
    };

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setInput(value);
    };

    const handleAddTimer = () => {
        if (input.length > 0) {
            const seconds = parseTimeStringToSeconds(input);
            if (seconds > 0) {
                addTimer(seconds);
                setInput("");
            } else {
                alert("Please enter a valid time greater than 00:00:00.");
            }
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return (
            <>
                {hours}<text className='word'>h</text>
                {mins}<text className='word'>m</text>
                {secs}<text className='word'>s</text>
            </>
        );
    };

    return (
        <div className='timer-container'>
            <div className="Stopwatch-list">
                {timers.map(timer => (
                    <div key={timer.id} className="Stopwatch-timer">
                        <h3 className="TimeDisplay">
                            {formatTime(timer.time)}
                        </h3>
                        <div className="ButtonList">
                            <button 
                                onClick={() => startTimer(timer.id)} 
                                className="Start"
                                disabled={timer.isRunning}
                            >
                                Start
                            </button>
                            <button 
                                onClick={() => stopTimer(timer.id)} 
                                className="Stop"
                                disabled={!timer.isRunning}
                            >
                                Stop
                            </button>
                            <button 
                                onClick={() => removeTimer(timer.id)} 
                                className="Remove"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="InputList">
                <input
                    type="text"
                    maxLength="6"
                    placeholder="Enter HHMMSS"
                    value={input}
                    onChange={handleInputChange}
                    className="InputTime"
                />
                <button onClick={handleAddTimer} className="ButtonSetTime">
                    Add Timer
                </button>
            </div>
        </div>
    );
}

export default Stopwatch;