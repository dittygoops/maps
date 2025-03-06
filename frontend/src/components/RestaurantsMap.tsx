import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerImg from './../assets/map-pin.svg';
import coloredMarker from './../assets/colored-map-pin.svg';
import coloredMarker2 from './../assets/colored-map-pin2.svg';

// Create a custom grayscale marker icon.
const customGrayscaleIcon = L.icon({
  iconUrl: markerImg,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
  iconSize: [30, 30], // size of the icon
  iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  shadowSize: [30, 30], // size of the shadow
  shadowAnchor: [-5,0 ] // the same for the shadow
});

// Create a custom colored marker icon.
const customColoredIcon = L.icon({
  iconUrl: coloredMarker,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
  iconSize: [40, 40], // size of the icon
  iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  shadowSize: [40, 40], // size of the shadow
  shadowAnchor: [0, 0] // the same for the shadow
});

// Create a custom colored marker icon.
const customColoredIcon2 = L.icon({
  iconUrl: coloredMarker2,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
  iconSize: [20, 20], // size of the icon
  iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  shadowSize: [10, 20], // size of the shadow
  shadowAnchor: [0, 0] // the same for the shadow
});

// RecenterMap component that updates the map view when center changes.
const RecenterMap: React.FC<{ center: [number, number]}> = ({ center }) => {
  const map = useMap();

  // Update the map view when the center changes.
  useEffect(() => {
    map.flyTo(center, map.getZoom(), {
      animate: true,
      duration: 1.5, // duration in seconds
    });
  }, [center, map]);
  
  return null;
}

// This component wraps the Marker and uses the map instance to flyTo on click.
const FlyToMarker: React.FC<{ restaurant: any }> = ({ restaurant }) => {
  const map = useMap();

  return (
    <Marker
      position={[restaurant.lat, restaurant.long]}
      icon={customColoredIcon}
      eventHandlers={{
        click: () => {
          // Use the map's flyTo method to smoothly pan to the marker location.
          map.flyTo([restaurant.lat, restaurant.long], map.getZoom(), {
            animate: true,
            duration: 1.5, // duration in seconds
          });
        },
      }}
    >
      <Popup>{restaurant.original_name}</Popup>
    </Marker>
  );
};

interface RestaurantsMapProps {
  center: [number, number];
  radius: number;
  restaurants: any;
}

const RestaurantsMap: React.FC<RestaurantsMapProps> = ({ center, radius, restaurants }) => {
  // Stadia Maps tile URL with API key.
  const tileUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_STADIA_MAP_API_KEY}`;

  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState(center);

  const selectRestaurant = (id: string) => {
    if (selectedRestaurant === id) {
      setSelectedRestaurant(null);
    } else {
      setSelectedRestaurant(id);
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className=' w-1/3 bg-gray-800 text-white p-4'>
        {restaurants.map((restaurant: any) => (
                <div 
                  key={restaurant.id} 
                  className={`rounded-xl text-base md:text-l font-bold drop-shadow-lg py-3 px-8 transition-colors duration-300 ${
                    restaurant.id === selectedRestaurant 
                      ? 'bg-white text-black' 
                      : 'bg-black text-white hover:bg-white hover:text-black'
                  } my-3 w-11/12`} 
                  onClick={() => {
                    selectRestaurant(restaurant.id);
                    setMapCenter([restaurant.lat, restaurant.long]);
                  }}
                >
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col">
                      <span className="text-left">{ restaurant.original_name }</span>
                      <span className="text-gray-500 text-xs md:text-sm mt-1">{ restaurant.distance } miles away</span>
                    </div>
                  </div>
                </div>
            ))}
      </div>
      <MapContainer center={mapCenter} zoom={16} className="h-screen w-full">
        <TileLayer
          url={tileUrl}
          attribution="© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors"
        />
        <Circle center={center} radius={radius * 1609.34} pathOptions={{ color: 'blue' }} />
        <Marker position={center} icon={customGrayscaleIcon}></Marker>

        {/* Display restaurant markers on the map. */}
        {restaurants.map((restaurant: any) => (
          <FlyToMarker key={restaurant.id} restaurant={restaurant} />
        ))}

        {/* Recenter the map when the center changes. */}
        <RecenterMap center={mapCenter} />
      </MapContainer>
    </div>
  );
};

export default RestaurantsMap;
