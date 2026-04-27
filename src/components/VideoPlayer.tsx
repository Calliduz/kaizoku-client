import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import type { StreamingSource } from "../types";
import "../styles/components/VideoPlayer.css";

interface VideoPlayerProps {
  source: StreamingSource;
  title?: string;
  onProgress?: (progress: number) => void;
  onEnded?: () => void;
  episodeId?: string;
  nextEpisodeId?: string;
}

export default function VideoPlayer({ 
  source, 
  title = "", 
  onProgress, 
  onEnded,
  episodeId, 
  nextEpisodeId 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [nextCountdown, setNextCountdown] = useState(8);
  const countdownTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!source?.url) return;
    const video = videoRef.current;
    if (!video) return;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (source.type === "hls" || source.url.includes(".m3u8")) {
      if (Hls.isSupported()) {
        // ─── CODEC REMAP PATCH ────────────────────────────────────────────────────
        // AnimePahe/Kwik streams declare audio as `mp4a.40.1` (AAC Main Profile).
        // Chrome/Brave MSE only supports `mp4a.40.2` (AAC-LC) — they reject .40.1
        // via addSourceBuffer() with NotSupportedError.
        //
        // WHY NOT Hls.Events.BUFFER_CODECS:
        // hls.js's internal BufferController listener is registered during Hls
        // construction (BEFORE ours), so it ALWAYS runs synchronously first, throws
        // the NotSupportedError, and our afterward-listener only sees stale data.
        // Deleting data.audio at that point causes a chain of fragParsingError
        // ("Cannot read properties of undefined (reading 'initSegment')") because
        // the transmuxer keeps outputting audio data that has no SourceBuffer.
        //
        // THE FIX: Patch MediaSource.prototype.addSourceBuffer to remap the codec
        // string BEFORE it reaches the browser.  This runs at the call site, ahead
        // of all hls.js logic, so the SourceBuffer is created with a supported
        // codec string.  mp4a.40.1 (AAC Main) and mp4a.40.2 (AAC-LC) share the
        // same bitstream format at standard anime bitrates — audio plays normally.
        const _origAddSourceBuffer = MediaSource.prototype.addSourceBuffer;
        const _patchedAddSourceBuffer = function (this: MediaSource, mimeType: string) {
          // Remap AAC Main Profile (mp4a.40.1) → AAC-LC (mp4a.40.2)
          // AAC-LC is universally supported by Chrome/Brave via MSE.
          const remapped = mimeType.replace(/mp4a\.40\.1/g, "mp4a.40.2");
          if (remapped !== mimeType) {
            console.info(`[HLS] Codec remapped: "${mimeType}" → "${remapped}"`);
          }
          return _origAddSourceBuffer.call(this, remapped);
        };
        MediaSource.prototype.addSourceBuffer = _patchedAddSourceBuffer;

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          manifestLoadingTimeOut: 20000,
          levelLoadingTimeOut: 20000,
          fragLoadingTimeOut: 30000,
        });

        // ─── AUTO-PLAY ────────────────────────────────────────────────────────────
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {
            // Autoplay blocked by browser policy — user must click play manually
          });
        });

        // ─── ERROR RECOVERY ──────────────────────────────────────────────────────
        let mediaErrorCount = 0;
        hls.on(Hls.Events.ERROR, (_event, data) => {
          const msg = (data as any).error?.message ?? data.details; // eslint-disable-line @typescript-eslint/no-explicit-any
          console.error("[HLS Error]", data.type, data.details, msg);

          if (!data.fatal) return;

          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn("[HLS] Fatal network error — restarting load...");
              hls.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              mediaErrorCount++;
              if (mediaErrorCount <= 3) {
                console.warn(`[HLS] Fatal media error (attempt ${mediaErrorCount}) — calling recoverMediaError...`);
                hls.recoverMediaError();
              } else {
                console.error("[HLS] Unrecoverable after 3 attempts. Destroying.");
                hls.destroy();
              }
              break;

            default:
              console.error("[HLS] Unrecoverable fatal error. Destroying.");
              hls.destroy();
              break;
          }
        });

        hls.loadSource(source.url);
        hls.attachMedia(video);
        hlsRef.current = hls;

        // Restore the original addSourceBuffer when this player unmounts
        return () => {
          MediaSource.prototype.addSourceBuffer = _origAddSourceBuffer;
          if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
          }
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari — native HLS, no MSE needed
        video.src = source.url;
        video.load();
      }
    } else {
      video.src = source.url;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [source]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      
      // Skip Intro logic: Show between 1:30 and 3:00 (standard anime intro range)
      if (currentTime > 90 && currentTime < 180) {
        if (!showSkipIntro) setShowSkipIntro(true);
      } else {
        if (showSkipIntro) setShowSkipIntro(false);
      }

      // Next Episode Overlay logic: Show in last 40 seconds
      if (duration && nextEpisodeId) {
        if (duration - currentTime < 40 && !showNextOverlay) {
          setShowNextOverlay(true);
        } else if (duration - currentTime >= 40 && showNextOverlay) {
          setShowNextOverlay(false);
        }
      }

      if (episodeId) {
        localStorage.setItem(`progress-${episodeId}`, currentTime.toString());
        if (duration) {
          const percent = (currentTime / duration) * 100;
          localStorage.setItem(`percent-${episodeId}`, percent.toString());
        }
      }
      if (onProgress) {
        const progress = (currentTime / duration) * 100;
        onProgress(progress || 0);
      }
    }
  };

  useEffect(() => {
    if (showNextOverlay && !countdownTimerRef.current) {
      countdownTimerRef.current = setInterval(() => {
        setNextCountdown((prev: number) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
            if (onEnded) onEnded();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!showNextOverlay && countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
      setNextCountdown(8);
    }
  }, [showNextOverlay, onEnded]);

  const skipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 180; // Standard 3:00 intro end
      setShowSkipIntro(false);
    }
  };

  if (source?.type === "iframe" || source?.type === "embed") {
    return (
      <div className="video-player">
        <iframe
          src={source.url}
          title={title}
          className="video-player__iframe"
          allowFullScreen
          allow="autoplay; encrypted-media"
        />
      </div>
    );
  }

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        className="video-player__video"
        controls
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        onLoadedMetadata={() => {
          if (episodeId && videoRef.current) {
            const savedTime = localStorage.getItem(`progress-${episodeId}`);
            if (savedTime) {
              videoRef.current.currentTime = parseFloat(savedTime);
            }
          }
        }}
        playsInline
      />

      {/* Skip Intro Button */}
      {showSkipIntro && (
        <button className="player-skip-intro animate-fade-in-right" onClick={skipIntro}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 4l10 8-10 8V4z"/><path d="M19 5v14"/></svg>
          Skip Intro
        </button>
      )}

      {/* Next Episode Mini Overlay */}
      {showNextOverlay && nextEpisodeId && (
        <div className="player-next-overlay animate-fade-in-up">
          <div className="next-overlay__content">
            <span className="next-overlay__label">Next Episode in</span>
            <span className="next-overlay__timer">{nextCountdown}s</span>
          </div>
          <button className="next-overlay__btn" onClick={() => onEnded && onEnded()}>
            Play Now
          </button>
          <button className="next-overlay__close" onClick={() => setShowNextOverlay(false)}>✕</button>
        </div>
      )}
    </div>
  );
}
