import { useState } from "react";
import wikiLogo from "/LOGO_NOVO.png";
import "./App.css";
import WeatherWidget from "./components/weather";
import Com_Sorte from "./components/sorte";
import axios from "axios";



const fetchResults = async (searchQuery) => {
  try {
    const url = `http://localhost:8080/v1/api/search?query=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
};







function App() {
  const [inputValueLocation, setInputValueLocation] = useState("Alfenas");
  const [location, setLocation] = useState("Alfenas");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);



  const hadleSubmitLocation = (e) => {
    e.preventDefault();
    setLocation(inputValueLocation);
  }


  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const results = await fetchResults(searchQuery);
    setSearchResults(results);
    console.log(results); 
  };
  
  

  return (
    <div className="App">
      <div>
        <img src={wikiLogo} className="logo" alt="WikiGO" />
      </div>
      <h1>WIKI GO</h1>

      <div className="form">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="widget">
        <WeatherWidget location={location} />
        <form onSubmit={hadleSubmitLocation}>
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

export default App;
