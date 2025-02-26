import React, {useState, useEffect} from "react";
import moment from 'moment-timezone';
import "../Css/Clock.css";

function Clock() {
    const [selectedTimezones, setSelectedTimezones] = useState(() => {
        const saved = localStorage.getItem('timezones');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentTime, setCurrentTime] = useState({});

    useEffect(() => {
    const timer = setInterval(() => {
        const times = {};
        selectedTimezones.forEach(zone => {
        times[zone] = moment().tz(zone).format('MMMM Do YYYY, h:mm:ss a');
        });
        setCurrentTime(times);
    }, 1000);

    return () => clearInterval(timer);
    }, [selectedTimezones]);

    useEffect(() => {
    localStorage.setItem('timezones', JSON.stringify(selectedTimezones));
    }, [selectedTimezones]);

    

    const addTimezone = (event) => {
    const zone = event.target.value;
    if (zone && !selectedTimezones.includes(zone)) {
        setSelectedTimezones([...selectedTimezones, zone]);
    }
    };

    const removeTimezone = (zone) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz !== zone));
    };

    return (
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <select 
                className="form-select mb-3"
                onChange={addTimezone}
                defaultValue=""
              >
                <option value="">Select a timezone...</option>
                {moment.tz.names().map(zone => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
    );
};
    
export default Clock;