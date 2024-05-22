import React, { useState } from "react";
import axios from "axios";
import WeatherWidget from "../../components/weather";
import DarkMode from "../../components/DarkMode/DarkMode";
import { useNavigate } from "react-router-dom";
import wikiLogo from "/LOGO_NOVO.png";
import searchIcon from "../../assets/svgs/search.svg";
import changeIcon from "../../assets/svgs/world.svg";
import "./Inicial.css";

function Inicial() {
  const [inputValueLocation, setInputValueLocation] = useState("Alfenas");
  const [location, setLocation] = useState("Alfenas");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const fetchResults = async (searchQuery) => {
    try {
      const url = `http://localhost:8080/v1/search?query=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching search results:", error);
      return [];
    }
  };

  const handleSubmitLocation = (e) => {
    e.preventDefault();
    setLocation(inputValueLocation);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const results = await fetchResults(searchQuery);
    navigate('/answers', { state: { results, searchQuery } });
  };

  return (
    <div className="App">
      <div className="DarkModeButton">
        <DarkMode />
      </div>
      <div className="Central">
        <img src={wikiLogo} className="logo" alt="WikiGO" />
        <h1>WIKI GO</h1>
        <div className="formSearch">
          <form onSubmit={handleSearchSubmit}>
            <div className="input-container">
              <input
                type="text"
                name="search"
                value={searchQuery}
                autoComplete="off"
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <button className="searchButton" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="icon">
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>

              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="widget">
        <WeatherWidget location={location} />
        <form className="formWidget" onSubmit={handleSubmitLocation}>
          <div className="input-container">
            <input
              type="text"
              value={inputValueLocation}
              autoComplete="off"
              onChange={(e) => setInputValueLocation(e.target.value)}
              required
            />
            <button className="locationButton" type="submit"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="icon"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" /></svg></button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Inicial;
