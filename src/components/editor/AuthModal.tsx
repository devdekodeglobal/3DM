import React, { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { X, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!email || !password) {
      setErrorMsg('Please fill in all fields.')
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        
        if (data.user && data.session) {
          // Automatic login upon sign up if auto-confirm is enabled
          setSuccessMsg('Account created and logged in successfully!')
          setTimeout(() => {
            onSuccess?.()
            onClose()
          }, 1500)
        } else {
          setSuccessMsg('Sign-up successful! Please check your email inbox for a verification link.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        setSuccessMsg('Welcome back! Logged in successfully.')
        setTimeout(() => {
          onSuccess?.()
          onClose()
        }, 1500)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setErrorMsg(err.message || 'An error occurred during authentication.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleOAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/editor'
        }
      })
      if (error) throw error
    } catch (err: any) {
      console.error('Google OAuth error:', err)
      setErrorMsg(err.message || 'Failed to authenticate with Google.')
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Card with premium glassmorphism */}
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl transition-all"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}
      >
        {/* Glow Orb background */}
        <div className="absolute -top-24 -left-24 -z-10 h-48 w-48 rounded-full bg-[var(--brand)] opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 -z-10 h-48 w-48 rounded-full bg-[var(--accent)] opacity-20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-[Outfit] text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-white/60 mt-1">
            {isSignUp ? 'Register to save your 3D designs to the cloud' : 'Log in to sync and load your custom booths'}
          </p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleOAuth}
          className="w-full bg-white text-black font-bold py-2.5 px-4 rounded-lg text-sm transition flex items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer shadow-md mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">or</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black tracking-wider uppercase text-white/70 block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black tracking-wider uppercase text-white/70 block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition"
              />
            </div>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--lagoon-deep)] hover:bg-[var(--palm)] text-white font-bold py-2.5 px-4 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-55 cursor-pointer shadow-md mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              isSignUp ? 'Register Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Tab Toggle Footer */}
        <div className="border-t border-white/10 mt-6 pt-4 text-center">
          <p className="text-xs text-white/60">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setErrorMsg(null)
                setSuccessMsg(null)
              }}
              className="text-[var(--brand)] hover:underline font-bold focus:outline-none cursor-pointer"
            >
              {isSignUp ? 'Log In' : 'Sign Up Free'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
