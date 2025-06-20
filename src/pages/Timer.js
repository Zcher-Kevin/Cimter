import React from "react";
import { useTimerCount } from '../context/TimerCountContext';
import "../Css/Timer.css";

/**
 * Timer component that displays a timer with start, stop, and reset functionalities.
 *
 * @component
 * @example
 * return (
 *   <Timer />
 * )
 *
 * @returns {JSX.Element} The Timer component.
 *
 * @function
 * @name Timer
 *
 * @description
 * This component uses React hooks to manage the timer state and interval.
 * It displays the elapsed time in hours, minutes, and seconds format.
 * The timer can be started, stopped, and reset using the provided buttons.
 *
 * @hook
 * @name useState
 * @description Manages the state of the timer (time and isRunning).
 *
 * @hook
 * @name useEffect
 * @description Sets up and cleans up the interval for the timer based on the isRunning state.
 *
 * @param {number} time - The current time in seconds.
 * @param {function} setTime - Function to update the time state.
 * @param {boolean} isRunning - Indicates whether the timer is running.
 * @param {function} setIsRunning - Function to update the isRunning state.
 *
 * @function
 * @name formatofTime
 * @description Formats the given time in seconds to a string with hours, minutes, and seconds.
 * @param {number} seconds - The time in seconds to format.
 * @returns {JSX.Element} The formatted time as a JSX element.
 *
 * @function
 * @name handleStartStop
 * @description Toggles the isRunning state to start or stop the timer.
 *
 * @function
 * @name handleReset
 * @description Resets the timer to 0 and stops it.
 */
function Timer() {
    const { timers, startTimer, stopTimer, resetTimer, removeTimer, addTimer } = useTimerCount();

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const second = (seconds % 60).toString().padStart(2, "0");
        return (
            <>
                {hours}<text className='word'>h</text>
                {minutes}<text className='word'>m</text>
                {second}<text className='word'>s</text>
            </>
        );
    };

    return (
      <div className="timer-container">
        <div className="timers-list">
            {timers.map(timer => (
                <div key={timer.id} className="timer-item">
                    <div className="TimeDisplay">
                        {formatTime(timer.time)}
                    </div>
                    <div className="timer-controls">
                        <button 
                            onClick={() => timer.isRunning ? stopTimer(timer.id) : startTimer(timer.id)}
                            className={timer.isRunning ? "ButtonStop" : "ButtonStart"}
                        >
                            {timer.isRunning ? 'Stop' : 'Start'}
                        </button>
                        <button
                            onClick={() => resetTimer(timer.id)}
                            className="Reset"
                        >
                            Reset
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
        <div className= "add-timer-container">
            <button onClick={addTimer} className="AddTimerButton">
                +
            </button>
        </div>
    </div>
  );
}

export default Timer;
