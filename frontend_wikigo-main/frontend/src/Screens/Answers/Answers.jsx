import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import axios from 'axios';
import DarkMode from '../../components/DarkMode/DarkMode';
import { useLocation, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import wikiLogo from '../../assets/LOGO_NOVO.png';
import './Answers.css';

const marks = [
  { value: 0, label: 'Especifica' },
  { value: 1, label: 'Generalizada' },
  { value: 2, label: 'Muito Generalizada' },
];

function valuetext(value) {
  return `${value}`;
}

function Answers() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state ? location.state.results : [];
  const initialSearchQuery = location.state ? location.state.searchQuery : "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [visibleCount, setVisibleCount] = useState(7);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElReadingTime, setAnchorElReadingTime] = useState(null);
  const [anchorElAdvanced, setAnchorElAdvanced] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fuzziness, setFuzziness] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [readingTimeEnd, setReadingTimeEnd] = useState(0);
  const [mustNot, setMustNot] = useState("");
  const open = Boolean(anchorEl);
  const openReadingTime = Boolean(anchorElReadingTime);
  const openAdvanced = Boolean(anchorElAdvanced);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleReadingTimeClick = (event) => {
    setAnchorElReadingTime(event.currentTarget);
  };

  const handleAdvancedClick = (event) => {
    setAnchorElAdvanced(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElReadingTime(null);
    setAnchorElAdvanced(null);
  };

  const handleModalOpen = (type) => {
    setFilterType(type);
    setModalOpen(true);
  };

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
      } else if (filterType === "fuzziness") {
        url += `&filter=fuzziness&filter=${fuzziness}`;
      } else if (filterType === "reading_time_lt") {
        url += `&filter=reading_time&filter=lt&filter=${readingTime}`;
      } else if (filterType === "reading_time_gte") {
        url += `&filter=reading_time&filter=gte&filter=${readingTime}`;
      } else if (filterType === "reading_time_between") {
        url += `&filter=reading_time&filter=between&filter=${readingTime},${readingTimeEnd}`;
      } else if (filterType === "and") {
        url += `&filter=and`;
      } else if (filterType === "must_not") {
        url += `&filter=mustNot&filter=${mustNot}`;
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
      <div className="filters">
        <div className="opcoes">
          <Button
            id="data-button"
            aria-controls={open ? 'data-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{
              backgroundColor: 'var(--Ansewer_background)',
              color: 'var(--text_color)',
              '&:hover': {
                backgroundColor: 'var(--button_hover_color)',
              },
            }}
          >
            Data
          </Button>
          <Menu
            id="data-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'data-button',
            }}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: 'var(--Header_background)',
                color: 'var(--text_color)',
              },
            }}
          >
            <MenuItem onClick={() => { handleModalOpen("before"); handleClose(); }}>Antes de</MenuItem>
            <MenuItem onClick={() => { handleModalOpen("after"); handleClose(); }}>Depois de</MenuItem>
            <MenuItem onClick={() => { handleModalOpen("between"); handleClose(); }}>Entre</MenuItem>
          </Menu>
          <Button
            id="reading-time-button"
            aria-controls={openReadingTime ? 'reading-time-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openReadingTime ? 'true' : undefined}
            onClick={handleReadingTimeClick}
            sx={{
              backgroundColor: 'var(--Ansewer_background)',
              color: 'var(--text_color)',
              '&:hover': {
                backgroundColor: 'var(--button_hover_color)',
              },
            }}
          >
            Tempo de Leitura
          </Button>
          <Menu
            id="reading-time-menu"
            anchorEl={anchorElReadingTime}
            open={openReadingTime}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'reading-time-button',
            }}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: 'var(--Header_background)',
                color: 'var(--text_color)',
              },
            }}
          >
            <MenuItem onClick={() => { handleModalOpen("reading_time_lt"); handleClose(); }}>Menor que</MenuItem>
            <MenuItem onClick={() => { handleModalOpen("reading_time_gte"); handleClose(); }}>Maior ou igual a</MenuItem>
          </Menu>
          <Button
            id="advanced-options-button"
            aria-controls={openAdvanced ? 'advanced-options-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openAdvanced ? 'true' : undefined}
            onClick={handleAdvancedClick}
            sx={{
              backgroundColor: 'var(--Ansewer_background)',
              color: 'var(--text_color)',
              '&:hover': {
                backgroundColor: 'var(--button_hover_color)',
              },
            }}
          >
            Opções Avançadas
          </Button>
          <Menu
            id="advanced-options-menu"
            anchorEl={anchorElAdvanced}
            open={openAdvanced}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'advanced-options-button',
            }}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: 'var(--Header_background)',
                color: 'var(--text_color)',
              },
            }}
          >
            <MenuItem onClick={() => { handleModalOpen("fuzziness"); handleClose(); }}>Generalização da Busca</MenuItem>
            <MenuItem onClick={() => { handleModalOpen("must_not"); handleClose(); }}>Proibir Palavra</MenuItem>
          </Menu>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modalStyle">
          <Typography id="modal-title" variant="h6" component="h2">
            Selecionar Filtro
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            <div className="modal-input-container">
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
              ) : filterType === "fuzziness" ? (
                <Box sx={{ width: 300 }}>
                  <Slider
                    style={{ color: 'var(--text_color)' }}
                    aria-label="Fuzziness"
                    defaultValue={0}
                    getAriaValueText={valuetext}
                    step={null}
                    marks={marks}
                    min={0}
                    max={2}
                    valueLabelDisplay="auto"
                    value={fuzziness}
                    onChange={(e, newValue) => setFuzziness(newValue)}
                    sx={{
                      '& .MuiSlider-markLabel': {
                        color: 'var(--text_color)',
                      },
                      '& .MuiSlider-valueLabel': {
                        color: 'var(--text_color)',
                      },
                    }}
                  />
                </Box>
              ) : filterType === "reading_time_lt" || filterType === "reading_time_gte" ? (
                <input
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  placeholder="Tempo de leitura (em minutos)"
                />
              ) : filterType === "must_not" ? (
                <input
                  type="text"
                  value={mustNot}
                  onChange={(e) => setMustNot(e.target.value)}
                  placeholder="Termo que não deve aparecer"
                />
              ) : null}
              <Button onClick={handleSearchSubmit} variant="contained" className="modal-button">
                Aplicar Filtro
              </Button>
            </div>
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
                  <h2><a href={result.url} target="_blank" rel="noopener noreferrer">{parse(result.title)}</a></h2>
                  <h4>{parse(result.abs)}</h4>
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