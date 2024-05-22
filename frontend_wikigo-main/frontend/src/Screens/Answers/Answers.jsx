import React, { useState } from "react";
import axios from "axios";
import DarkMode from "../../components/DarkMode/DarkMode";
import { useLocation, useNavigate } from "react-router-dom";
import wikiLogo from "../../assets/LOGO_NOVO.png";
import "./Answers.css";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function Answers() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state ? location.state.results : [];
  const initialSearchQuery = location.state ? location.state.searchQuery : "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [visibleCount, setVisibleCount] = useState(7);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const fetchResults = async (searchQuery) => {
    try {
      let url = `http://localhost:8080/v1/search?query=${encodeURIComponent(searchQuery)}`;
      if (filterType === "before") {
        url += `&filter=dt_creation&filter=lt&filter=${date}`;
      } else if (filterType === "after") {
        url += `&filter=dt_creation&filter=gte&filter=${date}`;
      } else if (filterType === "between") {
        url += `&filter=dt_creation&filter=between&filter=${startDate},${endDate}`;
      }
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
    handleModalClose();
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
            <div className="input-container_ans">
              <input
                type="text"
                name="search"
                value={searchQuery}
                autoComplete="off"
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <button type="submit" className="searchButton_ans">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" className="icon">
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
        <div className="DarkModeButton_ans">
          <DarkMode />
        </div>
      </div>
      <div className="date">
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--font-color)"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" /></svg>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => { setFilterType("before"); handleModalOpen(); handleClose(); }}>Antes de</MenuItem>
            <MenuItem onClick={() => { setFilterType("after"); handleModalOpen(); handleClose(); }}>Depois de</MenuItem>
            <MenuItem onClick={() => { setFilterType("between"); handleModalOpen(); handleClose(); }}>Entre</MenuItem>
          </Menu>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Selecionar Data
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {filterType === "before" || filterType === "after" ? (
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Selecione a data"
              />
            ) : filterType === "between" ? (
              <div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Data inicial"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Data final"
                />
              </div>
            ) : null}
            <Button onClick={handleSearchSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
              Aplicar Filtro
            </Button>
          </Typography>
        </Box>
      </Modal>
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
            <div className="mais_resultados">
              <button onClick={loadMore}>Mais Resultados</button>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Answers;
