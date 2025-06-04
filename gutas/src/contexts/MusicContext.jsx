import { createContext, useContext, useRef, useEffect, useState } from 'react'

const MusicContext = createContext()

export const useMusic = () => {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}

export const MusicProvider = ({ children }) => {
  const [isGameMusicPlaying, setIsGameMusicPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3)

  // Audio refs for different music tracks
  const gameBgMusicRef = useRef(null)
  const winMusicRef = useRef(null)
  const loseMusicRef = useRef(null)
  const tieMusicRef = useRef(null)

  // Initialize audio elements
  useEffect(() => {
    // Background game music (looping)
    gameBgMusicRef.current = new Audio('/audio/gameplay.mp3')
    gameBgMusicRef.current.loop = true
    gameBgMusicRef.current.volume = volume

    // Win sound effect
    winMusicRef.current = new Audio('/audio/win.mp3')
    winMusicRef.current.volume = volume

    // Lose sound effect
    loseMusicRef.current = new Audio('/audio/lose.mp3')
    loseMusicRef.current.volume = volume

    // Tie sound effect
    tieMusicRef.current = new Audio('/audio/draw.mp3')
    tieMusicRef.current.volume = volume

    // Cleanup function
    return () => {
      stopAllMusic()
    }
  }, [volume])

  // Update volume for all audio elements
  useEffect(() => {
    const audioElements = [
      gameBgMusicRef.current,
      winMusicRef.current,
      loseMusicRef.current,
      tieMusicRef.current
    ]

    audioElements.forEach(audio => {
      if (audio) {
        audio.volume = isMuted ? 0 : volume
      }
    })
  }, [volume, isMuted])
  const playGameMusic = () => {
    if (gameBgMusicRef.current && !isMuted) {
      // Stop other music first
      stopResultMusic()
      
      // Only start music if it's not already playing
      if (gameBgMusicRef.current.paused || gameBgMusicRef.current.ended) {
        gameBgMusicRef.current.play().catch(error => {
          console.log('Game music autoplay prevented:', error)
        })
      }
      setIsGameMusicPlaying(true)
    }
  }

  const stopGameMusic = () => {
    if (gameBgMusicRef.current) {
      gameBgMusicRef.current.pause()
      gameBgMusicRef.current.currentTime = 0
      setIsGameMusicPlaying(false)
    }
  }
  const playResultMusic = (result) => {
    // Stop gameplay music completely when playing result music
    stopGameMusic()

    let audioToPlay = null
    switch (result) {
      case 'win':
        audioToPlay = winMusicRef.current
        break
      case 'lose':
        audioToPlay = loseMusicRef.current
        break
      case 'tie':
        audioToPlay = tieMusicRef.current
        break
      default:
        return
    }

    if (audioToPlay && !isMuted) {
      audioToPlay.currentTime = 0
      audioToPlay.play().catch(error => {
        console.log('Result music play error:', error)
      })
    }
  }

  const stopResultMusic = () => {
    [winMusicRef.current, loseMusicRef.current, tieMusicRef.current].forEach(audio => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    })

    // Restore game music volume
    if (gameBgMusicRef.current && isGameMusicPlaying) {
      gameBgMusicRef.current.volume = isMuted ? 0 : volume
    }
  }

  const stopAllMusic = () => {
    stopGameMusic()
    stopResultMusic()
  }
  const toggleMute = () => {
    setIsMuted(prev => !prev)
  }

  // Handle browser visibility change (pause when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (gameBgMusicRef.current) {
          gameBgMusicRef.current.pause()
        }
      } else if (isGameMusicPlaying && !isMuted) {
        if (gameBgMusicRef.current) {
          gameBgMusicRef.current.play().catch(error => {
            console.log('Resume music error:', error)
          })
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isGameMusicPlaying, isMuted])
  const value = {
    playGameMusic,
    stopGameMusic,
    playResultMusic,
    stopAllMusic,
    toggleMute,
    isMuted,
    isGameMusicPlaying
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  )
}
