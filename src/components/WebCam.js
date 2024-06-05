import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

const WebCam = () => {
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef();

  useEffect(() => {
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    getMedia();

    socket.on("offer", (offer) => {
      const newPeer = new Peer({ initiator: false, trickle: false, stream });
      newPeer.signal(offer);
      setPeer(newPeer);
    });

    socket.on("answer", (answer) => {
      peer.signal(answer);
    });

    socket.on("ice-candidate", (candidate) => {
      peer.addIceCandidate(candidate);
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [peer, stream]);

  useEffect(() => {
    if (peer) {
      peer.on("stream", (remoteStream) => {
        videoRef.current.srcObject = remoteStream;
      });

      peer.on("signal", (data) => {
        socket.emit("signal", data);
      });

      peer.on("error", (error) => {
        console.error("Peer error:", error);
      });
    }
  }, [peer]);

  const handleCall = () => {
    const newPeer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
    });
    setPeer(newPeer);

    newPeer.on("signal", (data) => {
      socket.emit("signal", data);
    });

    newPeer.on("stream", (remoteStream) => {
      videoRef.current.srcObject = remoteStream;
    });

    newPeer.on("error", (error) => {
      console.error("Peer error:", error);
    });
  };

  return (
    <div>
      <div>
        <video ref={videoRef} autoPlay playsInline muted={!stream}></video>
      </div>
      <button onClick={handleCall}>Call</button>
    </div>
  );
};

export default WebCam;
