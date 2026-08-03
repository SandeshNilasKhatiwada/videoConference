import React, { useRef, useEffect } from "react";

const VideoPlayer = ({ stream, label, isLocal = false, className = "" }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`relative bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden aspect-video shadow-xl border border-white/10 ${className}`}
    >
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-5xl mb-2 opacity-30">📹</div>
            <p className="text-sm">Waiting for {label}...</p>
          </div>
        </div>
      )}
      <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white/90 border border-white/10">
        {label}
      </span>
      {isLocal && stream && (
        <span className="absolute top-3 right-3 bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full border border-green-500/30">
          Live
        </span>
      )}
    </div>
  );
};

export default VideoPlayer;
