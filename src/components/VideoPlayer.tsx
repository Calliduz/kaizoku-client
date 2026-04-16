import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import type { StreamingSource } from '../types';
import '../styles/components/VideoPlayer.css';

interface Quality {
  index: number;
  label: string;
}

interface VideoPlayerProps {
  source: StreamingSource;
  title?: string;
  onProgress?: (progress: number) => void;
}

export default function VideoPlayer({ source, title = '', onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<any>(null);

  // Initialize HLS/Video
  useEffect(() => {
    if (!source?.url) return;
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (source.type === 'hls' || source.url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true, startLevel: -1 });
        hls.loadSource(source.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          setQualities(data.levels.map((l, i) => ({ index: i, label: l.height ? `${l.height}p` : `L${i}` })));
        });
        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source.url;
      }
    } else {
      video.src = source.url;
    }

    return () => hlsRef.current?.destroy();
  }, [source]);

  // Controls Visibility Logic
  const showControls = useCallback(() => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setIsControlsVisible(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    const handleMouseMove = () => showControls();
    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    return () => container?.removeEventListener('mousemove', handleMouseMove);
  }, [showControls]);

  // Player Handlers
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const currentProgress = (video.currentTime / video.duration) * 100;
    setProgress(currentProgress);
    if (onProgress) onProgress(currentProgress);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = (parseFloat(e.target.value) / 100) * video.duration;
    video.currentTime = time;
    setProgress(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = v;
      video.muted = v === 0;
    }
    setVolume(v);
    setIsMuted(v === 0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (source?.type === 'iframe' || source?.type === 'embed') {
    return (
      <div className="video-player premium-player" id="video-player">
        <iframe src={source.url} title={title} className="video-player__iframe" allowFullScreen />
      </div>
    );
  }

  return (
    <div 
      className={`video-player premium-player ${isControlsVisible ? 'controls-active' : 'controls-hidden'}`} 
      ref={containerRef}
      onKeyDown={(e) => {
        if (e.key === ' ') { e.preventDefault(); togglePlay(); }
        if (e.key === 'f') toggleFullscreen();
        if (e.key === 'm') toggleMute();
        if (e.key === 'ArrowRight') videoRef.current && (videoRef.current.currentTime += 10);
        if (e.key === 'ArrowLeft') videoRef.current && (videoRef.current.currentTime -= 10);
      }}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        className="video-player__video"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      />

      <div className="player-overlay" onClick={togglePlay}>
        {!isPlaying && (
          <div className="center-play-btn">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        )}
      </div>

      <div className="player-controls animate-slide-up">
        <div className="player-progress-container">
          <input 
            type="range" 
            className="player-progress-bar" 
            min="0" max="100" step="0.1"
            value={progress}
            onChange={handleSeek}
            style={{ '--progress': `${progress}%` } as any}
          />
        </div>

        <div className="player-controls-row">
          <div className="player-controls-left">
            <button className="control-btn" onClick={togglePlay}>
              {isPlaying ? 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
            </button>
            <div className="volume-container">
              <button className="control-btn" onClick={toggleMute}>
                {isMuted || volume === 0 ? 
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM4.27 3L3 4.27l6.01 6.01H6v3.31h3.31l4.69 4.69V11.27l4.73 4.73c-.21.15-.45.29-.71.39v2.1c.79-.23 1.52-.61 2.13-1.07L19.73 21 21 19.73 4.27 3z"/></svg> : 
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>}
              </button>
              <input type="range" className="volume-slider" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
            </div>
            <div className="time-display">
              {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
            </div>
          </div>

          <div className="player-controls-right">
            <div className="quality-selector-container">
              <button className="control-btn quality-btn" onClick={() => setShowQualityMenu(!showQualityMenu)}>
                {currentQuality === -1 ? 'Auto' : qualities[currentQuality]?.label}
              </button>
              {showQualityMenu && (
                <div className="player-quality-menu glass">
                  <button onClick={() => { hlsRef.current && (hlsRef.current.currentLevel = -1); setCurrentQuality(-1); setShowQualityMenu(false); }}>Auto</button>
                  {qualities.map(q => (
                    <button key={q.index} onClick={() => { hlsRef.current && (hlsRef.current.currentLevel = q.index); setCurrentQuality(q.index); setShowQualityMenu(false); }}>{q.label}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="control-btn" onClick={toggleFullscreen}>
              {isFullscreen ? 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg> : 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
