import React from "react";
import { usePeer } from "./hooks/usePeer";
import VideoPlayer from "./components/VideoPlayer";
import CallControls from "./components/CallControls";

function App() {
  const {
    peerId,
    remoteId,
    setRemoteId,
    callStarted,
    localStream,
    remoteStream,
    startCall,
    endCall,
  } = usePeer();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 text-center">
        <h1 className="text-2xl font-bold">Video Conference</h1>
        <p className="text-gray-400 text-sm mt-1">
          Your Peer ID:{" "}
          <span className="text-blue-400 font-mono">
            {peerId || "Connecting..."}
          </span>
        </p>
        <p className="text-gray-500 text-xs">
          Share this ID with others to call you
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl flex flex-col">
        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <VideoPlayer stream={localStream} label="You" isLocal />
          <VideoPlayer stream={remoteStream} label="Remote" />
        </div>

        {/* Controls */}
        <CallControls
          remoteId={remoteId}
          setRemoteId={setRemoteId}
          callStarted={callStarted}
          onStartCall={startCall}
          onEndCall={endCall}
        />
      </main>
    </div>
  );
}

export default App;
