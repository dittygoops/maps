import { useState, useEffect } from "react"

import StadiaMap from "./components/StadiaMap"
import RestaurantsMap from "./components/RestaurantsMap"
import NewRestaurantsMap from "./components/NewRestaurantsMap";

// Import as a URL instead of direct content
import restaurantsDataUrl from './RestaurantsData.txt?url';

type Restaurant = {
  id: string;
  original_name: string;
  calc_value: number;
  average_calories: number;
  average_carbs_g: number;
  average_fiber_g: number;
  average_protein_g: number;
  distance: number;
  lat: number;
  long: number;
};

function App() {
  const [center, setCenter] = useState<[number, number]>([33.4200832, -111.9377963])
  const [radius, setRadius] = useState<number>(0.75)

  // Initialize with empty array and fetch data
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // Fetch and parse restaurant data
  useEffect(() => {
    fetch(restaurantsDataUrl)
      .then(response => response.text())
      .then(text => {
        try {
            const rawData = JSON.parse(text);
            const parsedData = rawData.map((restaurant: any, index: number) => ({
              ...restaurant,
              id: index.toString(),
            }));
          setRestaurants(parsedData);
        } catch (error) {
          console.error("Failed to parse restaurants data:", error);
        }
      })
  }, []);

  return (
    <div className="h-screen w-screen">
      <div className="w-full h-full flex flex-col">
        <div className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold">I WANT </h1>
        </div>
        <div className="flex-grow">
          {/* <StadiaMap center={center} setCenter={setCenter} radius={radius} setRadius={setRadius}/> */}
          <RestaurantsMap center={center} radius={radius} restaurants={restaurants} />
          {/* <NewRestaurantsMap center={center} setCenter={setCenter} radius={radius} restaurants={restaurants} /> */}
        </div>
      </div>
    </div>
  )
}

export default App
