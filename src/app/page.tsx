'use client'
import { useQuery } from "react-query";
import Navbar from "./components/Navbar";
import axios from "axios";
import { formatDistance, formatDistanceStrict, parseISO , format, fromUnixTime} from "date-fns";
import Container from "./components/Container";
import { convertKelvinToCelsius } from "./utils/convertKelvinToCelsius";
import Weathericon from "./components/Weathericon";
import { getDayOrNightIcon } from "./utils/getDayOrNightIcon";
import WeatherDetils from "./components/WeatherDetils";
import { metersToKilometers } from "./utils/metersToKilometers";
import { convertWindSpeed } from "./utils/convertWindSpeed";
import ForecastWeatherdetils from "./components/ForecastWeatherDetils";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";



// https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=e630c60f78e61a8fef3603bad5156394&cnt=56



interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: CityInfo;
}

interface WeatherEntry {
  dt: number; // Unix timestamp
  main: {
      temp: number; // Temperature in Kelvin
      feels_like: number; // Temperature feels like in Kelvin
      temp_min: number; // Minimum temperature in Kelvin
      temp_max: number; // Maximum temperature in Kelvin
      pressure: number; // Atmospheric pressure in hPa
      sea_level?: number; // Sea level pressure in hPa (optional)
      grnd_level?: number; // Ground level pressure in hPa (optional)
      humidity: number; // Humidity in percentage
      temp_kf?: number; // Temperature change in the last 3 hours (optional)
  };
  weather: {
      id: number; // Weather condition id
      main: string; // Group of weather parameters (Rain, Snow, Extreme etc.)
      description: string; // Weather condition within the group
      icon: string; // Weather icon id
  }[];
  clouds: {
      all: number; // Cloudiness percentage
  };
  wind: {
      speed: number; // Wind speed in meter/sec
      deg: number; // Wind direction in degrees
      gust?: number; // Wind gust speed in meter/sec (optional)
  };
  visibility: number; // Visibility in meters
  pop: number; // Probability of precipitation
  sys: {
      pod: string; // Part of the day (d - day time, n - night time)
  };
  dt_txt: string; // Date and time in UTC
}

interface CityInfo {
  id: number; // City ID
  name: string; // City name
  coord: {
      lat: number; // City latitude
      lon: number; // City longitude
  };
  country: string; // Country code (ISO 3166)
  population?: number; // Population of the city (optional)
  timezone: number; // Shift in seconds from UTC
  sunrise: number; // Sunrise time as Unix timestamp
  sunset: number; // Sunset time as Unix timestamp
}

export default  function Home() {
  const [place, setplace] = useAtom(placeAtom)
  const [loadingCity] = useAtom(loadingCityAtom)
  const { isLoading, error, data, refetch } = useQuery<WeatherData>('repoData', async () =>
    {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`)

      return data
    }
  )

  useEffect(() => {
    refetch()
  
  }, [place , refetch])
  

  const firstdata = data?.list[0]

  console.log(data?.list[0])

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });
  
  if (isLoading)
    return (
  <div className=" flex items-center min-h-screen justify-center">
    <p className="animate-bounce">Loading...</p>
  </div>
    )
  

  
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar loctaion={data?.city.name}/>
      <main className="px-3 mx-auto max-w-7xl flex flex-col gap-9  w-full pb-10 pt-4">

        {loadingCity ? <WeatherSkeleton /> :
        <>
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstdata?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">({format(parseISO(firstdata?.dt_txt ?? ""), "dd.MM.yyyy")})</p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              <div className="flex flex-col px-4">
                <span className="text-5xl">
              {convertKelvinToCelsius(firstdata?.main.temp ?? 303.34)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels Like</span>
                  <span>
                  {convertKelvinToCelsius(firstdata?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className="text-sm space-x-2">
                <span>
              {convertKelvinToCelsius(firstdata?.main.temp_min ?? 0)}°↓{" "}
                </span>
                <span>
              {convertKelvinToCelsius(firstdata?.main.temp_max ?? 0)} °↑
                </span>
                </p>
              </div>
              <div className="flex gap-10 sm:gap16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d , i) => (
                  <div key={i} className="flex flex-col justify-between gap-2 text-center text-xs font-semibold">
                    <p className="whitespace-nowrap">{format(parseISO(d.dt_txt), 'h:mm a')}</p>
                    <Weathericon iconName={getDayOrNightIcon(d.weather[0].icon , d.dt_txt)}/>
                    <p>{convertKelvinToCelsius(d.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">{firstdata?.weather[0].description}</p>
              <Weathericon iconName={getDayOrNightIcon(firstdata?.weather[0].icon ?? "", firstdata?.dt_txt ?? "")}/>
            </Container>
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
            <WeatherDetils visability={metersToKilometers(firstdata?.visibility ?? 10000)} 
            airPressure={`${firstdata?.main.pressure}hPa`}
            humidity={`${firstdata?.main.humidity}%`}
            sunrise={format(fromUnixTime(data?.city.sunrise ?? 674242), "H:mm")}
            sunset={format(fromUnixTime(data?.city.sunset ?? 674242), "H:mm")}
            windSpeed={convertWindSpeed(firstdata?.wind.speed ?? 1.64)}
            />
            </Container>
          </div>
        </section>
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Forecast (7 days)</p>
          {firstDataForEachDate.map((d , i) => (
            
            <ForecastWeatherdetils  
              key={i}
              description={d?.weather[0].description ?? ""}
              weatehrIcon={d?.weather[0].icon ?? "01d"}
              date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
              day={d ? format(parseISO(d.dt_txt), "dd.MM") : "EEEE"}
              feels_like={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              airPressure={`${d?.main.pressure} hPa `}
              humidity={`${d?.main.humidity}% `}
              sunrise={format(
                fromUnixTime(data?.city.sunrise ?? 1702517657),
                "H:mm"
              )}
              sunset={format(
                fromUnixTime(data?.city.sunset ?? 1702517657),
                "H:mm"
              )}
              visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
              />
          ))}
        </section>
        </>}
      </main>
    </div>
  );
}




function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 days forecast skeleton */}
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
    