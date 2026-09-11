import { Link } from '@tanstack/react-router'

export function AnimatedHeaderLogo() {
  return (
    <Link to="/" className="flex items-center flex-shrink-0 no-underline group h-full overflow-visible">
      {/* Light mode: use the image */}
      <img
        src="/originals/original.png"
        alt="krafc Logo"
        className="h-11 sm:h-12 transition-transform duration-500 group-hover:-translate-y-1 dark:hidden"
      />
      {/* Dark mode: text logo so we can colour krafc and . independently */}
      <span className="hidden dark:flex items-baseline transition-transform duration-500 group-hover:-translate-y-1 select-none">
        <span className="text-white font-black text-2xl tracking-tight" style={{ fontFamily: 'inherit' }}>krafc</span>
        <span className="text-[var(--brand)] font-black text-2xl">.</span>
      </span>
    </Link>
  )
}
