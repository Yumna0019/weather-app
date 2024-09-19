import React, { useState, useEffect } from 'react';
import backgroundImage from '../assets/BackgroundImage.png';

const WeatherApp = () => {
    const [search, setSearch] = useState("Karachi");
    const [data, setData] = useState(null);
    const [input, setInput] = useState("");
    const [cityNotFound, setCityNotFound] = useState(false); 

    useEffect(() => {
        const fetchWeatherApi = async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=11342dd04adbd7f13c0076d225ba2800`
                );
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                    setCityNotFound(false);
                } else {
                    setCityNotFound(true); 
                    setData(null);
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
                setCityNotFound(true);
            }
        };
        fetchWeatherApi();
    }, [search]);

    let emoji = null;

    if (data && data.weather && data.weather[0]) {
        if (data.weather[0].main === "Clouds") {
            emoji = "fa-cloud";
        } else if (data.weather[0].main === "Thunderstorm") {
            emoji = "fa-bolt";
        } else if (data.weather[0].main === "Drizzle") {
            emoji = "fa-cloud-rain";
        } else if (data.weather[0].main === "Rain") {
            emoji = "fa-cloud-shower-heavy";
        } else if (data.weather[0].main === "Snow") {
            emoji = "fa-snowflake";
        } else {
            emoji = "fa-smog";
        }
    }

    const getCityTime = () => {
        if (data && data.timezone) {
            const timezoneOffset = data.timezone;
            const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
            const cityTime = new Date(utcTime + timezoneOffset * 1000);

            return cityTime;
        }
        return null;
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearch(input);
        setInput("");
    };

    const cityTime = getCityTime();
    const formattedDate = cityTime ? cityTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const formattedTime = cityTime ? cityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';

    return (
        <div>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div
                        className="card text-white text-center border-0"
                        style={{ width: '23rem', height: '30rem', backgroundColor: 'transparent' }}
                    >
                        <img
                            src={backgroundImage}
                            className="card-img"
                            alt="backgroundImage"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className="card-img-overlay">
                            <form onSubmit={handleSearchSubmit}>
                                <div className="input-group mb-4 w-75 mx-auto">
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder="Search City"
                                        aria-label="Search City"
                                        aria-describedby="basic-addon2"
                                        name="search"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        required
                                        style={{ backgroundColor: 'lightgrey', color: 'black' }}
                                    />
                                    <button type="submit" className="input-group-text" id="basic-addon2">
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>

                            {cityNotFound ? (
                                <div className="bg-dark bg-opacity-50 py-3"  style={{ marginLeft: '10px', marginRight: '10px' }}>
                                    <h2 className="card-title">City not found</h2>
                                </div>
                            ) : data && data.main && (
                                <div className="bg-dark bg-opacity-50 py-3" style={{ marginLeft: '10px', marginRight: '10px' }}>
                                    <h2 className="card-title">
                                        {data.name}, {data.sys?.country} 
                                    </h2>
                                    <p className="card-text">
                                        {formattedDate} 
                                        <br />
                                        {formattedTime} 
                                    </p>
                                    <hr />
                                    <i className={`fas ${emoji} fa-4x`}></i>
                                    <h1 className="fw-bolder mb-5">{data.main.temp}&deg;C</h1>
                                    <div className="lead fw-bolder mb-0">{data.weather[0].main}</div>
                                    <div className="lead">
                                        {data.main.temp_min}&deg;C | {data.main.temp_max}&deg;C
                                    </div>
                                </div>
                            )}

                            {!data && !cityNotFound && (
                                <div>Loading...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherApp;
