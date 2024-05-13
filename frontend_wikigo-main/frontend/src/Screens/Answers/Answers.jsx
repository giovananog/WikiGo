import React, { useState } from "react";
import axios from "axios";
import DarkMode from "../../components/DarkMode/DarkMode";
import { useLocation, useNavigate } from "react-router-dom";
import wikiLogo from "../../assets/LOGO_NOVO.png";
import "./Answers.css";

function Answers() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state ? location.state.results : [];
  const initialSearchQuery = location.state ? location.state.searchQuery : "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [visibleCount, setVisibleCount] = useState(7);

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

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const results = await fetchResults(searchQuery);
    navigate('/answers', { state: { results, searchQuery } });
  };

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };

  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="Geral">
      <div className="Header">
        <img src={wikiLogo} className="logo_answer" alt="WikiGO" onClick={goToHomePage} />
        <div className="formSearch_ans">
          <form className="formSubmit" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="searchButton_ans">Search</button>
          </form>
        </div>
        <div className="DarkModeButton_ans">
          <DarkMode />
        </div>
      </div>
      <div className="resultados">
      {
        results.length > 0 ? (
          <ul>
            {results.slice(0, visibleCount).map((result, index) => (
              <li key={index}>
                <p><a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a></p>
                <h2><a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a></h2>
                <h4>{result.abs}</h4>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum resultado encontrado.</p>
        )
      }
      {
        visibleCount < results.length && (
          <button onClick={loadMore}>Mais Resultados</button>
        )
      }
      </div>
    </div>
  );
}

export default Answers;
