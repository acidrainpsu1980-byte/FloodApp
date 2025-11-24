"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapPickerProps {
    lat?: number;
    lng?: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onLocationSelect, lat, lng }: MapPickerProps) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);

    return lat && lng ? (
        <Marker position={[lat, lng]} icon={icon} />
    ) : null;
}

export default function MapPicker({ lat, lng, onLocationSelect }: MapPickerProps) {
    // Default to Hat Yai coordinates
    const defaultCenter: [number, number] = [7.0086, 100.4747];

    return (
        <div style={{ height: "300px", width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)", zIndex: 0 }}>
            <MapContainer
                center={lat && lng ? [lat, lng] : defaultCenter}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker lat={lat} lng={lng} onLocationSelect={onLocationSelect} />
            </MapContainer>
        </div>
    );
}
