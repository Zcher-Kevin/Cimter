import React, { useState, useEffect } from "react";
import { mdiPlus, mdiArrowLeft, mdiMagnify, mdiDelete} from "@mdi/js";
import cityTimezones from "city-timezones";
import { ReactSortable } from "react-sortablejs";
import "../Css/Clock.css";
import "../Css/Common.css";

function MyComponent() {
  const [showBelowDiv, setShowBelowDiv] = useState(false);
  const [cityLookup, setCityLookup] = useState([]);
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState([
    { location: "Chicago", tz: "America/Chicago" },
    { location: "New York", tz: "America/New_York" },
  ]);
  const [currentTimes, setCurrentTimes] = useState({});

  // Add this new useEffect for updating times
  useEffect(() => {
    const updateTimes = () => {
      const times = {};
      cities.forEach(city => {
        times[city.tz] = new Date().toLocaleTimeString("en-US", {
          timeZone: city.tz,
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      });
      setCurrentTimes(times);
    };
    // Update immediately and then every second
    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, [cities]);
  // Load saved cities from localStorage
  useEffect(() => {
    const savedList = localStorage.getItem("worldClocks");
    if (savedList) {
      setCities(JSON.parse(savedList));
    } else {
      localStorage.setItem("worldClocks", JSON.stringify(cities));
    }
  }, []);

  // Toggle the visibility of the "below div"
  const toggleBelowDiv = () => {
    setShowBelowDiv(!showBelowDiv);
  };

  // Add a new city to the list
  const addNewCity = (city, timezone) => {
    setCities((prevCities) => [...prevCities, { location: city, tz: timezone }]);
    setShowBelowDiv(false);
    setSearch("");
    writeLocalStorage([...cities, { location: city, tz: timezone }]);
  };

  // Remove a city from the list
  const removeCity = (location) => {
    const updatedCities = cities.filter((city) => city.location !== location);
    setCities(updatedCities);
    writeLocalStorage(updatedCities);
  };

  // Update localStorage when cities change
  const writeLocalStorage = (data) => {
    localStorage.setItem("worldClocks", JSON.stringify(data));
  };

  // Handle search input changes
  useEffect(() => {
    if (search.length < 2) {
      setCityLookup([]);
    } else {
      const lookup = cityTimezones
        .findFromCityStateProvince(search)
        .filter((item) => item.timezone !== null)
        .slice(0, 10);
      setCityLookup(lookup);
    }
  }, [search]);

  return (
    <div className="clock-container">
      <div className="clock-header-fixed">
        <div className="clock-display">
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="clock-content-scrollable">
        <ReactSortable
          list={cities}
          setList={setCities}
          onEnd={() => writeLocalStorage(cities)}
          className="city-list"
        >
          {cities.map((city) => (
            <div key={city.tz} className="city-item">
              <div className="city-card">
                <div className="city-info">
                  <div className="city-name">{city.location}</div>
                  <div className="city-time">{currentTimes[city.tz]}</div>
                  <div className="city-timezone">({city.tz})</div>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => removeCity(city.location)}
                  aria-label={`Delete ${city.location}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    className="icon-small"
                  >
                    <path d={mdiDelete} />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </ReactSortable>
      </div>
      <div className="add-button-wrapper">
        <div className="add-button" onClick={toggleBelowDiv}>
          <svg 
            xmlns="http://www.w3.org/2000</div>/svg" 
            viewBox="0 0 24 24"
            className="icon-small"
          >
            <path d={mdiPlus} />
          </svg>
        </div>
      </div>

      {showBelowDiv && (
        <div className="search-modal">
          <div className="search-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="icon-small back-button"
              onClick={toggleBelowDiv}
            >
              <path d={mdiArrowLeft} />
            </svg>
            <div className="search-input-wrapper">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
                placeholder="Search for a city"
              />
            </div>
          </div>

          {search.length <= 1 && (
            <div className="search-placeholder">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                className="icon-medium"
              >
                <path d={mdiMagnify} />
              </svg>
              Search for a city
            </div>
          )}

          <div className="search-results">
            {cityLookup.map((city, index) => (
              <div
                key={`item-${index}`}
                className="city-result"
                onClick={() => addNewCity(city.city, city.timezone)}
              >
                {city.city}
                <span className="city-time">
                  {new Date().toLocaleTimeString("en-US", {
                    timeZone: city.timezone,
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyComponent;