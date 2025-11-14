import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { UserProfile, ConnectorType, ChargerType } from '../types/database'

export function useUserPreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadPreferences()
    } else {
      setPreferences(null)
      setLoading(false)
    }
  }, [user])

  const loadPreferences = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is okay
        throw error
      }

      setPreferences(data || null)
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async (
    connectorType: ConnectorType | null,
    chargingSpeed: ChargerType | null
  ) => {
    if (!user) {
      alert('Please login to save preferences')
      return
    }

    try {
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      const preferencesData = {
        user_id: user.id,
        preferred_connector_type: connectorType,
        preferred_charging_speed: chargingSpeed,
      }

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('user_profiles')
          .update(preferencesData)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase.from('user_profiles').insert(preferencesData)

        if (error) throw error
      }

      await loadPreferences()
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Failed to save preferences')
    }
  }

  return { preferences, savePreferences, loading }
}

