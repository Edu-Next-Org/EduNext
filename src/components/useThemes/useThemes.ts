import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'

    return (
      (localStorage.getItem('theme') as Theme | null) ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    )
  })

  useEffect(() => {
    const html = document.documentElement

    if (theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = (): void => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}