import React from 'react'
import Container from './Container'
import Weathericon from './Weathericon'
import WeatherDetils, { WeatherDetilsprops } from './WeatherDetils';
import { convertKelvinToCelsius } from '../utils/convertKelvinToCelsius';

interface ForecastWeatherdetilsprops extends WeatherDetilsprops {
  weatehrIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

function ForecastWeatherdetils(props: ForecastWeatherdetilsprops) {

  const {
    weatehrIcon = "02d",
    date = "19.09",
    day = "Tuesday",
    temp,
    feels_like,
    temp_min,
    temp_max,
    description
  } = props;
  return (
    <Container className='gap-4'>
      <section className='flex gap-4 items-center px-4'>
        <div className='flex flex-col items-center gap-1'>
          <Weathericon iconName={weatehrIcon}/>
          <p>{date}</p>
          <p className='text-sm'>{day}</p>
        </div>

        <div className='flex flex-col px-4'>
          <span className='text-5xl'> {convertKelvinToCelsius(temp ?? 0)}°</span>
          <p className='text-xs whitespace-nowrap space-x-1 '>
            <span>Feels like</span>
            <span>{convertKelvinToCelsius(feels_like ?? 0)}°</span>
          </p>
          <p className='capitalize'>{description}</p>
        </div>
      </section>

      <section className='overflow-x-auto justify-between gap-4 px-4 w-full flex pr-10 '>
        <WeatherDetils {...props}/>
      </section>
    </Container>
  )
}

export default ForecastWeatherdetils