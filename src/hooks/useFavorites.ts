import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
      setFavorites([])
      setLoading(false)
    }
  }, [user])

  const loadFavorites = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('station_id')
        .eq('user_id', user.id)

      if (error) throw error
      setFavorites(data?.map((f) => f.station_id) || [])
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const isFavorite = (stationId: string): boolean => {
    return favorites.includes(stationId)
  }

  const toggleFavorite = async (stationId: string) => {
    if (!user) {
      alert('Please login to save favorites')
      return
    }

    const isCurrentlyFavorite = isFavorite(stationId)

    try {
      if (isCurrentlyFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('station_id', stationId)

        if (error) throw error
        setFavorites(favorites.filter((id) => id !== stationId))
      } else {
        // Add to favorites
        const { error } = await supabase.from('favorites').insert({
          user_id: user.id,
          station_id: stationId,
        })

        if (error) throw error
        setFavorites([...favorites, stationId])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Failed to update favorites')
    }
  }

  return { favorites, isFavorite, toggleFavorite, loading }
}

