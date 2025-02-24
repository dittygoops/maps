import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents, useMap } from 'react-leaflet'
import { useRef, useState, useEffect, useCallback } from 'react';

import "leaflet/dist/leaflet.css";

const Map = () => {
    const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 });
    const [radius, setRadius] = useState(20);
    const animateRef = useRef(true);

    function HandleMapEvents() {
        const map = useMap();
        
        useEffect(() => {
            map.on('move', () => {
                setCenter(map.getCenter())
            })
            return () => {
                map.off('move')
            }
        }, [map])
        
        return null
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
            <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <SetViewOnClick animateRef={animateRef}/>
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