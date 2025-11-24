"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { RequestData } from "@/lib/storage";

// Fix for default marker icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapViewerProps {
    requests: RequestData[];
}

export default function MapViewer({ requests }: MapViewerProps) {
    // Default to Hat Yai coordinates
    const defaultCenter: [number, number] = [7.0086, 100.4747];

    // Filter requests that have location data
    const validRequests = requests.filter(r => r.location.lat && r.location.lng);

    return (
        <div style={{ height: "400px", width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)", marginBottom: "1.5rem", zIndex: 0 }}>
            <MapContainer
                center={defaultCenter}
                zoom={12}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {validRequests.map(request => (
                    <Marker
                        key={request.id}
                        position={[request.location.lat!, request.location.lng!]}
                        icon={icon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong>{request.name}</strong><br />
                                {request.phone}<br />
                                {request.needs.join(", ")}<br />
                                <span className={`font-bold ${request.status === 'pending' ? 'text-red-600' :
                                    request.status === 'in-progress' ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                    {request.status === 'pending' ? 'รอช่วยเหลือ' :
                                        request.status === 'in-progress' ? 'กำลังดำเนินการ' : 'เสร็จสิ้น'}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
