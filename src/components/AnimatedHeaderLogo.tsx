import { Link } from '@tanstack/react-router'

export function AnimatedHeaderLogo() {
  return (
    <Link to="/" className="flex items-center flex-shrink-0 no-underline group h-full overflow-visible">
      <img 
        src="/originals/original.png" 
        alt="krafc Logo" 
        className="h-11 sm:h-12 transition-transform duration-500 group-hover:-translate-y-1 dark:brightness-0 dark:invert" 
      />
    </Link>
  )
}
