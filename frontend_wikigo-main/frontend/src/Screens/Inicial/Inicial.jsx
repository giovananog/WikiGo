import React, { useState } from "react";
import axios from "axios";
import WeatherWidget from "../../components/weather";
import DarkMode from "../../components/DarkMode/DarkMode";
import { useNavigate } from "react-router-dom";
import wikiLogo from "/LOGO_NOVO.png";
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

  const hadleSubmitLocation = (e) => {
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
            <input
              type="text"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="searchButton" type="submit">Search</button>
          </form>
        </div>
      </div>
      <div className="widget">
        <WeatherWidget location={location} />
        <form className="formWidget" onSubmit={hadleSubmitLocation}>
          <input
            type="text"
            value={inputValueLocation}
            onChange={(e) => setInputValueLocation(e.target.value)}
          />
          <button type="submit">Change Location</button>
        </form>
      </div>
    </div>
  );
}

export default Inicial;
