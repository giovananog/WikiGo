import { useState } from "react";
import wikiLogo from "/LOGO_NOVO.png";
import "./App.css";
import WeatherWidget from "./components/weather";
import Com_Sorte from "./components/sorte";
import axios from "axios";


function App() {
  const [inputValueLocation, setInputValueLocation] = useState("Alfenas");
  const [location, setLocation] = useState("Alfenas");



  const hadleSubmitLocation = (e) => {
    e.preventDefault();
    setLocation(inputValueLocation);
  }

  return (
    <div className="App">
      <div>
        <img src={wikiLogo} className="logo" alt="WikiGO" />
      </div>
      <h1>WIKI GO</h1>

      <div className="form">
        <form>
          <div>
            <label>
              <input type="busca" name="busca" />
            </label>
          </div>
        </form>
      </div>

      <div className="widget">
        <WeatherWidget location={location} />
        <form onSubmit={hadleSubmitLocation}>
          <input
            type="text"
            value={inputValueLocation}
            onChange={(e) => {
              setInputValueLocation(e.target.value);
            }}
          />
          <button type="submit">Change Location</button>
        </form>
      </div>
    </div>
  );
}

export default App;
