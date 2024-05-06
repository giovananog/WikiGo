import React from "react";
import DarkMode from "../../components/DarkMode/DarkMode";
import { useLocation } from "react-router-dom";

function Answers() {
  const location = useLocation();
  const { results } = location.state;
  return (
    <div className="Geral">
      <div className="DarkModeButton">
        <DarkMode />
      </div>
      <div>
      <h1>Search Results</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((result, index) => (
            <li key={index}>{result.title}</li> // Ajuste este código conforme a estrutura do seu JSON
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
    </div>
  );
}

export default Answers;
