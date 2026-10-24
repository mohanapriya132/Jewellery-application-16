import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-obsidian text-champagne">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-gold-light tracking-widest2 mb-8">MY PROFILE</h1>
        
        {user ? (
          <div className="bg-obsidian-light border border-gold/10 p-8">
            <h2 className="text-xl text-gold tracking-widest uppercase mb-4">Account Details</h2>
            <div className="space-y-4 font-body">
              <p><span className="text-champagne/60 mr-2">Name:</span> {user.user_metadata?.name || 'N/A'}</p>
              <p><span className="text-champagne/60 mr-2">Email:</span> {user.email}</p>
            </div>
          </div>
        ) : (
          <p className="animate-pulse">Loading profile...</p>
        )}
      </div>
    </div>
  )
}
