// ThemeContext.tsx
import { Colors } from '@constants'
import { loadTheme, updateTheme } from '@hooks'
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

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const deviceTheme = useColorScheme()
  const [theme, setTheme] = useState<Theme>('dark')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Uygulama başladığında cache'den tema tercihini yükle
    const savedTheme = loadTheme({ 
      setTheme, 
      defaultTheme: deviceTheme || 'dark' 
    })
    setIsLoaded(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    // Tema değişikliğini cache'e kaydet
    updateTheme(newTheme)
  }

  const colors = theme === 'dark' ? Colors.dark : Colors.light

  // Tema yüklenene kadar bekle
  if (!isLoaded) {
    return null
  }

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
