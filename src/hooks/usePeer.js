import { useState, useRef, useEffect, useCallback } from "react";
import { Peer } from "peerjs";

export const usePeer = () => {
  const [peerId, setPeerId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [callStarted, setCallStarted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const peerInstance = useRef(null);
  const callInstance = useRef(null);

  // Initialize Peer
  useEffect(() => {
    const peer = new Peer({
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          // Add TURN here if needed
        ],
      },
    });

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("Your Peer ID:", id);
    });

    peer.on("call", (call) => {
      // If localStream exists, answer immediately
      if (localStream) {
        call.answer(localStream);
        call.on("stream", (remote) => {
          setRemoteStream(remote);
          setCallStarted(true);
        });
        callInstance.current = call;
      } else {
        // Else get media first
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
  }, []); // Only once

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

  // Start a call
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

  // End call
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
    setIsAudioMuted(false);
    setIsVideoOff(false);
  }, [localStream]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, [localStream]);

  return {
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
    getLocalMedia,
  };
};
