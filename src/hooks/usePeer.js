import { useState, useRef, useEffect, useCallback } from "react";
import { Peer } from "peerjs";

export const usePeer = () => {
  const [peerId, setPeerId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [callStarted, setCallStarted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const peerInstance = useRef(null);
  const callInstance = useRef(null);

  // Initialize Peer on mount
  useEffect(() => {
    const peer = new Peer({
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          // Add TURN here if needed (e.g., from Xirsys)
        ],
      },
    });

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("Your Peer ID:", id);
    });

    // Handle incoming calls
    peer.on("call", (call) => {
      // If we already have a stream, answer immediately
      if (localStream) {
        call.answer(localStream);
        call.on("stream", (remote) => {
          setRemoteStream(remote);
          setCallStarted(true);
        });
        callInstance.current = call;
      } else {
        // Otherwise get the stream first
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            setLocalStream(stream);
            call.answer(stream);
            call.on("stream", (remote) => {
              setRemoteStream(remote);
              setCallStarted(true);
            });
            callInstance.current = call;
          })
          .catch((err) => console.error("Failed to get media", err));
      }
    });

    peerInstance.current = peer;

    return () => {
      if (callInstance.current) callInstance.current.close();
      peer.destroy();
    };
  }, []); // only run once

  // Get local media (for the caller)
  const getLocalMedia = useCallback(() => {
    return navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        return stream;
      })
      .catch((err) => console.error("Media error:", err));
  }, []);

  // Start a call to a remote peer
  const startCall = useCallback(async () => {
    if (!remoteId.trim()) {
      alert("Please enter a remote Peer ID");
      return;
    }

    try {
      let stream = localStream;
      if (!stream) {
        stream = await getLocalMedia();
        if (!stream) return;
      }

      const call = peerInstance.current.call(remoteId, stream);
      call.on("stream", (remote) => {
        setRemoteStream(remote);
        setCallStarted(true);
      });
      callInstance.current = call;
    } catch (err) {
      console.error("Call error:", err);
    }
  }, [remoteId, localStream, getLocalMedia]);

  // End the call and clean up
  const endCall = useCallback(() => {
    if (callInstance.current) {
      callInstance.current.close();
      callInstance.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setCallStarted(false);
  }, [localStream]);

  return {
    peerId,
    remoteId,
    setRemoteId,
    callStarted,
    localStream,
    remoteStream,
    startCall,
    endCall,
    getLocalMedia,
  };
};
