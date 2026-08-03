import React from "react";

const Controls = ({
  peerId,
  remoteId,
  setRemoteId,
  callStarted,
  isAudioMuted,
  isVideoOff,
  onStartCall,
  onEndCall,
  onToggleAudio,
  onToggleVideo,
}) => {
  const copyPeerId = () => {
    navigator.clipboard?.writeText(peerId);
    alert("Peer ID copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6 w-full">
      {/* Remote ID input + Call button (only when not in call) */}
      {!callStarted ? (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter remote Peer ID"
            value={remoteId}
            onChange={(e) => setRemoteId(e.target.value)}
            className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
          />
          <button
            onClick={onStartCall}
            className="w-full sm:w-auto px-6 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition shadow-lg shadow-accent/30"
          >
            Call
          </button>
        </div>
      ) : (
        // In-call controls
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onToggleAudio}
            className={`p-3 rounded-xl transition shadow-lg ${
              isAudioMuted
                ? "bg-red-600/80 hover:bg-red-700"
                : "bg-white/10 hover:bg-white/20"
            }`}
            title={isAudioMuted ? "Unmute" : "Mute"}
          >
            {isAudioMuted ? "🔇" : "🔊"}
          </button>
          <button
            onClick={onToggleVideo}
            className={`p-3 rounded-xl transition shadow-lg ${
              isVideoOff
                ? "bg-red-600/80 hover:bg-red-700"
                : "bg-white/10 hover:bg-white/20"
            }`}
            title={isVideoOff ? "Turn on camera" : "Turn off camera"}
          >
            {isVideoOff ? "📷❌" : "📷"}
          </button>
          <button
            onClick={onEndCall}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition shadow-lg shadow-red-600/30"
          >
            End Call
          </button>
        </div>
      )}

      {/* Peer ID display with copy button */}
      <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
        <span>Your ID:</span>
        <span className="font-mono text-accent">
          {peerId || "Connecting..."}
        </span>
        {peerId && (
          <button
            onClick={copyPeerId}
            className="ml-1 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
};

export default Controls;
