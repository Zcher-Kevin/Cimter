import React, {useState, useEffect, useRef} from "react";
import "../Css/Stopwatch.css";

/**
 * Stopwatch component that provides a countdown timer functionality.
 * 
 * @component
 * @example
 * return (
 *   <Stopwatch />
 * )
 * 
 * @returns {JSX.Element} The rendered Stopwatch component.
 * 
 * @function
 * @name Stopwatch
 * 
 * @description
 * This component allows users to input a custom time in HHMMSS format, start, stop, and reset the countdown timer.
 * 
 * @property {number} time - The current time in seconds.
 * @property {boolean} isRunning - Indicates whether the timer is running.
 * @property {string} Input - The user input for setting custom time.
 * @property {Object} timerRef - A reference to the timer interval.
 * 
 * @method
 * @name startTimer
 * @description Starts the countdown timer if it is not already running and the time is greater than 0.
 * 
 * @method
 * @name stopTimer
 * @description Stops the countdown timer if it is running.
 * 
 * @method
 * @name resetTimer
 * @description Resets the countdown timer to 0 and clears the user input.
 * 
 * @method
 * @name parseTimeStringToSeconds
 * @description Converts a time string in HHMMSS format to seconds.
 * @param {string} timeString - The time string in HHMMSS format.
 * @returns {number} The time in seconds.
 * 
 * @method
 * @name HandleInputChange
 * @description Handles changes to the user input, allowing only numeric characters.
 * @param {Object} e - The event object from the input change.
 * 
 * @method
 * @name setCustomTime
 * @description Sets the custom time based on user input if it is valid.
 * 
 * @method
 * @name formatTime
 * @description Formats the time in seconds to HHMMSS format.
 * @param {number} seconds - The time in seconds.
 * @returns {JSX.Element} The formatted time as a JSX element.
 */
function Stopwatch() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [Input, setInput] = useState("");
    const timerRef = useRef(null);
  
    const startTimer = () => {
      if (!isRunning && time > 0) {
          setIsRunning(true);
          timerRef.current = setInterval(() => {
              setTime((prevTime) => {
                  if (prevTime <= 1) {
                      clearInterval(timerRef.current);
                      setIsRunning(false);
                      return 0;
                  }
                  return prevTime - 1;
              });
          }, 1000);
      }
    };
  
    const stopTimer = () => {
        if (isRunning) {
            setIsRunning(false);
            clearInterval(timerRef.current);
        }
    };
  
    const resetTimer = () => {
        setIsRunning(false);
        clearInterval(timerRef.current);
        setTime(0);
        setInput("");
    };
  
    const parseTimeStringToSeconds = (timeString) => {
      const paddedTime = timeString.padStart(6, "0"); // Ensure it's always 6 characters (HHMMSS)
      const hours = parseInt(paddedTime.slice(0, 2), 10) || 0;
      const minutes = parseInt(paddedTime.slice(2, 4), 10) || 0;
      const seconds = parseInt(paddedTime.slice(4, 6), 10) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    };
  
    const HandleInputChange = (e) => {
      const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
      setInput(value);
    };
  
    const setCustomTime = () => {
      if (Input.length > 0) {
        const seconds = parseTimeStringToSeconds(Input);
        if (seconds > 0) {
          setTime(seconds);
          setInput("");
        } else {
          alert("Please enter a valid time greater than 00:00:00.");
        }
      } else {
        alert("Please enter a valid time.");
      }
    };
  
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60)
      .toString()
      .padStart(2, "0");
    return (
      <>
        {hours}<text className='word'>h</text>{mins}<text className='word'>m</text>{secs}<text className='word'>s</text>
      </>
    );
    };
  
    return (
      <div className='timer-container'>
              <h1 className="CountUpDownTimeDisplay">{formatTime(time)}</h1>
              <div className="InputList">
                  <input
                      type="text"
                      maxLength="6"
                      placeholder="Enter HHMMSS"
                      value={Input}
                      onChange={HandleInputChange}
                      className="InputTime"
                  />
                  <button onClick={setCustomTime} className="ButtonSetTime">
                      Set Time
                  </button>
              </div>
  
              <div className="ButtonList">
                  <button onClick={startTimer} className="ButtonStart">
                      Start
                  </button>
                  <button onClick={stopTimer} className="ButtonStop">
                      Stop
                  </button>
                  <button onClick={resetTimer} className="ButtonReset">
                      Reset
                  </button>
              </div>
          </div>
    )
}
export default Stopwatch
  