import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'

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

  return (
    <Link to="/" className="flex items-center flex-shrink-0 no-underline group h-full overflow-visible">
      <img src="/krafclogo.png" alt="Krafc Logo" className="h-8 transition-transform duration-500 group-hover:-translate-y-1" />
    </Link>
  )
}
