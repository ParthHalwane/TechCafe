import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebRTC(roomId) {
  const [clients, setClients] = useState([]);
  const peerConnections = useRef({});
  const mediaElements = useRef({});
  const localMediaStream = useRef(null);
  const ws = useRef(null);
  const [ownPeerID, setOwnPeerID] = useState(null);

  const addNewClient = useCallback((clientID) => {
    setClients((prev) => {
      if (!prev.includes(clientID)) {
        console.log(`[WebRTC] Adding new client: ${clientID}`);
        return [...prev, clientID];
      }
      return prev;
    });
  }, []);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const startCapture = async () => {
      console.log("[WebRTC] Starting media capture...");
      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        addNewClient("You");
        console.log("[WebRTC] Media capture success.");
      } catch (error) {
        console.error("[WebRTC] Failed to access media devices:", error);
        alert("Please allow camera and microphone access.");
        return;
      }

      const wsURL = `wss://${backendURL.replace(/^https?:\/\//, "")}/ws/room/${roomId}`;
      console.log("[WebRTC] Connecting WebSocket to:", wsURL);

      ws.current = new WebSocket(wsURL);

      ws.current.onopen = () => {
        console.log("[WebRTC] WebSocket connection opened");
        ws.current.send(JSON.stringify({ action: "join", room_id: roomId }));
      };

      ws.current.onerror = (error) => {
        console.error("[WebRTC] WebSocket error:", error);
      };

      ws.current.onclose = (event) => {
        console.log("[WebRTC] WebSocket closed:", event);
      };

      ws.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("[WebRTC] Received WS message:", data);

        const { action, peerID, createOffer, sessionDescription, iceCandidate } = data;

        switch (action) {
          case "add-peer": {
            if (peerID === ownPeerID) {
              console.log("[WebRTC] Ignoring own add-peer action");
              return;
            }
            if (peerConnections.current[peerID]) {
              console.log(`[WebRTC] Already connected to peer ${peerID}`);
              return;
            }

            console.log(`[WebRTC] Adding peer connection for ${peerID}`);
            const pc = new RTCPeerConnection();
            peerConnections.current[peerID] = pc;

            localMediaStream.current.getTracks().forEach((track) => {
              pc.addTrack(track, localMediaStream.current);
            });

            pc.ontrack = ({ streams: [remoteStream] }) => {
              console.log(`[WebRTC] Received remote stream from ${peerID}`);
              addNewClient(peerID);

              if (mediaElements.current[peerID]) {
                mediaElements.current[peerID].srcObject = remoteStream;
              } else {
                const interval = setInterval(() => {
                  if (mediaElements.current[peerID]) {
                    mediaElements.current[peerID].srcObject = remoteStream;
                    clearInterval(interval);
                  }
                }, 500);
              }
            };

            pc.onicecandidate = (e) => {
              if (e.candidate) {
                console.log(`[WebRTC] Sending ICE candidate to ${peerID}`);
                ws.current.send(
                  JSON.stringify({
                    action: "relay-ice",
                    peerID,
                    iceCandidate: e.candidate,
                  })
                );
              }
            };

            if (createOffer) {
              console.log(`[WebRTC] Creating offer for ${peerID}`);
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              ws.current.send(
                JSON.stringify({
                  action: "relay-sdp",
                  peerID,
                  sessionDescription: offer,
                })
              );
            }
            break;
          }

          case "relay-sdp": {
            console.log(`[WebRTC] Received session description from ${peerID}`);
            const pc = peerConnections.current[peerID];
            await pc.setRemoteDescription(new RTCSessionDescription(sessionDescription));

            if (sessionDescription.type === "offer") {
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              console.log(`[WebRTC] Sending answer to ${peerID}`);
              ws.current.send(
                JSON.stringify({
                  action: "relay-sdp",
                  peerID,
                  sessionDescription: answer,
                })
              );
            }
            break;
          }

          case "relay-ice": {
            console.log(`[WebRTC] Adding ICE candidate from ${peerID}`);
            const pc = peerConnections.current[peerID];
            if (pc) {
              await pc.addIceCandidate(new RTCIceCandidate(iceCandidate));
            }
            break;
          }

          case "remove-peer": {
            console.log(`[WebRTC] Removing peer ${peerID}`);
            if (peerConnections.current[peerID]) {
              peerConnections.current[peerID].close();
            }
            delete peerConnections.current[peerID];
            delete mediaElements.current[peerID];
            setClients((prev) => prev.filter((c) => c !== peerID));
            break;
          }

          case "assign-peer-id": {
            console.log(`[WebRTC] Assigned own peer ID: ${peerID}`);
            setOwnPeerID(peerID);
            break;
          }

          default:
            console.warn(`[WebRTC] Unknown action: ${action}`);
        }
      };
    };

    startCapture();

    return () => {
      console.log("[WebRTC] Cleaning up...");
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => track.stop());
      }
      if (ws.current) {
        ws.current.close();
      }
      Object.values(peerConnections.current).forEach((pc) => pc.close());
    };
  }, [roomId, addNewClient]);

  const provideMediaRef = (clientID, node) => {
    mediaElements.current[clientID] = node;
    if (clientID === "You" && localMediaStream.current) {
      node.srcObject = localMediaStream.current;
    }
  };

  return { clients, provideMediaRef };
}
