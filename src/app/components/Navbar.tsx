"use client"
import React, { useState } from 'react'
import { IoMdSunny } from "react-icons/io";
import { MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import SearchBox from './SearchBox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '../atom';


type props = {loctaion?: string}



const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY
const Navbar = ({loctaion}: props) => {
  const [city, setcity] = useState("")
  const [error, seterror] = useState("")

  const [suggestions, setsuggestions] = useState([])
  const [ShowSuggestions, setShowSuggestions] = useState(false)
  const [place, setplace] = useAtom(placeAtom)
  const [_, setLoadingCity] = useAtom(loadingCityAtom)



  function handlesuggesuionClick(value : string) {
    setcity(value)
    setShowSuggestions(false)
  }

  function handleSubmitSearch(e:React.FormEvent<HTMLFormElement>): any {
    e.preventDefault()
    setLoadingCity(true)
    if(suggestions.length === 0) {
      seterror("Loction not found")
      setLoadingCity(false)
    } else {
      seterror("")
      setTimeout(() => {
        setLoadingCity(false)
        setShowSuggestions(false)
        setplace(city)
      }, 500);
    }
  }

  async function handleinputchange(value:string) {
    setcity(value)
    if(value.length >= 3) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=e630c60f78e61a8fef3603bad5156394`)
        const suggestions = response.data.list.map((item: any) => item.name)
        setsuggestions(suggestions)
        setShowSuggestions(true)
        seterror("")
      } catch (error) {
        setsuggestions([])
        setShowSuggestions(false)
      }
    } else {
      setsuggestions([])
        setShowSuggestions(false)
    }
  }

  function handlecurrentlocation() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (postion) => {
        const {latitude , longitude} = postion.coords;
        try {
          setLoadingCity(true)
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setplace(response.data.name);
          }, 500);
        } catch (error) {
          
        }
      })
    }
  }
  return (
    <>
    <nav className='z-50 bg-white top-0 left-0 shadow-sm sticky'>
        <div className='mx-auto px-3 max-w-7xl w-full h-[80px] flex justify-between items-center'>
            <div className='flex items-center justify-center gap-2'>
                <h2 className='text-gray-500 text-3xl'>Weather</h2>
                <IoMdSunny className='text-yellow-300 text-3xl mt-1' />
            </div>
            <section className='flex gap-2 items-center'>
                <MdMyLocation title='Your Current Location' onClick={handlecurrentlocation} className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer'/>
                <MdOutlineLocationOn className='text-3xl' />
                <p className='text-slate-900/80 text-sm'>{loctaion}</p>
                <div className='relative hidden md:flex'>
                <SearchBox onSubmit={handleSubmitSearch} className='relative' value={city} onChange={(e => handleinputchange(e.target.value))}/>
                <SuggestionBox 
                {...{
                  suggestions,
                  ShowSuggestions,
                  handlesuggesuionClick,
                  error
                }}
                />
                </div>
            </section>
        </div>
    </nav>
    <section className='flex max-w-7xl px-3 md:hidden'>

    
    <div className='relative '>
                <SearchBox onSubmit={handleSubmitSearch} className='relative' value={city} onChange={(e => handleinputchange(e.target.value))}/>
                <SuggestionBox 
                {...{
                  suggestions,
                  ShowSuggestions,
                  handlesuggesuionClick,
                  error
                }}
                />
                </div>
                </section>
    </>
  )
}

function SuggestionBox({
  suggestions,
  ShowSuggestions,
  error,
  handlesuggesuionClick
  
}:{
  ShowSuggestions : boolean ,
  suggestions : string[],
  error : string,
  handlesuggesuionClick : ((item: string) => void)
}) {
  return (
    <>{((ShowSuggestions && suggestions.length > 1 )|| error) && (

    <ul className='mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2'>
{error && suggestions.length < 1 &&(
  <li className='text-red-500 p-1'>{error}</li>
)}      
{suggestions.map((item , i) => (
  <li key={i} onClick={() => handlesuggesuionClick(item)} className='cursor-pointer p-1 rounded hover:bg-gray-200'>{item}</li>

))}
    </ul>
    )}
    </>
  )
}

export default Navbar
