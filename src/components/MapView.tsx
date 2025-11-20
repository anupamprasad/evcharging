import { useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Supercluster from 'supercluster'
import { Station } from '../types/database'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapViewProps {
  stations: Station[]
  selectedStation: Station | null
  onStationSelect: (station: Station | null) => void
  userLocation: { lat: number; lng: number } | null
}

// Component to handle map view updates
function MapController({ 
  selectedStation, 
  userLocation 
}: { 
  selectedStation: Station | null
  userLocation: { lat: number; lng: number } | null
}) {
  const map = useMap()

  useEffect(() => {
    if (selectedStation) {
      map.setView([selectedStation.latitude, selectedStation.longitude], 14)
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 12)
    }
  }, [map, selectedStation, userLocation])

  return null
}

// Component to capture map reference
function MapRefHandler({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap()
  
  useEffect(() => {
    mapRef.current = map
    console.log('Map created successfully')
  }, [map, mapRef])

  return null
}

export default function MapView({
  stations,
  selectedStation,
  onStationSelect,
  userLocation,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)

  // Default center (New Delhi)
  const defaultCenter: [number, number] = [28.6139, 77.2090]
  const defaultZoom = 5

  // Determine initial center
  const initialCenter = useMemo(() => {
    if (selectedStation) {
      return [selectedStation.latitude, selectedStation.longitude] as [number, number]
    }
    if (userLocation) {
      return [userLocation.lat, userLocation.lng] as [number, number]
    }
    return defaultCenter
  }, [selectedStation, userLocation])

  // Create cluster instance
  const cluster = useMemo(() => {
    return new Supercluster({
      radius: 50,
      maxZoom: 16,
    })
  }, [])

  // Prepare points for clustering
  const points = useMemo(() => {
    // Filter out stations with invalid coordinates
    const validStations = stations.filter(
      (station) => 
        station && 
        typeof station.latitude === 'number' && 
        typeof station.longitude === 'number' &&
        !isNaN(station.latitude) &&
        !isNaN(station.longitude) &&
        station.latitude >= -90 &&
        station.latitude <= 90 &&
        station.longitude >= -180 &&
        station.longitude <= 180
    )
    
    console.log(`Preparing ${validStations.length} valid stations out of ${stations.length} total`)
    
    return validStations.map((station) => ({
      type: 'Feature' as const,
      properties: {
        cluster: false,
        stationId: station.id,
        station: station,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [station.longitude, station.latitude],
      },
    }))
  }, [stations])

  // Load points into cluster
  useEffect(() => {
    cluster.load(points)
  }, [cluster, points])

  // Get clusters and individual points for current view
  const { clusters, markers } = useMemo(() => {
    // If no stations, return empty
    if (!stations || stations.length === 0) {
      return { clusters: [], markers: [] }
    }

    // If map is not ready, show all stations as individual markers
    if (!mapRef.current) {
      console.log('Map not ready, showing all stations as individual markers')
      return { clusters: [], markers: stations.filter(s => s.latitude && s.longitude) }
    }

    try {
      const map = mapRef.current
      const bounds = map.getBounds()
      
      if (!bounds) {
        console.log('Bounds not available, showing all stations')
        return { clusters: [], markers: stations.filter(s => s.latitude && s.longitude) }
      }

      const zoom = map.getZoom()
      const boundsArray: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ]

      const clusterResults = cluster.getClusters(
        boundsArray,
        Math.floor(zoom)
      )

      const individualMarkers: Station[] = []
      const clusterMarkers: Array<{ pointCount: number; coordinates: [number, number]; id: number }> = []

      clusterResults.forEach((clusterPoint) => {
        if (clusterPoint.properties.cluster) {
          clusterMarkers.push({
            pointCount: clusterPoint.properties.point_count as number,
            coordinates: clusterPoint.geometry.coordinates as [number, number],
            id: clusterPoint.properties.cluster_id as number,
          })
        } else {
          const station = clusterPoint.properties.station as Station
          if (station && station.latitude && station.longitude) {
            individualMarkers.push(station)
          }
        }
      })

      console.log(`Rendering ${individualMarkers.length} individual markers and ${clusterMarkers.length} clusters`)
      return { clusters: clusterMarkers, markers: individualMarkers }
    } catch (error) {
      console.error('Clustering error, falling back to all stations:', error)
      // Fallback to showing all stations if clustering fails
      return { clusters: [], markers: stations.filter(s => s.latitude && s.longitude) }
    }
  }, [cluster, stations])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return '#22c55e' // green
      case 'Busy':
        return '#eab308' // yellow
      case 'Offline':
        return '#6b7280' // gray
      default:
        return '#6b7280'
    }
  }

  return (
    <MapContainer
      center={initialCenter}
      zoom={defaultZoom}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapRefHandler mapRef={mapRef} />
      <MapController
        selectedStation={selectedStation}
        userLocation={userLocation}
      />

      {/* User Location Marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            <div className="text-sm font-semibold">Your Location</div>
          </Popup>
        </Marker>
      )}

      {/* Cluster Markers */}
      {clusters.map((clusterMarker) => (
        <Marker
          key={`cluster-${clusterMarker.id}`}
          position={[clusterMarker.coordinates[1], clusterMarker.coordinates[0]]}
        >
          <Popup>
            <div
              className="flex items-center justify-center rounded-full border-2 border-white text-white font-bold text-xs cursor-pointer"
              style={{
                width: `${40 + Math.min(clusterMarker.pointCount, 10) * 4}px`,
                height: `${40 + Math.min(clusterMarker.pointCount, 10) * 4}px`,
                backgroundColor: '#3b82f6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
              onClick={() => {
                if (mapRef.current) {
                  const expansionZoom = Math.min(
                    cluster.getClusterExpansionZoom(clusterMarker.id) || mapRef.current.getZoom() + 2,
                    18
                  )
                  mapRef.current.setView(
                    [clusterMarker.coordinates[1], clusterMarker.coordinates[0]],
                    expansionZoom
                  )
                }
              }}
            >
              {clusterMarker.pointCount}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Individual Station Markers */}
      {markers.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude]}
          icon={L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              width: 20px;
              height: 20px;
              background-color: ${getStatusColor(station.availability_status)};
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              cursor: pointer;
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })}
        >
          <Popup
            eventHandlers={{
              add: () => {
                onStationSelect(station)
              },
              remove: () => {
                // Popup closed
              }
            }}
          >
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">{station.name}</h3>
              <p className="text-xs text-gray-600">{station.operator}</p>
              <p className="text-xs text-gray-600">{station.availability_status}</p>
              <button
                onClick={() => onStationSelect(station)}
                className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
