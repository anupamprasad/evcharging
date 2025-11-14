import { Station, ConnectorType, ChargerType } from '../types/database'

interface FilterPanelProps {
  filters: {
    connectorTypes: string[]
    chargerTypes: string[]
    operators: string[]
    facilities: string[]
    availabilityOnly: boolean
  }
  onFiltersChange: (filters: FilterPanelProps['filters']) => void
  stations: Station[]
}

export default function FilterPanel({ filters, onFiltersChange, stations }: FilterPanelProps) {
  // Get unique values from stations
  const allOperators = Array.from(new Set(stations.map((s) => s.operator))).sort()
  const allFacilities = Array.from(
    new Set(stations.flatMap((s) => s.facilities))
  ).sort()

  const connectorTypes: ConnectorType[] = ['CCS2', 'Type2', 'CHAdeMO', 'GB/T']
  const chargerTypes: ChargerType[] = ['AC', 'DC', 'Fast', 'Ultra-Fast']

  const toggleFilter = (
    category: keyof FilterPanelProps['filters'],
    value: string
  ) => {
    const currentValues = filters[category] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    onFiltersChange({ ...filters, [category]: newValues })
  }

  const toggleAvailability = () => {
    onFiltersChange({ ...filters, availabilityOnly: !filters.availabilityOnly })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Filters</h3>

      {/* Connector Types */}
      <div>
        <h4 className="text-sm font-medium mb-2">Connector Type</h4>
        <div className="space-y-1">
          {connectorTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.connectorTypes.includes(type)}
                onChange={() => toggleFilter('connectorTypes', type)}
                className="mr-2"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Charger Types */}
      <div>
        <h4 className="text-sm font-medium mb-2">Charger Type</h4>
        <div className="space-y-1">
          {chargerTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.chargerTypes.includes(type)}
                onChange={() => toggleFilter('chargerTypes', type)}
                className="mr-2"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Operators */}
      <div>
        <h4 className="text-sm font-medium mb-2">Network/Operator</h4>
        <div className="space-y-1">
          {allOperators.map((operator) => (
            <label key={operator} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.operators.includes(operator)}
                onChange={() => toggleFilter('operators', operator)}
                className="mr-2"
              />
              <span className="text-sm">{operator}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Facilities */}
      <div>
        <h4 className="text-sm font-medium mb-2">Facilities</h4>
        <div className="space-y-1">
          {allFacilities.map((facility) => (
            <label key={facility} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.facilities.includes(facility)}
                onChange={() => toggleFilter('facilities', facility)}
                className="mr-2"
              />
              <span className="text-sm">{facility}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.availabilityOnly}
            onChange={toggleAvailability}
            className="mr-2"
          />
          <span className="text-sm font-medium">Show only available stations</span>
        </label>
      </div>

      {/* Clear Filters */}
      {(filters.connectorTypes.length > 0 ||
        filters.chargerTypes.length > 0 ||
        filters.operators.length > 0 ||
        filters.facilities.length > 0 ||
        filters.availabilityOnly) && (
        <button
          onClick={() =>
            onFiltersChange({
              connectorTypes: [],
              chargerTypes: [],
              operators: [],
              facilities: [],
              availabilityOnly: false,
            })
          }
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 text-sm"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}

