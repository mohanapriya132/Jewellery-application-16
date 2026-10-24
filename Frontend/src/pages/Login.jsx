import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      navigate('/')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 bg-obsidian flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-obsidian-light p-8 rounded-lg shadow-2xl border border-gold/10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display text-gold-light font-light tracking-widest2">LOGIN</h2>
          <p className="text-champagne/70 mt-2 font-body text-sm">Welcome back</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 mb-6 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-champagne text-xs uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-transparent border-b border-gold/30 px-3 py-2 text-champagne focus:outline-none focus:border-gold-light transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-champagne text-xs uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full bg-transparent border-b border-gold/30 px-3 py-2 text-champagne focus:outline-none focus:border-gold-light transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-gold/50 text-gold-light text-sm tracking-widest uppercase py-3 mt-4 hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-champagne/70 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-gold hover:text-gold-light transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
