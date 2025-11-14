export type AvailabilityStatus = 'Available' | 'Busy' | 'Offline'

export type ConnectorType = 'CCS2' | 'Type2' | 'CHAdeMO' | 'GB/T'

export type ChargerType = 'AC' | 'DC' | 'Fast' | 'Ultra-Fast'

export interface Connector {
  type: ConnectorType
  power_rating: number // in kW
  available_ports: number
  total_ports: number
}

export interface Station {
  id: string
  name: string
  address: string
  city: string
  pincode: string
  latitude: number
  longitude: number
  operator: string
  connectors: Connector[]
  charger_types: ChargerType[]
  facilities: string[] // e.g., ['Parking', 'Café', 'Restrooms', 'WiFi']
  price_per_kwh: number
  availability_status: AvailabilityStatus
  created_at?: string
  updated_at?: string
}

export interface UserProfile {
  id: string
  user_id: string
  preferred_connector_type: ConnectorType | null
  preferred_charging_speed: ChargerType | null
  created_at?: string
  updated_at?: string
}

export interface Favorite {
  id: string
  user_id: string
  station_id: string
  created_at?: string
  station?: Station
}

