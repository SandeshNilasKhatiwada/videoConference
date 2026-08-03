import React from "react";

const CallControls = ({
  remoteId,
  setRemoteId,
  callStarted,
  onStartCall,
  onEndCall,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
      {!callStarted ? (
        <>
          <input
            type="text"
            placeholder="Enter remote Peer ID"
            value={remoteId}
            onChange={(e) => setRemoteId(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onStartCall}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Call
          </button>
        </>
      ) : (
        <button
          onClick={onEndCall}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
        >
          End Call
        </button>
      )}
    </div>
  );
};

export default CallControls;
