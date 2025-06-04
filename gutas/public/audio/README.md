# Audio Files Setup Guide

## Required Audio Files

Place the following audio files in `public/audio/` directory:

### 1. game-bg.mp3
- **Purpose**: Background music during gameplay
- **Duration**: 2-3 minutes (will loop)
- **Style**: Upbeat, energetic background music
- **Recommended**: Royalty-free game music or chiptune style

### 2. win.mp3
- **Purpose**: Victory sound effect
- **Duration**: 2-5 seconds
- **Style**: Triumphant, celebratory sound
- **Examples**: Victory fanfare, coins, applause

### 3. lose.mp3
- **Purpose**: Defeat sound effect  
- **Duration**: 2-5 seconds
- **Style**: Disappointing but not harsh
- **Examples**: Sad trombone, gentle "aww" sound

### 4. tie.mp3
- **Purpose**: Tie/draw sound effect
- **Duration**: 2-5 seconds  
- **Style**: Neutral, "try again" feeling
- **Examples**: Bell sound, neutral beep

## Free Music Sources

1. **Freesound.org** - Free sound effects with Creative Commons licenses
2. **Zapsplat.com** - Free with registration
3. **Pixabay.com/music** - Royalty-free music and sounds
4. **OpenGameArt.org** - Game-specific audio assets
5. **YouTube Audio Library** - Free music for creators

## Audio Format Requirements

- **Format**: MP3 (best compatibility)
- **Quality**: 128kbps minimum (to keep file sizes reasonable)
- **File Size**: Keep under 1MB per file for faster loading
- **Channels**: Stereo or Mono both work

## Implementation Notes

- Audio files are loaded lazily when the MusicContext initializes
- All audio respects the browser's autoplay policies
- Music will automatically pause when the browser tab becomes inactive
- Volume and mute settings persist during the game session

## For Development/Testing

If you don't have audio files yet, you can:
1. Use any MP3 files temporarily (rename them to match)
2. Create silent audio files for testing
3. The system gracefully handles missing audio files
