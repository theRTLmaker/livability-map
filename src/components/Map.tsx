'use client'
import React, { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  GeoJSON,
} from 'react-leaflet'
import { useScores } from '../hooks/useScores'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:      require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:    require('leaflet/dist/images/marker-shadow.png'),
})

interface MapProps { weight: number }

export default function Map({ weight }: MapProps) {
  const [tubeStops, setTubeStops] = useState<any>(null)

  useEffect(() => {
    fetch('/data/tube-stops.geojson')
      .then((r) => r.json())
      .then(setTubeStops)
      .catch(console.error)
  }, [])

  // compute our grid of scored cells
  const scoreGrid = useScores(tubeStops, weight)

  return (
    <MapContainer
      center={[51.5074, -0.1278]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Choropleth: color each cell by score */}
      {scoreGrid && (
        <GeoJSON
          data={scoreGrid as any}
          style={(feat: any) => {
            const { distance, hasPOI } = feat.properties
            // station-in-cell always green
            if (hasPOI) {
              return { fillColor: 'hsl(120,100%,50%)', fillOpacity: 0.5, weight: 0 }
            }
            const walkMins = (distance * 1000) / 83.3
            let hue = 0

            if (walkMins <= 5) {
              hue = 120           // green
            } else if (walkMins <= 10) {
              // 5→10 min ramp green→yellow (120→60)
              hue = 120 - ((walkMins - 5) / 5) * 60
            } else {
              hue = 0             // red
            }

            return {
              fillColor: `hsl(${hue},100%,50%)`,
              fillOpacity: 0.4,
              weight: 0,
            }
          }}
        />
      )}

      {/* tube stops on top */}
      {tubeStops && (
        <GeoJSON
          data={tubeStops}
          pointToLayer={(_, latlng) =>
            L.circleMarker(latlng, { radius: 4, color: '#0066cc' })
          }
          onEachFeature={(feat, layer) => {
            const name = (feat.properties as any)?.name
            if (name) layer.bindPopup(name)
          }}
        />
      )}
    </MapContainer>
  )
}