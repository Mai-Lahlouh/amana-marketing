"use client";

import { MapContainer, TileLayer, Circle, Tooltip } from "react-leaflet";

interface BubbleMapProps {
  data: {
    lat: number;
    lng: number;
    [key: string]: any;
  }[];
  valueKey: string;
  labelKey: string;
}

export const BubbleMap: React.FC<BubbleMapProps> = ({ data, valueKey, labelKey }) => {
  const center: [number, number] =
    data.length > 0 ? [data[0].lat, data[0].lng] : [0, 0];

  // Compute circle radius: larger values = bigger circles
  const getRadius = (value: number) => Math.sqrt(value) * 400;

  const getColor = (value: number) => {
    if (value > 20000) return "rgba(239, 68, 68, 0.6)";
    else if (value > 10000) return "rgba(234, 179, 8, 0.6)";
    else return "rgba(16, 185, 129, 0.6)";
  };

  return (
    <MapContainer
      center={center}
      zoom={2}
      scrollWheelZoom
      style={{ height: 500, width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {data.map((item, idx) => (
        <Circle
          key={idx}
          center={[item.lat, item.lng]}
          radius={getRadius(item[valueKey] || 0)}
          color={getColor(item[valueKey] || 0)}
          fillColor={getColor(item[valueKey] || 0)}
          fillOpacity={0.4}
        >
          {/* <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
            {item[labelKey]}: {item[valueKey]}
          </Tooltip> */}
        </Circle>
      ))}
    </MapContainer>
  );
};
