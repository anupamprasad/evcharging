import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import MapView from '../components/MapView'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import StationDetails from '../components/StationDetails'
import { Station } from '../types/database'
import { supabase } from '../lib/supabase'
import { useUserPreferences } from '../hooks/useUserPreferences'

export default function HomePage() {
  const { user } = useAuth()
  const { preferences } = useUserPreferences()
  const [stations, setStations] = useState<Station[]>([])
  const [filteredStations, setFilteredStations] = useState<Station[]>([])
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    connectorTypes: [] as string[],
    chargerTypes: [] as string[],
    operators: [] as string[],
    facilities: [] as string[],
    availabilityOnly: false,
  })
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)

  // Load stations from database
  useEffect(() => {
    loadStations()
  }, [])

  // Apply user preferences as default filters
  useEffect(() => {
    if (preferences && !filters.connectorTypes.length && !filters.chargerTypes.length) {
      const newFilters = { ...filters }
      if (preferences.preferred_connector_type) {
        newFilters.connectorTypes = [preferences.preferred_connector_type]
      }
      if (preferences.preferred_charging_speed) {
        newFilters.chargerTypes = [preferences.preferred_charging_speed]
      }
      setFilters(newFilters)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences])

  // Apply filters and search
  useEffect(() => {
    let filtered = [...stations]

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (station) =>
          station.name.toLowerCase().includes(query) ||
          station.address.toLowerCase().includes(query) ||
          station.city.toLowerCase().includes(query) ||
          station.pincode.includes(query)
      )
    }

    // Connector type filter
    if (filters.connectorTypes.length > 0) {
      filtered = filtered.filter((station) =>
        station.connectors.some((connector) =>
          filters.connectorTypes.includes(connector.type)
        )
      )
    }

    // Charger type filter
    if (filters.chargerTypes.length > 0) {
      filtered = filtered.filter((station) =>
        station.charger_types.some((type) => filters.chargerTypes.includes(type))
      )
    }

    // Operator filter
    if (filters.operators.length > 0) {
      filtered = filtered.filter((station) =>
        filters.operators.includes(station.operator)
      )
    }

    // Facilities filter
    if (filters.facilities.length > 0) {
      filtered = filtered.filter((station) =>
        filters.facilities.every((facility) => station.facilities.includes(facility))
      )
    }

    // Availability filter
    if (filters.availabilityOnly) {
      filtered = filtered.filter((station) => station.availability_status === 'Available')
    }

    setFilteredStations(filtered)
  }, [stations, searchQuery, filters])

  const loadStations = async () => {
    try {
      const { data, error } = await supabase.from('stations').select('*')
      if (error) throw error
      setStations(data || [])
      setFilteredStations(data || [])
    } catch (error) {
      console.error('Error loading stations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please enable location services.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EV Charging Station Finder</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <span className="text-sm">Welcome, {user.email}</span>
            ) : (
              <a href="/login" className="text-sm underline">
                Login
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">
          <div className="p-4 space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onUseCurrentLocation={handleUseCurrentLocation}
            />
            <FilterPanel filters={filters} onFiltersChange={setFilters} stations={stations} />
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-lg">Loading stations...</div>
            </div>
          ) : (
            <MapView
              stations={filteredStations}
              selectedStation={selectedStation}
              onStationSelect={setSelectedStation}
              userLocation={userLocation}
            />
          )}
        </div>

        {/* Right Sidebar - Station Details */}
        {selectedStation && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <StationDetails
              station={selectedStation}
              userLocation={userLocation}
              onClose={() => setSelectedStation(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

