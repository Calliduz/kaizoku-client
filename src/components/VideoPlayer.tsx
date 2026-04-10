import { useEffect, useRef, useState } from 'react';
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
}

/**
 * VideoPlayer — HLS streaming player with auto-quality and manual quality picker.
 *
 * Supports:
 * - HLS streams (.m3u8) via hls.js with auto quality selection
 * - Direct MP4/WebM via native <video>
 * - Iframe/embed fallback for external players
 *
 * @param {{ source: { url: string, type: string }, title: string }} props
 */
export default function VideoPlayer({ source, title = '' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [qualities, setQualities] = useState<Quality[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 = auto
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    if (!source?.url) return;

    const video = videoRef.current;
    if (!video) return;

    // Clean up previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (source.type === 'hls' || source.url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          startLevel: -1, // auto quality selection
        });

        hls.loadSource(source.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
          const levels = data.levels.map((level, index) => ({
            index,
            height: level.height,
            width: level.width,
            bitrate: level.bitrate,
            label: level.height ? `${level.height}p` : `Level ${index}`,
          }));

          setQualities(levels);
          setCurrentQuality(-1);
          video.play().catch(() => {});
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, () => {
          if (hlsRef.current?.autoLevelEnabled) {
            setCurrentQuality(-1);
          }
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        video.src = source.url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => {});
        });
      }
    } else if (source.type === 'mp4' || source.type === 'webm') {
      video.src = source.url;
      video.play().catch(() => {});
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [source]);

  const handleQualityChange = (levelIndex: number) => {
    if (hlsRef.current) {
      if (levelIndex === -1) {
        hlsRef.current.currentLevel = -1; // auto
      } else {
        hlsRef.current.currentLevel = levelIndex;
      }
      setCurrentQuality(levelIndex);
    }
    setShowQualityMenu(false);
  };

  // ── Iframe/embed fallback ──
  if (source?.type === 'iframe' || source?.type === 'embed') {
    return (
      <div className="video-player" id="video-player">
        <iframe
          src={source.url}
          title={title}
          className="video-player__iframe"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    );
  }

  return (
    <div className="video-player" id="video-player">
      <video
        ref={videoRef}
        className="video-player__video"
        controls
        playsInline
        crossOrigin="anonymous"
      >
        {source.subtitles?.map((sub, index) => (
          <track
            key={`${sub.lang}-${index}`}
            kind="subtitles"
            src={sub.url}
            srcLang={sub.lang}
            label={sub.lang}
            default={sub.default}
          />
        ))}
      </video>

      {/* Quality selector */}
      {qualities.length > 0 && (
        <div className="video-player__quality">
          <button
            className="video-player__quality-btn"
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            id="quality-toggle"
          >
            ⚙ {currentQuality === -1 ? 'Auto' : qualities.find(q => q.index === currentQuality)?.label}
          </button>

          {showQualityMenu && (
            <div className="video-player__quality-menu glass">
              <button
                className={`video-player__quality-option ${currentQuality === -1 ? 'active' : ''}`}
                onClick={() => handleQualityChange(-1)}
              >
                Auto
              </button>
              {qualities.map((q) => (
                <button
                  key={q.index}
                  className={`video-player__quality-option ${currentQuality === q.index ? 'active' : ''}`}
                  onClick={() => handleQualityChange(q.index)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
