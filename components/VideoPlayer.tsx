"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type VideoPlayerProps = {
  videoUrl: string;
  onProgress: (seconds: number) => void;
  seekToSeconds: number | null;
  onSeekHandled: () => void;
};

export default function VideoPlayer({
  videoUrl,
  onProgress,
  seekToSeconds,
  onSeekHandled,
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (seekToSeconds === null || !playerRef.current) {
      return;
    }
    playerRef.current.currentTime = seekToSeconds;
    onSeekHandled();
  }, [seekToSeconds, onSeekHandled]);

  return (
    <div className="overflow-hidden rounded-xl border border-[#1e1e2e] bg-black">
      <div className="aspect-video overflow-hidden">
        {videoUrl ? (
          <ReactPlayer
            src={videoUrl}
            controls
            width="100%"
            height="100%"
            playing={false}
            ref={playerRef}
            onTimeUpdate={(event) => onProgress(event.currentTarget.currentTime)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#52525e]">
            Upload or link a lecture first.
          </div>
        )}
      </div>
    </div>
  );
}
