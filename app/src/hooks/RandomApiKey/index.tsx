
import { useEffect, useState } from 'react'

const RandomApiKey = () => {
  const [ apiKeys ] = useState<string[] | any>([
    //process.env.EXPO_PUBLIC_GEMINI_API_KEY1 || '',
    process.env.EXPO_PUBLIC_GEMINI_API_KEY2 || '',
    process.env.EXPO_PUBLIC_GEMINI_API_KEY3 || '',
    process.env.EXPO_PUBLIC_GEMINI_API_KEY4 || '',
    process.env.EXPO_PUBLIC_GEMINI_API_KEY5 || ''
  ])
  const [randomApiKey, setRandomApiKey] = useState<string | any>('')

  useEffect(() => {
    const fetchApiKeys = async () => {
      const randomApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)]
      setRandomApiKey(randomApiKey)
    }
    fetchApiKeys()
  }, [])

  return randomApiKey
}

export default RandomApiKey