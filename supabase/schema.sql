-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  operator TEXT NOT NULL,
  connectors JSONB NOT NULL, -- Array of connector objects
  charger_types TEXT[] NOT NULL, -- Array of charger types: AC, DC, Fast, Ultra-Fast
  facilities TEXT[] NOT NULL, -- Array of facilities: Parking, Café, Restrooms, WiFi
  price_per_kwh DECIMAL(10, 2) NOT NULL,
  availability_status TEXT NOT NULL CHECK (availability_status IN ('Available', 'Busy', 'Offline')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_connector_type TEXT CHECK (preferred_connector_type IN ('CCS2', 'Type2', 'CHAdeMO', 'GB/T')),
  preferred_charging_speed TEXT CHECK (preferred_charging_speed IN ('AC', 'DC', 'Fast', 'Ultra-Fast')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, station_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stations_location ON stations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_stations_city ON stations(city);
CREATE INDEX IF NOT EXISTS idx_stations_operator ON stations(operator);
CREATE INDEX IF NOT EXISTS idx_stations_status ON stations(availability_status);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_station ON favorites(station_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stations (public read access)
CREATE POLICY "Stations are viewable by everyone" ON stations
  FOR SELECT USING (true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_stations_updated_at BEFORE UPDATE ON stations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

