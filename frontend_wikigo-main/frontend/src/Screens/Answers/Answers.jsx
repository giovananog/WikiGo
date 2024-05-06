import React, { useState } from "react";
import DarkMode from "../../components/DarkMode/DarkMode";
import { useLocation } from "react-router-dom";

function Answers() {
  const location = useLocation();
  const { results } = location.state;
  const [visibleCount, setVisibleCount] = useState(4); // Inicialmente mostramos 4 itens

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 4); // Carregar mais 4 itens a cada clique
  };

  return (
    <div className="Geral">
      <div className="DarkModeButton">
        <DarkMode />
      </div>
      <h1>Search Results</h1>
      {results.length > 0 ? (
        <ul>
          {results.slice(0, visibleCount).map((result, index) => (
            <li key={index}>
              <h2>{result.title}</h2>
              <a href={result.url} target="_blank" rel="noopener noreferrer">Read more</a>
              <p>{result.abs}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
      {visibleCount < results.length && (
        <button onClick={loadMore}>Load More Results</button>
      )}
    </div>
  );
}

export default Answers;
