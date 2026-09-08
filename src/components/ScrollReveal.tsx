import React, { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in'
  delay?: number // delay in ms
  threshold?: number
  once?: boolean
  style?: React.CSSProperties
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.15,
  once = true,
  style = {},
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If IntersectionObserver is not supported, reveal immediately
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(el)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [threshold, once])

  const animationClass = isVisible ? `reveal-${animation} is-visible` : `reveal-${animation}`
  const combinedClassName = `scroll-reveal ${animationClass} ${className}`.trim()

  return (
    <div
      ref={ref}
      className={combinedClassName}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
