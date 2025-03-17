import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.photon/leaflet.photon.css'; // Photon CSS
import 'leaflet.photon'; // Photon plugin
import markerImg from './../assets/map-pin.svg';
import InputSlider from './Slider';

// Create a custom grayscale marker icon
const customGrayscaleIcon = L.icon({
  iconUrl: markerImg,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
  iconSize: [60, 60],
  iconAnchor: [30, 30],
  popupAnchor: [30, 30],
  shadowSize: [60, 60],
  shadowAnchor: [20, 30],
});

// PhotonSearch component for search autocomplete
const PhotonSearch = ({ setCenter, setCircleCenter }) => {
  const map = useMap();
  const photonControlRef = useRef(null);

  useEffect(() => {
    if (!map || photonControlRef.current) return;

    // Initialize Photon search control
    const photonControl = L.control.photon({
      url: 'https://photon.komoot.io/api/?', // Photon API endpoint
      placeholder: 'Search for a location...',
      position: 'topleft',
      limit: 5,
      submitDelay: 300,
      feedbackLabel: '',
      feedbackEmail: '',
      includePosition: true,
      noResultLabel: 'No results found',
      onSelected: (feature) => {
        const { coordinates } = feature.geometry;
        const newCenter = [coordinates[1], coordinates[0]]; // Photon returns [lon, lat], Leaflet uses [lat, lon]
        map.flyTo(newCenter, 14, { animate: true, duration: 1.5 });
        setCenter(newCenter);
        setCircleCenter(newCenter);
      },
    });

    photonControl.addTo(map);
    photonControlRef.current = photonControl;

    // Cleanup on unmount
    return () => {
      if (photonControlRef.current) {
        photonControlRef.current.remove();
        photonControlRef.current = null;
      }
    };
  }, [map, setCenter, setCircleCenter]);

  return null;
};

// RecenterMap component
const RecenterMap = ({ center, setCenter, setCircleCenter }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  useMapEvents({
    move: (event) => {
      const newCenter = event.target.getCenter();
      setCircleCenter([newCenter.lat, newCenter.lng]);
    },
    drag: (event) => {
      const newCenter = event.target.getCenter();
      setCenter([newCenter.lat, newCenter.lng]);
    },
    click: (event) => {
      event.target.flyTo(event.latlng, event.target.getZoom(), {
        animate: true,
        duration: 2.5,
      });
      setCenter([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
};

interface StadiaMapProps {
  center: [number, number];
  setCenter: React.Dispatch<React.SetStateAction<[number, number]>>;
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
}

const StadiaMap: React.FC<StadiaMapProps> = ({ center, setCenter, radius, setRadius }) => {
  const [circleCenter, setCircleCenter] = useState<[number, number]>(center);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          setCircleCenter([latitude, longitude]);
        },
        (error: GeolocationPositionError) => {
          console.error('Error obtaining geolocation', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
    }
  }, [setCenter]);

  const tileUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_STADIA_MAP_API_KEY}`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <MapContainer center={center} zoom={13} className="h-screen w-full">
        <TileLayer
          url={tileUrl}
          // attribution="© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors"
        />
        <Circle center={circleCenter} radius={radius * 1609.34} pathOptions={{ color: 'blue' }} />
        <Marker position={circleCenter} icon={customGrayscaleIcon}></Marker>
        <RecenterMap center={center} setCenter={setCenter} setCircleCenter={setCircleCenter} />
        <PhotonSearch setCenter={setCenter} setCircleCenter={setCircleCenter} />
      </MapContainer>
      <InputSlider value={radius} onChange={setRadius} />
    </div>
  );
};

export default StadiaMap;