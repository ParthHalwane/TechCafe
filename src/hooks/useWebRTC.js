import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebRTC(roomId) {
  const [clients, setClients] = useState([]);
  const peerConnections = useRef({});
  const mediaElements = useRef({});
  const localMediaStream = useRef(null);
  const ws = useRef(null);
  const [ownPeerID, setOwnPeerID] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const addNewClient = useCallback((clientID) => {
    setClients((prev) =>
      prev.includes(clientID) ? prev : [...prev, clientID]
    );
  }, []);

  useEffect(() => {
    const startCapture = async () => {
      console.log("[WebRTC] Starting media capture...");
      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        addNewClient("You");
        console.log("[WebRTC] Media capture successful.");
      } catch (err) {
        console.error("[WebRTC] Media device error:", err);
        alert("Please allow camera and microphone access.");
        return;
      }

      const wsURL = `wss://${backendURL.replace(/^https?:\/\//, "")}/ws/room/${roomId}/`;
      console.log("[WebRTC] Connecting to WebSocket:", wsURL);

      ws.current = new WebSocket(wsURL);

      ws.current.onopen = () => {
        console.log("[WebRTC] WebSocket connection opened.");
        ws.current.send(JSON.stringify({ action: "join", room_id: roomId }));
      };

      ws.current.onmessage = async ({ data }) => {
        const msg = JSON.parse(data);
        const { action, peerID, createOffer, sessionDescription, iceCandidate } = msg;
        console.log("[WebRTC] WS Message:", msg);

        switch (action) {
          case "assign-peer-id": {
            setOwnPeerID(peerID);
            console.log(`[WebRTC] Assigned own peer ID: ${peerID}`);
            break;
          }

          case "add-peer": {
            if (peerID === ownPeerID) return;
            if (peerConnections.current[peerID]) {
              console.log(`[WebRTC] Peer ${peerID} already connected.`);
              return;
            }

            console.log(`[WebRTC] Adding new peer: ${peerID}`);
            const newPC = new RTCPeerConnection();

            peerConnections.current[peerID] = newPC;

            localMediaStream.current.getTracks().forEach((track) => {
              newPC.addTrack(track, localMediaStream.current);
            });

            newPC.onicecandidate = (e) => {
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

            newPC.ontrack = ({ streams: [remoteStream] }) => {
              console.log(`[WebRTC] Received remote stream from ${peerID}`);
              addNewClient(peerID);

              const attachStream = () => {
                const videoEl = mediaElements.current[peerID];
                if (videoEl) {
                  videoEl.srcObject = remoteStream;
                } else {
                  setTimeout(attachStream, 300);
                }
              };
              attachStream();
            };

            if (createOffer) {
              console.log(`[WebRTC] Creating offer for ${peerID}`);
              const offer = await newPC.createOffer();
              await newPC.setLocalDescription(offer);
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

          case "session-description": {
            const existingPC = peerConnections.current[peerID];
            if (!existingPC) {
              console.warn(`[WebRTC] No connection for peer ${peerID}`);
              return;
            }

            console.log(`[WebRTC] Received SDP from ${peerID}`);
            await existingPC.setRemoteDescription(new RTCSessionDescription(sessionDescription));

            if (sessionDescription.type === "offer") {
              const answer = await existingPC.createAnswer();
              await existingPC.setLocalDescription(answer);
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

          case "ice-candidate": {
            const conn = peerConnections.current[peerID];
            if (conn) {
              console.log(`[WebRTC] Adding ICE candidate from ${peerID}`);
              await conn.addIceCandidate(new RTCIceCandidate(iceCandidate));
            } else {
              console.warn(`[WebRTC] No connection to add ICE candidate for ${peerID}`);
            }
            break;
          }

          case "remove-peer": {
            console.log(`[WebRTC] Removing peer ${peerID}`);
            if (peerConnections.current[peerID]) {
              peerConnections.current[peerID].close();
              delete peerConnections.current[peerID];
            }
            delete mediaElements.current[peerID];
            setClients((prev) => prev.filter((id) => id !== peerID));
            break;
          }

          default:
            console.warn(`[WebRTC] Unknown WS action: ${action}`);
            break;
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
      peerConnections.current = {};
      mediaElements.current = {};
      setClients([]);
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
