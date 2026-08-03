import React, { useRef, useEffect } from "react";

const VideoPlayer = ({ stream, label, isLocal = false, className = "" }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return (
      <div
        className={`bg-gray-900 rounded-xl aspect-video flex items-center justify-center text-gray-500 ${className}`}
      >
        <span>No video</span>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-black rounded-xl overflow-hidden aspect-video ${className}`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
      />
      <span className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full text-sm text-white">
        {label}
      </span>
    </div>
  );
};

export default VideoPlayer;
