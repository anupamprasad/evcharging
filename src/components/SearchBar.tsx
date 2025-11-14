interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onUseCurrentLocation: () => void
}

export default function SearchBar({ value, onChange, onUseCurrentLocation }: SearchBarProps) {
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
          >
            ✕
          </button>
        )}
      </div>
      <button
        onClick={onUseCurrentLocation}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm"
      >
        📍 Use Current Location
      </button>
    </div>
  )
}

