import React, { useState, useEffect } from "react";
import SearchCity from "./searchCity.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import "../css/weather.css";
import Tilt from 'react-parallax-tilt';

const Weather = () => {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState({});
  const [checkLoc, setCheckLoc] = useState("");
  const [celFha, setCelFha] = useState("");
  const [isCles, setIsCles] = useState(true);

  const searchLoc = (searchText) => {
    setLocation(searchText);
  };

  const convertTiming = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hour = date.getHours();
    const min = date.getMinutes();
    const day = date.toLocaleDateString("en-In", { weekday: "long" });

    const convertHour = hour > 12 ? hour % 12 : hour;
    const convertMin = min < 10 ? "0" + min : min;
    const ampm = hour > 11 ? "pm" : "am";
    return `${day}, ${convertHour}:${convertMin} ${ampm}`;
  };

  const fetchingData = async (loc) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=1e0e24147b92471792464205243105&q=${loc}&aqi=yes`
      );
      const weatherData = response.data;
      setCheckLoc(true);

      setWeatherInfo({
        ...weatherInfo,
        tempCel: weatherData.current.temp_c,
        tempFha: weatherData.current.temp_f,
        humidity: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_kph,
        condition: weatherData.current.condition.text,
        icon: weatherData.current.condition.icon,
        timing: convertTiming(weatherData.location.localtime),
        locName: weatherData.location.name,
        region: weatherData.location.region,
        cloudCoverage: weatherData.current.cloud,
        co: weatherData.current.air_quality.co,
        lastUpdate: convertTiming(weatherData.current.last_updated),
      });

      setCelFha(weatherData.current.temp_c);
    } catch (e) {
      if (e.response.status === 400) setCheckLoc(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchingData(location);
  }, [location]);

  return (
    <div className="tempPage">
      <div className="tempNav">
        <h1>MoSum</h1>
        <div className="citySearch">
          <SearchCity onSearch={searchLoc} />
        </div>
      </div>
      <div className="tempCardParent">
        <Tilt options={{ scale: 2, max: 25 }}>
        <div className="tempCard">
          <div className="tempContent">
          {loading ? (
            <div className="loadingIcon">
              <CircularProgress />
            </div>
          ) : (
            <>
              {checkLoc === false && location ? (
                <p>Enter correct location</p>
              ) : checkLoc ? (
                <>
                  <h2>
                    {weatherInfo.locName}, {weatherInfo.region}
                  </h2>
                  <hr />
                  <div className="tempReadingAndTime">
                    <div className="tempReading">
                      <div className="tempNum">
                        <img src={weatherInfo.icon} alt="weatherIcon" />
                        <h3>
                          {celFha}&deg;
                          <span
                            className={`cl ${isCles ? "" : "faded"}`}
                            onClick={() => {
                              setCelFha(weatherInfo.tempCel);
                              setIsCles(true);
                            }}
                          >
                            {" "}
                            C
                          </span>{" "}
                          |{" "}
                          <span
                            className={`fa ${isCles ? "faded" : ""}`}
                            onClick={() => {
                              setCelFha(weatherInfo.tempFha);
                              setIsCles(false);
                            }}
                          >
                            F
                          </span>
                        </h3>
                      </div>
                    </div>
                    <div className="tempTime">
                      <p>{weatherInfo.timing}</p>
                      <p>{weatherInfo.condition}</p>
                    </div>
                  </div>
                  <div className="tempDetails">
                    <div className="details-left">
                      <p>Wind Speed: {weatherInfo.windSpeed} km/h</p>
                      <p>Cloud Coverage: {weatherInfo.cloudCoverage}</p>
                    </div>
                    <div className="details-right">
                      <p>Humidity: {weatherInfo.humidity}%</p>
                      <p
                        className={`${
                          weatherInfo.co < 100
                            ? "gre"
                            : weatherInfo.co < 200
                            ? "ylw"
                            : weatherInfo.co < 300
                            ? "org"
                            : "red"
                        }`}
                      >
                        Co: {weatherInfo.co}
                      </p>
                    </div>
                  </div>
                  <div className="lastUpdate">
                    <p>Last update: {weatherInfo.lastUpdate}</p>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}
          </div>
        </div>          
        </Tilt>

      </div>
    </div>
  );
};

export default Weather;
