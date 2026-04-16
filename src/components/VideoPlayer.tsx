import { useEffect, useRef } from "react";
import Hls from "hls.js";
import type { StreamingSource } from "../types";
import "../styles/components/VideoPlayer.css";

interface VideoPlayerProps {
  source: StreamingSource;
  title?: string;
  onProgress?: (progress: number) => void;
}

export default function VideoPlayer({ source, title = "", onProgress }: VideoPlayerProps) {
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
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(source.url);
        hls.attachMedia(video);
        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Fallback for Safari
        video.src = source.url;
      }
    } else {
      // Direct MP4 or other supported formats
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
    if (onProgress && videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      onProgress(progress || 0);
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
        playsInline
      />
    </div>
  );
}
