import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents, useMap } from 'react-leaflet'
import { useRef, useState, useEffect } from 'react';
import ProviderTileLayer from './ProviderTileLayer';

import "leaflet/dist/leaflet.css";

const Map = () => {
    const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 });
    const [radius, setRadius] = useState(20);
    const animateRef = useRef(true);
    
    function HandleMapEvents() {
        const map = useMap();
        const hasGeolocated = useRef(false);

        useEffect(() => {
            map.on('move', () => {
                setCenter(map.getCenter())
            });
            return () => {
                map.off('move');
            }
        }, [map]);

        // useEffect(() => {
        //     if (!hasGeolocated.current && "geolocation" in navigator) {
        //         hasGeolocated.current = true;
        //         navigator.geolocation.getCurrentPosition((position) => {
        //             const newCenter = {
        //                 lat: position.coords.latitude,
        //                 lng: position.coords.longitude
        //             };
        //             setCenter(newCenter);
        //             map.setView(newCenter, 14, {
        //                 animate: animateRef.current,
        //                 duration: 0.5 // Reduced duration
        //             });
        //         }, (error) => {
        //             console.error("Error getting location:", error);
        //         });
        //     }
        // }, [map]); // runs only once because of the hasGeolocated flag
        
        return null;
    }

    function SetViewOnClick({ animateRef }: { animateRef: React.MutableRefObject<boolean> }) {
        const map = useMapEvents({
            click(e) {
                map.setView(e.latlng, map.getZoom(), {
                    animate: animateRef.current,
                    duration: 2 // Duration in seconds
                });
                setCenter(e.latlng);
            },
        });

        return null;
    }

    return (
        <div className='h-full w-full'>
            <MapContainer center={center} zoom={14} scrollWheelZoom={true}>
                <ProviderTileLayer
                    provider="Stadia.StamenToner"
                    options={{
                        attribution: 'Map data © <a href="https://stamen.com">Stamen</a> contributors',
                    }}
                />
                <SetViewOnClick animateRef={animateRef} />
                <HandleMapEvents />

                <Marker position={center}>
                </Marker>

                <CircleMarker center={center} pathOptions={{ color: 'gray' }} radius={radius}>
                </CircleMarker>
            </MapContainer>

            <div className="absolute bottom-4 left-4 z-[1000] bg-white p-4 rounded shadow">
                <label htmlFor="radius" className="block">Radius: {radius}</label>
                <input
                    type="range"
                    id="radius"
                    min="1"
                    max="100"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full"
                />
            </div>
        </div>
    )
}

export default Map;