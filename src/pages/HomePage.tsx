import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import MapView from '../components/MapView'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import StationDetails from '../components/StationDetails'
import { Station } from '../types/database'
import { supabase } from '../lib/supabase'
import { useUserPreferences } from '../hooks/useUserPreferences'
import { calculateDistance } from '../utils/distance'

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
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showNearMeOnly, setShowNearMeOnly] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

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

    // Near Me filter (show stations within 50km radius)
    if (showNearMeOnly && userLocation) {
      filtered = filtered.filter((station) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          station.latitude,
          station.longitude
        )
        return distance <= 50 // 50km radius
      })
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
  }, [stations, searchQuery, filters, showNearMeOnly, userLocation])

  const loadStations = async () => {
    try {
      setLoadError(null)
      console.log('Loading stations from Supabase...')
      
      const { data, error } = await supabase.from('stations').select('*')
      
      if (error) {
        console.error('Supabase error:', error)
        setLoadError(`Failed to load stations: ${error.message}`)
        throw error
      }
      
      console.log(`Loaded ${data?.length || 0} stations from database`)
      
      if (!data || data.length === 0) {
        setLoadError('No stations found in database. Please run the seed script in Supabase.')
        console.warn('No stations found in database')
      }
      
      setStations(data || [])
      setFilteredStations(data || [])
    } catch (error: any) {
      console.error('Error loading stations:', error)
      setLoadError(error?.message || 'Failed to load stations. Please check your Supabase connection.')
      // Set empty arrays to prevent crashes
      setStations([])
      setFilteredStations([])
    } finally {
      setLoading(false)
    }
  }

  const handleUseCurrentLocation = () => {
    setLocationError(null)
    setLocationLoading(true)
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(location)
        setLocationLoading(false)
        setShowNearMeOnly(true) // Automatically enable "Near Me" filter
      },
      (error) => {
        console.error('Error getting location:', error)
        let errorMessage = 'Unable to get your location.'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
        }
        
        setLocationError(errorMessage)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">EV Charging Station Finder</h1>
            {!loading && (
              <p className="text-xs text-blue-100 mt-1">
                {stations.length} station{stations.length !== 1 ? 's' : ''} available
                {filteredStations.length !== stations.length && (
                  <span className="ml-2">
                    ({filteredStations.length} shown)
                  </span>
                )}
              </p>
            )}
          </div>
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
              locationLoading={locationLoading}
              locationError={locationError}
              showNearMeOnly={showNearMeOnly}
              onToggleNearMe={setShowNearMeOnly}
              userLocation={userLocation}
            />
            <FilterPanel filters={filters} onFiltersChange={setFilters} stations={stations} />
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="text-lg mb-2">Loading stations...</div>
                <div className="text-sm text-gray-500">Fetching data from database</div>
              </div>
            </div>
          ) : loadError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
                <p className="text-lg text-red-600 mb-2 font-semibold">Error Loading Stations</p>
                <p className="text-sm text-gray-600 mb-4">{loadError}</p>
                <button
                  onClick={loadStations}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Retry
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Make sure you've run the schema and seed SQL in your Supabase dashboard
                </p>
              </div>
            </div>
          ) : stations.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
                <p className="text-lg text-gray-600 mb-2 font-semibold">No Stations in Database</p>
                <p className="text-sm text-gray-500 mb-4">
                  The database appears to be empty. Please seed the database with station data.
                </p>
                <p className="text-xs text-gray-400">
                  Run the seed.sql script in your Supabase SQL Editor
                </p>
              </div>
            </div>
          ) : filteredStations.length > 0 ? (
            <MapView
              stations={filteredStations}
              selectedStation={selectedStation}
              onStationSelect={setSelectedStation}
              userLocation={userLocation}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
                <p className="text-lg text-gray-600 mb-2 font-semibold">No stations found</p>
                <p className="text-sm text-gray-500 mb-4">
                  {stations.length} station(s) in database, but none match your current filters
                </p>
                <div className="space-y-2 text-left text-xs text-gray-400">
                  <p>Try:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Clearing your search query</li>
                    <li>Disabling "Show stations within 50km" if enabled</li>
                    <li>Adjusting your filters</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowNearMeOnly(false)
                    setFilters({
                      connectorTypes: [],
                      chargerTypes: [],
                      operators: [],
                      facilities: [],
                      availabilityOnly: false,
                    })
                  }}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
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

