import { Link } from '@tanstack/react-router'

export function AnimatedHeaderLogo() {
  return (
    <Link to="/" className="flex items-center flex-shrink-0 no-underline group h-full overflow-visible">
      <img src="/krafclogo.png" alt="krafc Logo" className="h-10 sm:h-11 transition-transform duration-500 group-hover:-translate-y-1" />
    </Link>
  )
}
