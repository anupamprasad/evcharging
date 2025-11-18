#!/bin/bash

# Fix Supabase URL in .env file
# The URL should be: https://PROJECT_ID.supabase.co
# Not: https://supabase.com/dashboard/project/PROJECT_ID

if [ ! -f .env ]; then
    echo "❌ .env file not found"
    exit 1
fi

# Extract project ID from current URL
CURRENT_URL=$(grep "VITE_SUPABASE_URL" .env | cut -d'=' -f2)
PROJECT_ID=$(echo "$CURRENT_URL" | grep -oP 'project/\K[^/]+' || echo "")

if [ -z "$PROJECT_ID" ]; then
    echo "⚠️  Could not extract project ID from current URL"
    echo "   Current URL: $CURRENT_URL"
    echo ""
    echo "   Please update .env manually:"
    echo "   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co"
    exit 1
fi

# Create correct URL
CORRECT_URL="https://${PROJECT_ID}.supabase.co"

# Update .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=${CORRECT_URL}|" .env
else
    # Linux
    sed -i "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=${CORRECT_URL}|" .env
fi

echo "✅ Fixed Supabase URL in .env"
echo "   Old: $CURRENT_URL"
echo "   New: $CORRECT_URL"
echo ""

