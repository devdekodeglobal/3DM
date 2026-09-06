// External script so the production CSP does not need unsafe-inline scripts.
try {
  const stored = localStorage.getItem('theme')
  const mode = ['light','dark','auto'].includes(stored) ? stored : 'auto'
  const resolved = mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode
  document.documentElement.classList.add(resolved)
  document.documentElement.setAttribute('data-theme',resolved)
  document.documentElement.style.colorScheme=resolved
} catch { /* Storage can be disabled in privacy modes. */ }
