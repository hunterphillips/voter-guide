'use client'

import { useState, useRef, useEffect } from 'react'

interface ShareButtonProps {
  url?: string
  title: string
  description?: string
  className?: string
  variant?: 'inline' | 'dropdown'
}

export default function ShareButton({ url: propUrl, title, description, className = '', variant = 'inline' }: ShareButtonProps) {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [url, setUrl] = useState(propUrl || '')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Set URL on client side to avoid hydration mismatch
  useEffect(() => {
    if (!propUrl && typeof window !== 'undefined') {
      setUrl(window.location.href)
    } else if (propUrl) {
      setUrl(propUrl)
    }
  }, [propUrl])

  const shareData = {
    title,
    text: description || title,
    url,
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setShowCopyFeedback(true)
      setTimeout(() => setShowCopyFeedback(false), 2000)
      if (variant === 'dropdown') {
        setShowDropdown(false)
      }
    } catch (error) {
      console.error('Failed to copy link')
    }
  }

  const getTwitterUrl = () => {
    const text = encodeURIComponent(`${title} - ${description || ''}`)
    return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`
  }

  const getFacebookUrl = () => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  }

  const getEmailUrl = () => {
    const subject = encodeURIComponent(title)
    const body = encodeURIComponent(`Check out this election information: ${url}`)
    return `mailto:?subject=${subject}&body=${body}`
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          aria-label="Share this page"
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Share
          <svg className={`w-4 h-4 ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
            <a
              href={getTwitterUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 text-sm text-slate-300 hover:text-blue-400 hover:bg-white/5 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share on Twitter
            </a>
            
            <a
              href={getFacebookUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 text-sm text-slate-300 hover:text-blue-600 hover:bg-white/5 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Share on Facebook
            </a>
            
            <a
              href={getEmailUrl()}
              className="flex items-center px-4 py-3 text-sm text-slate-300 hover:text-green-400 hover:bg-white/5 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Share via email
            </a>
            
            <button
              onClick={handleCopyLink}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:text-purple-400 hover:bg-white/5 transition-colors relative"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy link
            </button>
            
            {showCopyFeedback && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/90 text-white text-sm font-medium">
                Copied!
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Default inline variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a
        href={getTwitterUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center p-2 text-slate-300 hover:text-blue-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
        aria-label="Share on Twitter"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      
      <a
        href={getFacebookUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center p-2 text-slate-300 hover:text-blue-600 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
        aria-label="Share on Facebook"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
      
      <a
        href={getEmailUrl()}
        className="inline-flex items-center p-2 text-slate-300 hover:text-green-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
        aria-label="Share via email"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </a>
      
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center p-2 text-slate-300 hover:text-purple-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors relative"
        aria-label="Copy link"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {showCopyFeedback && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  )
}