import "./index.css";
import React, { useEffect } from "react";

import { useState } from "react";

import axios from "axios";

import MoonSvg from "../../assets/svgs/new_moon.svg";
import CloudSvg from "../../assets/svgs/new_cloud.svg";

const WeatherWidget = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (location.length > 0) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${
            import.meta.env.VITE_WEATHER_API_KEY
          }&units=metric`
        )

        .then((response) => {
          setWeatherData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [location]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const currentTimeUTC = new Date().getTime() / 1000;
  const localTime = currentTimeUTC + weatherData.timezone;
  const isDayTime =
    localTime > weatherData.sys.sunrise && localTime < weatherData.sys.sunset;
  const cloudSize = weatherData.clouds.all;

  return (
    <div className="weather-widget">
      {isDayTime ? (
        <div className="sun"></div>
      ) : (
        <img src={MoonSvg} className="moon" alt="Moon" />
      )}
      <div className="cloud-container">
        {cloudSize > 50 && <img src={CloudSvg} className="cloud" alt="Cloud" />}
      </div>
      <div className="temperature">{Math.round(weatherData.main.temp)}°</div>
      <div className="weather">{weatherData.weather[0].main}</div>
      <div className="low-high">
        {Math.round(weatherData.main.temp_min)}° /{" "}
        {Math.round(weatherData.main.temp_max)}°
      </div>
      <div className="feels-like">
        Sensacao: {Math.round(weatherData.main.feels_like)}°{" "}
      </div>
      <div className="location">{weatherData.name}</div>
      <div className="humidity">Humidade: {weatherData.main.humidity}</div>
    </div>
  );
};

export default WeatherWidget;
