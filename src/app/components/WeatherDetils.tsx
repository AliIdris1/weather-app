import React from 'react'
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { ImMeter } from "react-icons/im";


export interface WeatherDetilsprops{
    visability: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

 const WeatherDetils = (props: WeatherDetilsprops) => {
    const {
        sunrise = "19"
    } = props
  return (
    <>
    <SingleWeatherDetils 
    icon = {<LuEye/>}
    informtion='visability'
    value= {props.visability}
    />
    <SingleWeatherDetils 
    icon = {<FiDroplet/>}
    informtion='humidity'
    value= {props.humidity}
    />
    <SingleWeatherDetils 
    icon = {<MdAir/>}
    informtion='windSpeed'
    value= {props.windSpeed}
    />
    <SingleWeatherDetils 
    icon = {<ImMeter/>}
    informtion='airPressure'
    value= {props.airPressure}
    />
    <SingleWeatherDetils 
    icon = {<LuSunrise/>}
    informtion='sunrise'
    value= {sunrise}
    />
    <SingleWeatherDetils 
    icon = {<LuSunset/>}
    informtion='sunset'
    value= {props.sunset}
    />
    </>
  )
}

export interface SingleWeatherDetilsProps{
    informtion : string ;
    icon : React.ReactNode ;
    value : string ;
}

function SingleWeatherDetils(props:SingleWeatherDetilsProps) {
    return(
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className='whitespace-nowrap'>{props.informtion}</p>
            <div className='text-3xl'>{props.icon}</div>
            <p>{props.value}</p>
        </div>
    )
}

export default WeatherDetils