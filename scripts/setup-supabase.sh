#!/bin/bash

# Supabase Setup Script
# This script helps you set up Supabase for the EV Charging Station Finder project

echo "🚀 Supabase Setup for EV Charging Station Finder"
echo "================================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created!"
    else
        echo "⚠️  .env.example not found. Creating basic .env file..."
        cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Mapbox Configuration
VITE_MAPBOX_TOKEN=your_mapbox_access_token
EOF
        echo "✅ Basic .env file created!"
    fi
    echo ""
    echo "⚠️  Please edit .env file and add your Supabase credentials:"
    echo "   1. VITE_SUPABASE_URL - Your Supabase project URL"
    echo "   2. VITE_SUPABASE_ANON_KEY - Your Supabase anon key"
    echo "   3. VITE_MAPBOX_TOKEN - Your Mapbox access token"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if Supabase credentials are set
if grep -q "your_supabase_project_url" .env 2>/dev/null; then
    echo "⚠️  Supabase credentials not configured in .env file"
    echo "   Please update .env with your Supabase project URL and anon key"
    echo ""
fi

echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Get your credentials from Settings → API"
echo "3. Update .env file with your credentials"
echo "4. Run the database schema:"
echo "   - Go to Supabase Dashboard → SQL Editor"
echo "   - Copy and paste contents of supabase/schema.sql"
echo "   - Click 'Run'"
echo "5. (Optional) Seed the database:"
echo "   - In SQL Editor, paste contents of supabase/seed.sql"
echo "   - Click 'Run'"
echo ""
echo "📚 For detailed instructions, see docs/SUPABASE_SETUP.md"
echo ""

