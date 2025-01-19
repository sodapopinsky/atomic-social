
// src/components/auth/login-button.tsx
'use client'

import { useState } from 'react'

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleInstagramLogin = () => {
    setIsLoading(true)
    const instagramAuthUrl = 'https://api.instagram.com/oauth/authorize'
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI
    const scope = 'user_profile'
    
    const authUrl = `${instagramAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`
    
    window.location.href = authUrl
  }

  return (
    <button
      onClick={handleInstagramLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
        </svg>
      )}
      {isLoading ? 'Connecting...' : 'Continue with Instagram'}
    </button>
  )
}