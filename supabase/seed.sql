-- Seed script for initial station data
-- This should be run after the schema is created

-- Note: The connectors field is JSONB, so we need to format it as JSON
-- Example connector format: [{"type": "CCS2", "power_rating": 50, "available_ports": 2, "total_ports": 4}]

INSERT INTO stations (name, address, city, pincode, latitude, longitude, operator, connectors, charger_types, facilities, price_per_kwh, availability_status) VALUES
('Tata Power Charging Station - Connaught Place', 'Block A, Connaught Place', 'New Delhi', '110001', 28.6304, 77.2177, 'Tata Power', 
 '[{"type": "CCS2", "power_rating": 50, "available_ports": 2, "total_ports": 4}, {"type": "Type2", "power_rating": 22, "available_ports": 1, "total_ports": 2}]'::jsonb,
 ARRAY['DC', 'Fast'], ARRAY['Parking', 'Café', 'WiFi'], 8.5, 'Available'),

('Zeon Charging Hub - Bandra', 'Hill Road, Bandra West', 'Mumbai', '400050', 19.0596, 72.8295, 'Zeon',
 '[{"type": "CCS2", "power_rating": 150, "available_ports": 1, "total_ports": 2}, {"type": "CHAdeMO", "power_rating": 50, "available_ports": 0, "total_ports": 1}]'::jsonb,
 ARRAY['DC', 'Ultra-Fast'], ARRAY['Parking', 'Restrooms', 'WiFi'], 12.0, 'Busy'),

('Statiq Charging Point - Koramangala', '5th Block, Koramangala', 'Bangalore', '560095', 12.9352, 77.6245, 'Statiq',
 '[{"type": "Type2", "power_rating": 22, "available_ports": 3, "total_ports": 4}, {"type": "CCS2", "power_rating": 50, "available_ports": 1, "total_ports": 2}]'::jsonb,
 ARRAY['AC', 'DC'], ARRAY['Parking', 'Café', 'Restrooms', 'WiFi'], 9.0, 'Available'),

('Tata Power EV Station - Salt Lake', 'Sector V, Salt Lake', 'Kolkata', '700091', 22.5726, 88.3639, 'Tata Power',
 '[{"type": "CCS2", "power_rating": 50, "available_ports": 0, "total_ports": 2}, {"type": "Type2", "power_rating": 22, "available_ports": 2, "total_ports": 3}]'::jsonb,
 ARRAY['AC', 'DC'], ARRAY['Parking', 'WiFi'], 8.0, 'Offline'),

('Zeon Fast Charging - Hitech City', 'Hitech City Main Road', 'Hyderabad', '500081', 17.4486, 78.3908, 'Zeon',
 '[{"type": "CCS2", "power_rating": 150, "available_ports": 2, "total_ports": 3}, {"type": "GB/T", "power_rating": 60, "available_ports": 1, "total_ports": 2}]'::jsonb,
 ARRAY['DC', 'Ultra-Fast'], ARRAY['Parking', 'Café', 'Restrooms', 'WiFi'], 11.5, 'Available'),

('Statiq Charging Hub - Baner', 'Baner Road, Baner', 'Pune', '411045', 18.5596, 73.7864, 'Statiq',
 '[{"type": "Type2", "power_rating": 22, "available_ports": 2, "total_ports": 4}, {"type": "CCS2", "power_rating": 50, "available_ports": 1, "total_ports": 2}]'::jsonb,
 ARRAY['AC', 'DC'], ARRAY['Parking', 'Restrooms'], 9.5, 'Available'),

('Tata Power Station - Adyar', 'Adyar Main Road', 'Chennai', '600020', 13.0067, 80.2206, 'Tata Power',
 '[{"type": "CCS2", "power_rating": 50, "available_ports": 1, "total_ports": 3}, {"type": "CHAdeMO", "power_rating": 50, "available_ports": 0, "total_ports": 1}]'::jsonb,
 ARRAY['DC', 'Fast'], ARRAY['Parking', 'Café', 'WiFi'], 8.5, 'Busy'),

('Zeon Ultra-Fast Charging - Gurgaon', 'DLF Cyber City, Gurgaon', 'Gurgaon', '122002', 28.4962, 77.0940, 'Zeon',
 '[{"type": "CCS2", "power_rating": 150, "available_ports": 2, "total_ports": 4}, {"type": "Type2", "power_rating": 22, "available_ports": 1, "total_ports": 2}]'::jsonb,
 ARRAY['DC', 'Ultra-Fast'], ARRAY['Parking', 'Café', 'Restrooms', 'WiFi'], 13.0, 'Available'),

('Statiq Charging Point - Sector 18', 'Sector 18, Noida', 'Noida', '201301', 28.5937, 77.3214, 'Statiq',
 '[{"type": "Type2", "power_rating": 22, "available_ports": 3, "total_ports": 4}, {"type": "CCS2", "power_rating": 50, "available_ports": 0, "total_ports": 2}]'::jsonb,
 ARRAY['AC', 'DC'], ARRAY['Parking', 'WiFi'], 9.0, 'Available'),

('Tata Power EV Hub - Whitefield', 'Whitefield Main Road', 'Bangalore', '560066', 12.9698, 77.7499, 'Tata Power',
 '[{"type": "CCS2", "power_rating": 50, "available_ports": 2, "total_ports": 3}, {"type": "Type2", "power_rating": 22, "available_ports": 2, "total_ports": 3}]'::jsonb,
 ARRAY['AC', 'DC', 'Fast'], ARRAY['Parking', 'Café', 'Restrooms', 'WiFi'], 8.5, 'Available'),

('Zeon Charging Station - Andheri', 'Andheri West, SV Road', 'Mumbai', '400053', 19.1136, 72.8297, 'Zeon',
 '[{"type": "CCS2", "power_rating": 150, "available_ports": 1, "total_ports": 2}, {"type": "CHAdeMO", "power_rating": 50, "available_ports": 1, "total_ports": 1}]'::jsonb,
 ARRAY['DC', 'Ultra-Fast'], ARRAY['Parking', 'Restrooms', 'WiFi'], 12.0, 'Busy'),

('Statiq Fast Charging - Vasant Kunj', 'Vasant Kunj, New Delhi', 'New Delhi', '110070', 28.5245, 77.1555, 'Statiq',
 '[{"type": "Type2", "power_rating": 22, "available_ports": 2, "total_ports": 4}, {"type": "CCS2", "power_rating": 50, "available_ports": 2, "total_ports": 3}]'::jsonb,
 ARRAY['AC', 'DC'], ARRAY['Parking', 'Café', 'WiFi'], 9.5, 'Available'),

('Tata Power Station - Powai', 'Powai Lake Road', 'Mumbai', '400076', 19.1176, 72.9067, 'Tata Power',
 '[{"type": "CCS2", "power_rating": 50, "available_ports": 1, "total_ports": 2}, {"type": "Type2", "power_rating": 22, "available_ports": 1, "total_ports": 2}]'::jsonb,
 ARRAY['AC', 'DC'], ARRAY['Parking', 'WiFi'], 8.5, 'Available'),

('Zeon Charging Hub - Indiranagar', '100 Feet Road, Indiranagar', 'Bangalore', '560038', 12.9784, 77.6408, 'Zeon',
 '[{"type": "CCS2", "power_rating": 150, "available_ports": 2, "total_ports": 3}, {"type": "Type2", "power_rating": 22, "available_ports": 2, "total_ports": 3}]'::jsonb,
 ARRAY['DC', 'Ultra-Fast'], ARRAY['Parking', 'Café', 'Restrooms', 'WiFi'], 12.5, 'Available'),

('Statiq Charging Point - Jubilee Hills', 'Jubilee Hills, Road No. 36', 'Hyderabad', '500033', 17.4332, 78.4011, 'Statiq',
 '[{"type": "Type2", "power_rating": 22, "available_ports": 3, "total_ports": 4}, {"type": "CCS2", "power_rating": 50, "available_ports": 1, "total_ports": 2}]'::jsonb,
 ARRAY['AC', 'DC'], ARRAY['Parking', 'Restrooms', 'WiFi'], 9.0, 'Available'),

('Tata Power EV Station - Sector 29', 'Sector 29, Gurgaon', 'Gurgaon', '122001', 28.4595, 77.0266, 'Tata Power',
 '[{"type": "CCS2", "power_rating": 50, "available_ports": 0, "total_ports": 2}, {"type": "Type2", "power_rating": 22, "available_ports": 1, "total_ports": 2}]'::jsonb,
 ARRAY['AC', 'DC'], ARRAY['Parking', 'WiFi'], 8.5, 'Offline'),

('Zeon Fast Charging - Wakad', 'Wakad Main Road', 'Pune', '411057', 18.5993, 73.7629, 'Zeon',
 '[{"type": "CCS2", "power_rating": 150, "available_ports": 1, "total_ports": 2}, {"type": "GB/T", "power_rating": 60, "available_ports": 1, "total_ports": 1}]'::jsonb,
 ARRAY['DC', 'Ultra-Fast'], ARRAY['Parking', 'Café', 'Restrooms', 'WiFi'], 11.5, 'Available'),

('Statiq Charging Hub - T Nagar', 'Pondy Bazaar, T Nagar', 'Chennai', '600017', 13.0418, 80.2341, 'Statiq',
 '[{"type": "Type2", "power_rating": 22, "available_ports": 2, "total_ports": 4}, {"type": "CCS2", "power_rating": 50, "available_ports": 1, "total_ports": 2}]'::jsonb,
 ARRAY['AC', 'DC'], ARRAY['Parking', 'Café', 'WiFi'], 9.0, 'Available'),

('Tata Power Station - Salt Lake Sector 1', 'Sector 1, Salt Lake', 'Kolkata', '700064', 22.5749, 88.4058, 'Tata Power',
 '[{"type": "CCS2", "power_rating": 50, "available_ports": 2, "total_ports": 3}, {"type": "Type2", "power_rating": 22, "available_ports": 2, "total_ports": 3}]'::jsonb,
 ARRAY['AC', 'DC', 'Fast'], ARRAY['Parking', 'Café', 'Restrooms', 'WiFi'], 8.5, 'Available'),

('Zeon Ultra-Fast Hub - Connaught Place', 'Block B, Connaught Place', 'New Delhi', '110001', 28.6328, 77.2197, 'Zeon',
 '[{"type": "CCS2", "power_rating": 150, "available_ports": 3, "total_ports": 4}, {"type": "Type2", "power_rating": 22, "available_ports": 2, "total_ports": 3}]'::jsonb,
 ARRAY['DC', 'Ultra-Fast'], ARRAY['Parking', 'Café', 'Restrooms', 'WiFi'], 13.0, 'Available');

