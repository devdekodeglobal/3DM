import React, { useState, useEffect } from 'react'
import {
  signUpWithEmail,
  signInWithEmail,
  verifyOtp,
  signInWithGoogle,
  requestPasswordReset,
  resetPassword,
} from '../../lib/authClient'
import { X, Mail, Lock, Loader2, AlertCircle, CheckCircle, KeyRound, ArrowLeft } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  redirectTo?: string | null
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isOtpStep, setIsOtpStep] = useState(false)
  
  // Password Reset Flow States
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isResetConfirmStep, setIsResetConfirmStep] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Reset to default "Sign In" mode whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSignUp(false)
      setIsOtpStep(false)
      setIsForgotPassword(false)
      setIsResetConfirmStep(false)
      setOtpCode('')
      setPassword('')
      setNewPassword('')
      setErrorMsg(null)
      setSuccessMsg(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const resetAllStates = () => {
    setErrorMsg(null)
    setSuccessMsg(null)
    setOtpCode('')
    setPassword('')
    setNewPassword('')
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      if (isForgotPassword) {
        if (isResetConfirmStep) {
          if (!email || !otpCode || !newPassword) {
            setErrorMsg('Please enter your email, verification code, and new password.')
            return
          }
          await resetPassword(email, otpCode, newPassword)
          setSuccessMsg('Password reset successfully! You can now log in with your new password.')
          setTimeout(() => {
            setIsForgotPassword(false)
            setIsResetConfirmStep(false)
            resetAllStates()
          }, 2000)
        } else {
          if (!email) {
            setErrorMsg('Please enter your email address.')
            return
          }
          const res = await requestPasswordReset(email)
          setSuccessMsg(res.message || 'Reset code sent! Check your inbox.')
          setIsResetConfirmStep(true)
        }
      } else if (isOtpStep) {
        if (!otpCode) {
          setErrorMsg('Please enter the verification code.')
          return
        }
        await verifyOtp(email, otpCode)
        setSuccessMsg('Email verified! Signing you in…')
        // Auto-login: backend sets session cookie on OTP verify, so close modal and mark success
        setTimeout(() => {
          onSuccess?.()
          onClose()
        }, 1200)
      } else if (isSignUp) {
        if (!email || !password) {
          setErrorMsg('Please fill in all fields.')
          return
        }
        await signUpWithEmail(email, password)
        setSuccessMsg('Sign-up successful! Please check your email for the verification code.')
        setIsOtpStep(true)
      } else {
        if (!email || !password) {
          setErrorMsg('Please fill in all fields.')
          return
        }
        await signInWithEmail(email, password)
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

  const handleGoogleOAuth = () => {
    (window as any).isAuthRedirect = true;
    signInWithGoogle()
  }

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Modal Card with adaptive light/dark styling and increased sizing */}
      <div 
        className="relative w-full max-w-[540px] overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/15 bg-[var(--bg-card)] dark:bg-[#16181d] backdrop-blur-2xl p-8 sm:p-9 shadow-2xl transition-all text-[var(--fg)] dark:text-white"
        style={{
          boxShadow: '0 20px 50px 0 rgba(0, 0, 0, 0.45)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Orb background */}
        <div className="absolute -top-24 -left-24 -z-10 h-56 w-56 rounded-full bg-[var(--brand)] opacity-15 dark:opacity-25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 -z-10 h-56 w-56 rounded-full bg-[var(--accent)] opacity-15 dark:opacity-25 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--fg-soft)] dark:text-white/80 hover:text-[var(--fg)] dark:hover:text-white hover:bg-[var(--bg-subtle)] dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Back Button for Forgot Password Flow */}
        {isForgotPassword && (
          <button
            onClick={() => {
              if (isResetConfirmStep) {
                setIsResetConfirmStep(false)
              } else {
                setIsForgotPassword(false)
              }
              resetAllStates()
            }}
            className="absolute top-5 left-5 p-2 rounded-full text-[var(--fg-soft)] dark:text-white/80 hover:text-[var(--fg)] dark:hover:text-white hover:bg-[var(--bg-subtle)] dark:hover:bg-white/10 transition flex items-center gap-1 text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-7 mt-1">
          <h2 className="text-3xl font-bold font-[Outfit] text-[var(--fg)] dark:text-white tracking-tight">
            {isForgotPassword
              ? isResetConfirmStep ? 'Set New Password' : 'Reset Password'
              : isOtpStep ? 'Verify Email' : isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-[var(--fg-soft)] dark:text-white/70 mt-2 font-medium">
            {isForgotPassword
              ? isResetConfirmStep
                ? `Enter the 6-digit code sent to ${email} and your new password`
                : 'Enter your email to receive a secure password reset code'
              : isOtpStep
                ? `Enter the 6-digit code sent to ${email}`
                : isSignUp
                  ? 'Register to save your 3D designs to the cloud'
                  : 'Log in to sync and load your custom spaces'}
          </p>
        </div>

        {!isOtpStep && !isForgotPassword && (
          <>
            {/* Google OAuth */}
            <button
              onClick={handleGoogleOAuth}
              className="w-full bg-[var(--surface-strong)] dark:bg-white text-[var(--fg)] dark:text-black border border-[var(--line)] dark:border-transparent font-bold py-3.5 px-4 rounded-xl text-base transition flex items-center justify-center gap-3 hover:bg-[var(--sand)] dark:hover:bg-gray-100 cursor-pointer shadow-sm mb-5"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-[var(--line)] dark:bg-white/10"></div>
              <span className="text-xs text-[var(--fg-dim)] dark:text-white/40 font-bold uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-[var(--line)] dark:bg-white/10"></div>
            </div>
          </>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {/* Email Field */}
          {(!isOtpStep && !isResetConfirmStep) && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider uppercase text-[var(--fg-soft)] dark:text-white/70 block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--fg-dim)] dark:text-white/40 pointer-events-none">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[var(--surface-light)] dark:bg-white/5 border border-[var(--border)] dark:border-white/15 text-[var(--fg)] dark:text-white rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition placeholder:text-[var(--fg-dim)] dark:placeholder:text-white/30"
                />
              </div>
            </div>
          )}

          {/* Password Field (for Sign In & Sign Up) */}
          {(!isOtpStep && !isForgotPassword) && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-wider uppercase text-[var(--fg-soft)] dark:text-white/70 block">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true)
                      resetAllStates()
                    }}
                    className="text-xs text-[var(--brand)] hover:underline font-bold focus:outline-none cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--fg-dim)] dark:text-white/40 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--surface-light)] dark:bg-white/5 border border-[var(--border)] dark:border-white/15 text-[var(--fg)] dark:text-white rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition placeholder:text-[var(--fg-dim)] dark:placeholder:text-white/30"
                />
              </div>
            </div>
          )}

          {/* Verification Code Field (for OTP & Password Reset Confirm) */}
          {(isOtpStep || (isForgotPassword && isResetConfirmStep)) && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider uppercase text-[var(--fg-soft)] dark:text-white/70 block">
                Verification Code
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--fg-dim)] dark:text-white/40 pointer-events-none">
                  <KeyRound className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-[var(--surface-light)] dark:bg-white/5 border border-[var(--border)] dark:border-white/15 text-[var(--fg)] dark:text-white rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] tracking-[0.5em] text-center transition placeholder:tracking-normal"
                />
              </div>
            </div>
          )}

          {/* New Password Field (for Password Reset Confirm) */}
          {(isForgotPassword && isResetConfirmStep) && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider uppercase text-[var(--fg-soft)] dark:text-white/70 block">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--fg-dim)] dark:text-white/40 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-[var(--surface-light)] dark:bg-white/5 border border-[var(--border)] dark:border-white/15 text-[var(--fg)] dark:text-white rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition placeholder:text-[var(--fg-dim)] dark:placeholder:text-white/30"
                />
              </div>
            </div>
          )}

          {/* Messages */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm p-3.5 rounded-xl font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm p-3.5 rounded-xl font-medium">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold py-3.5 px-4 rounded-xl text-base transition flex items-center justify-center gap-2.5 disabled:opacity-55 cursor-pointer shadow-md mt-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : isForgotPassword ? (
              isResetConfirmStep ? 'Reset Password' : 'Send Reset Code'
            ) : isOtpStep ? (
              'Verify Email'
            ) : isSignUp ? (
              'Register Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Tab Toggle Footer */}
        {!isOtpStep && !isForgotPassword && (
          <div className="border-t border-[var(--line)] dark:border-white/10 mt-6 pt-5 text-center">
            <p className="text-sm text-[var(--fg-soft)] dark:text-white/70">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  resetAllStates()
                }}
                className="text-[var(--brand)] hover:underline font-bold focus:outline-none cursor-pointer ml-1"
              >
                {isSignUp ? 'Log In' : 'Sign Up Free'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

