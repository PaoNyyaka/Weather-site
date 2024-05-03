import './App.css'
import { useEffect, useState } from 'react'


/*Images */
import searchIcon from './assets/search.png'
import cloudy from './assets/cloudy.png'
import rainy from './assets/rainy.png'
import snow from './assets/snow.png'
import storm from './assets/storm.png'
import sun from './assets/sun.png'
import windIcon from './assets/wind.png'
import humidityIcon from './assets/humidity.png'

const WeatherDetails = ({icon, temp, city, country, lat, log, humidity, wind}) => {
  return (
  <>
  <div className='image'>
    <img src={icon} alt="Image" />
  </div>
  <div className='temp'>{temp}°C</div>
  <div className='location'>{city} </div>
  <div className='country'>{country} </div>
  <div className='cord'>
    <div>
      <span className="lat">latitube</span>
      <span>{lat}</span>
    </div>
    <div>
      <span className="log">longitube</span>
      <span>{log}</span>
    </div>
  </div>
  <div className='data-container'>
    <div className='element'>
      <img src={humidityIcon} alt="humidity" className='icon' />
      <div className='data'>
        <div className='humitidy-percent'>{humidity}</div>
        <div className='text'>Humidity</div>
      </div>
    </div>
    <div className='element'>
      <img src={windIcon} alt="wind" className='icon' />
      <div className='data'>
        <div className='wind-pecent'>{wind}</div>
        <div className='text'>Wind Speed</div>
      </div>
    </div>

  </div>
  </>
  )
};

function App() {
  let api_key = '6e88a3b7b3e4b7f5ef16076e0784dd88';

  const [text, setText] = useState('Moscow')
  const [icon, setIcon] = useState(snow)
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState('Moscow')
  const [country, setCountry] = useState('RU')
  const [lat, setLat] = useState(0)
  const [log, setLog] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [wind, setWind] = useState(0)

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoaging] = useState(false)
  const [error, setError] = useState(null);

  const weatherIconMap = {
    '01d': sun,
    '01n': sun,
    '02d': sun,
    '02n': sun,
    '03d': cloudy,
    '03n': cloudy,
    '04d': cloudy,
    '04n': cloudy,
    '09d': rainy,
    '09n': rainy,
    '10d': rainy,
    '10n': rainy,
    '13d': snow,
    '13n': snow,
  };

  const search = async () => {
    setLoaging(true)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url)
      let data = await res.json();
      /* console.log(data); */
      if(data.cod === '404') {
        console.log('City not found');
        setCityNotFound(true);
        setLoaging(false);
      return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || sun);
      setCityNotFound(false);

    }catch(error) {
      console.error('An error occured:', error.message);
      setError('An error occured while fetching weather data.')
    }finally {
      setLoaging(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value)
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <div className='container'>
      <div className='input-container'>
        <input type="text" 
        className='cityInput'
        placeholder='Search City' 
        onChange={handleCity}
        value={text}
        onKeyDown={handleKeyDown}
        />
        <div className='search-icon' onClick={() => search()}>
          <img 
          className='serch'
          src={searchIcon} 
          alt="search.png" 
          />
        </div>
      </div>
      
      {loading && <div className='loading-message'>Loading...</div>}
      {error && <div className='error-message'>{error}</div>}
      {cityNotFound && <div className='city-not-found'>City not found</div>}

      {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}
    </div>
  )
}
export default App
