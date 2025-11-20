import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; requiresConfirmation?: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session with error handling
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to get session:', error)
        setLoading(false)
      })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting to sign in with email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('❌ Sign in error:', error)
        console.error('Error code:', error.status, error.message)
        return { error }
      }
      
      console.log('✅ Sign in successful, user:', data.user?.email)
      // Session is automatically updated via onAuthStateChange
      return { error: null }
    } catch (err: any) {
      console.error('❌ Sign in exception:', err)
      return { 
        error: { 
          message: err.message || 'An unexpected error occurred during sign in' 
        } 
      }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      console.log('📝 Attempting to sign up with email:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      })
      
      if (error) {
        console.error('❌ Sign up error:', error)
        console.error('Error code:', error.status, error.message)
        return { error }
      }
      
      console.log('✅ Sign up successful, user created:', data.user?.email)
      console.log('Session available:', !!data.session)
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('📧 Email confirmation required')
        // Email confirmation required
        return { 
          error: null,
          requiresConfirmation: true 
        }
      }
      
      console.log('✅ User signed up and logged in automatically')
      return { error: null }
    } catch (err: any) {
      console.error('❌ Sign up exception:', err)
      return { 
        error: { 
          message: err.message || 'An unexpected error occurred during sign up' 
        } 
      }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
    } catch (err: any) {
      console.error('Sign out exception:', err)
      // Even if sign out fails, clear local state
      setSession(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

