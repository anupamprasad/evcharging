import { Station } from '../types/database'
import { calculateDistance } from '../utils/distance'
import { useAuth } from '../contexts/AuthContext'
import { useFavorites } from '../hooks/useFavorites'

interface StationDetailsProps {
  station: Station
  userLocation: { lat: number; lng: number } | null
  onClose: () => void
}

export default function StationDetails({
  station,
  userLocation,
  onClose,
}: StationDetailsProps) {
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()

  const distance = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        station.latitude,
        station.longitude
      )
    : null

  const favorite = isFavorite(station.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500'
      case 'Busy':
        return 'bg-yellow-500'
      case 'Offline':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-1">{station.name}</h2>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${getStatusColor(
                station.availability_status
              )}`}
            ></span>
            <span className="text-sm text-gray-600">{station.availability_status}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Address */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Address</h3>
          <p className="text-sm text-gray-600">
            {station.address}, {station.city} - {station.pincode}
          </p>
        </div>

        {/* Distance */}
        {distance !== null && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Distance</h3>
            <p className="text-sm text-gray-600">{distance.toFixed(2)} km away</p>
          </div>
        )}

        {/* Operator */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Operator</h3>
          <p className="text-sm text-gray-600">{station.operator}</p>
        </div>

        {/* Connectors */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Connectors</h3>
          <div className="space-y-2">
            {station.connectors.map((connector, index) => (
              <div
                key={index}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{connector.type}</span>
                  <span className="text-sm text-gray-600">{connector.power_rating} kW</span>
                </div>
                <div className="text-xs text-gray-600">
                  {connector.available_ports} of {connector.total_ports} ports available
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charger Types */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Charger Types</h3>
          <div className="flex flex-wrap gap-2">
            {station.charger_types.map((type) => (
              <span
                key={type}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Price</h3>
          <p className="text-sm text-gray-600">₹{station.price_per_kwh} per kWh</p>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {station.facilities.map((facility) => (
              <span
                key={facility}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>

        {/* Estimated Waiting Time (Simulated) */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Estimated Waiting Time
          </h3>
          <p className="text-sm text-gray-600">
            {station.availability_status === 'Available'
              ? '0-5 minutes'
              : station.availability_status === 'Busy'
              ? '15-30 minutes'
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Actions */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => toggleFavorite(station.id)}
            className={`w-full py-2 px-4 rounded-md ${
              favorite
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {favorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
          </button>
        </div>
      )}
    </div>
  )
}

