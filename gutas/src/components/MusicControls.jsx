import { useMusic } from '../contexts/MusicContext'

const MusicControls = () => {
  const { isMuted, toggleMute, isGameMusicPlaying } = useMusic()

  return (
    <div className="music-controls">
      <button 
        className={`music-toggle ${isMuted ? 'muted' : 'unmuted'}`}
        onClick={toggleMute}
        title={isMuted ? 'Unmute Music' : 'Mute Music'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
      
      {isGameMusicPlaying && !isMuted && (
        <div className="music-indicator">
          <span className="music-note">♪</span>
        </div>
      )}
    </div>
  )
}

export default MusicControls
