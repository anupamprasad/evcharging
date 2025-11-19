interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onUseCurrentLocation: () => void
  locationLoading?: boolean
  locationError?: string | null
  showNearMeOnly?: boolean
  onToggleNearMe?: (enabled: boolean) => void
  userLocation?: { lat: number; lng: number } | null
}

export default function SearchBar({ 
  value, 
  onChange, 
  onUseCurrentLocation,
  locationLoading = false,
  locationError = null,
  showNearMeOnly = false,
  onToggleNearMe,
  userLocation,
}: SearchBarProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by city, address, or PIN code..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      
      <button
        onClick={onUseCurrentLocation}
        disabled={locationLoading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
      >
        {locationLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>Getting location...</span>
          </>
        ) : (
          <>
            <span>📍</span>
            <span>Use Current Location</span>
          </>
        )}
      </button>

      {locationError && (
        <div className="text-red-600 text-xs bg-red-50 p-2 rounded border border-red-200">
          {locationError}
        </div>
      )}

      {userLocation && onToggleNearMe && (
        <label className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200 cursor-pointer hover:bg-blue-100">
          <input
            type="checkbox"
            checked={showNearMeOnly}
            onChange={(e) => onToggleNearMe(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Show stations within 50km
          </span>
        </label>
      )}
    </div>
  )
}

