// ThemeContext.tsx
import { Colors } from '@constants'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  colors: typeof Colors.light | typeof Colors.dark
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children, themeColor }: { children: React.ReactNode, themeColor?: Theme }) => {
  const deviceTheme = useColorScheme()
  const [theme, setTheme] = useState<Theme>(themeColor || 'dark')

  useEffect(() => {
    if (deviceTheme) {
      setTheme(themeColor || deviceTheme)
    }
  }, [deviceTheme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const colors = theme === 'dark' ? Colors.dark : Colors.light

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
