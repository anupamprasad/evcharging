import { useEffect, useRef, useState, useMemo } from 'react'
import Map, { Marker, Popup, ViewStateChangeEvent } from 'react-map-gl/mapbox'
import Supercluster from 'supercluster'
import { Station } from '../types/database'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapViewProps {
  stations: Station[]
  selectedStation: Station | null
  onStationSelect: (station: Station | null) => void
  userLocation: { lat: number; lng: number } | null
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

export default function MapView({
  stations,
  selectedStation,
  onStationSelect,
  userLocation,
}: MapViewProps) {
  const [viewState, setViewState] = useState({
    longitude: 77.2090, // Default to New Delhi
    latitude: 28.6139,
    zoom: 5,
  })
  const [popupInfo, setPopupInfo] = useState<Station | null>(null)
  const mapRef = useRef<any>(null)

  // Create cluster instance
  const cluster = useMemo(() => {
    return new Supercluster({
      radius: 50,
      maxZoom: 16,
    })
  }, [])

  // Prepare points for clustering
  const points = useMemo(() => {
    return stations.map((station) => ({
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
    if (!mapRef.current) {
      return { clusters: [], markers: stations }
    }

    try {
      const map = mapRef.current.getMap()
      const bounds = map.getBounds().toArray().flat() as [number, number, number, number]

      const clusterResults = cluster.getClusters(
        bounds,
        Math.floor(viewState.zoom)
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
          if (station) {
            individualMarkers.push(station)
          }
        }
      })

      return { clusters: clusterMarkers, markers: individualMarkers }
    } catch (error) {
      // Fallback to showing all stations if clustering fails
      return { clusters: [], markers: stations }
    }
  }, [cluster, viewState.zoom, stations])

  // Center map on user location if available
  useEffect(() => {
    if (userLocation) {
      setViewState({
        longitude: userLocation.lng,
        latitude: userLocation.lat,
        zoom: 12,
      })
    }
  }, [userLocation])

  // Center map on selected station
  useEffect(() => {
    if (selectedStation) {
      setViewState({
        longitude: selectedStation.longitude,
        latitude: selectedStation.latitude,
        zoom: 14,
      })
    }
  }, [selectedStation])

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

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">
            Mapbox token not configured
          </p>
          <p className="text-sm text-gray-500">
            Please set VITE_MAPBOX_TOKEN in your .env file
          </p>
        </div>
      </div>
    )
  }

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {/* User Location Marker */}
      {userLocation && (
        <Marker
          longitude={userLocation.lng}
          latitude={userLocation.lat}
          anchor="center"
        >
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
        </Marker>
      )}

      {/* Cluster Markers */}
      {clusters.map((clusterMarker) => (
        <Marker
          key={`cluster-${clusterMarker.id}`}
          longitude={clusterMarker.coordinates[0]}
          latitude={clusterMarker.coordinates[1]}
          anchor="center"
        >
          <div
            className="flex items-center justify-center rounded-full border-2 border-white text-white font-bold text-xs cursor-pointer"
            style={{
              width: `${40 + Math.min(clusterMarker.pointCount, 10) * 4}px`,
              height: `${40 + Math.min(clusterMarker.pointCount, 10) * 4}px`,
              backgroundColor: '#3b82f6',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
            onClick={() => {
              const expansionZoom = Math.min(
                cluster.getClusterExpansionZoom(clusterMarker.id) || viewState.zoom + 2,
                18
              )
              setViewState({
                ...viewState,
                zoom: expansionZoom,
                longitude: clusterMarker.coordinates[0],
                latitude: clusterMarker.coordinates[1],
              })
            }}
          >
            {clusterMarker.pointCount}
          </div>
        </Marker>
      ))}

      {/* Individual Station Markers */}
      {markers.map((station) => (
        <Marker
          key={station.id}
          longitude={station.longitude}
          latitude={station.latitude}
          anchor="center"
        >
          <button
            onClick={() => {
              onStationSelect(station)
              setPopupInfo(station)
            }}
            className="cursor-pointer"
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: getStatusColor(station.availability_status),
              border: '2px solid white',
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
            title={station.name}
          />
        </Marker>
      ))}

      {/* Popup */}
      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          anchor="bottom"
          onClose={() => setPopupInfo(null)}
          closeButton={true}
          closeOnClick={false}
        >
          <div className="p-2">
            <h3 className="font-semibold text-sm mb-1">{popupInfo.name}</h3>
            <p className="text-xs text-gray-600">{popupInfo.operator}</p>
            <p className="text-xs text-gray-600">{popupInfo.availability_status}</p>
          </div>
        </Popup>
      )}
    </Map>
  )
}

