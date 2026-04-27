import { useEffect, useRef } from "react";
import Hls from "hls.js";
import type { StreamingSource } from "../types";
import "../styles/components/VideoPlayer.css";

interface VideoPlayerProps {
  source: StreamingSource;
  title?: string;
  onProgress?: (progress: number) => void;
  episodeId?: string;
}

export default function VideoPlayer({ source, title = "", onProgress, episodeId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

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
    };
  }, [source]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
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
    </div>
  );
}
