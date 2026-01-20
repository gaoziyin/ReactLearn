# Exercise 2.5: Video Player

## Task

Create a `VideoPlayer` component with:
1. Play/pause controls using ref
2. Seek functionality
3. Fullscreen toggle

---

## Solution

```tsx
import React, { useRef, useState } from 'react';

function VideoPlayer(): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = (): void => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = (): void => {
    videoRef.current?.requestFullscreen();
  };

  return (
    <div>
      <video 
        ref={videoRef}
        src="https://example.com/video.mp4"
        style={{ width: '100%' }}
      />
      <button onClick={togglePlay}>
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
      <button onClick={toggleFullscreen}>⛶ Fullscreen</button>
    </div>
  );
}

export default VideoPlayer;
```
