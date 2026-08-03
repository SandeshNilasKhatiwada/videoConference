import React from "react";
import { usePeer } from "./hooks/usePeer";
import VideoPlayer from "./components/VideoPlayer";
import Controls from "./components/Controls";

function App() {
  const {
    peerId,
    remoteId,
    setRemoteId,
    callStarted,
    localStream,
    remoteStream,
    isAudioMuted,
    isVideoOff,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
  } = usePeer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-[#14142b] to-[#1a1a35] flex flex-col">
      {/* Header with logo */}
      <header className="p-4 border-b border-white/5 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📹</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
              VideoCall
            </h1>
          </div>
          <div className="text-sm text-gray-400 hidden sm:block">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            {callStarted ? "In a call" : "Ready"}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl flex flex-col">
        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <VideoPlayer stream={localStream} label="You" isLocal />
          <VideoPlayer
            stream={remoteStream}
            label={callStarted ? "Remote" : "Waiting..."}
          />
        </div>

        {/* Controls */}
        <Controls
          peerId={peerId}
          remoteId={remoteId}
          setRemoteId={setRemoteId}
          callStarted={callStarted}
          isAudioMuted={isAudioMuted}
          isVideoOff={isVideoOff}
          onStartCall={startCall}
          onEndCall={endCall}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
        />
      </main>

      {/* Footer */}
      <footer className="py-2 text-center text-xs text-gray-600 border-t border-white/5">
        Powered by WebRTC · PeerJS · Vite
      </footer>
    </div>
  );
}

export default App;
git 