import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Solid3DKLogo } from './Solid3DKLogo'

export function AnimatedHeaderLogo() {
  const [animState, setAnimState] = useState(0)

  useEffect(() => {
    // 0 = Initial mount, K's are separated
    // 1 = Slide together and interlock
    // 2 = Show full text
    const t1 = setTimeout(() => setAnimState(1), 400)
    const t2 = setTimeout(() => setAnimState(2), 1600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const progress = animState > 0 ? 1 : 0;

  return (
    <Link to="/" className="flex items-center flex-shrink-0 no-underline group h-full overflow-visible">
      <div className="flex items-center h-full relative">
        <div className="mr-3 transition-transform duration-500 group-hover:-translate-y-1 z-10 relative">
          <Solid3DKLogo size={36} progress={progress} />
        </div>

        {/* Final Full Text */}
        <span 
          className="transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            fontSize: '1.3rem',
            color: 'var(--fg)',
            letterSpacing: '-0.02em',
            opacity: animState === 2 ? 1 : 0,
            transform: animState === 2 ? 'translateX(0)' : 'translateX(-10px)',
            maxWidth: animState === 2 ? '200px' : '0px',
            overflow: 'hidden',
            display: 'inline-block',
            whiteSpace: 'nowrap'
          }}>
          kreatekaro
        </span>
      </div>
    </Link>
  )
}
