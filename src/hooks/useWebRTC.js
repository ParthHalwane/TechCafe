import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebRTC(roomId) {
  const [clients, setClients] = useState([]);
  const peerConnections = useRef({});
  const mediaElements = useRef({});
  const localMediaStream = useRef(null);
  const ws = useRef(null);
  const [ownPeerID, setOwnPeerID] = useState(null);

  const addNewClient = useCallback((clientID) => {
    setClients((prev) => (!prev.includes(clientID) ? [...prev, clientID] : prev));
  }, []);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const startCapture = async () => {
     try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        addNewClient("You");
      } catch (error) {
        console.error("Failed to access media devices:", error);
        alert("Please allow camera and microphone access.");
        return;
      }

      // ✅ Connect to Django Channels WebSocket
      ws.current =  new WebSocket(`wss://${backendURL.replace(/^https?:\/\//, '')}/ws/room/${roomId}`);
     
      ws.current.onopen = () => {
        ws.current.send(JSON.stringify({ action: "join", room_id: roomId }));
      };

      ws.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        const { action, peerID, createOffer, sessionDescription, iceCandidate } = data;

        switch (action) {
          case "add-peer": {
            
            if (peerID === ownPeerID || peerConnections.current[peerID]) return;
            

            const pc = new RTCPeerConnection();
            peerConnections.current[peerID] = pc;

            localMediaStream.current.getTracks().forEach((track) => {
              pc.addTrack(track, localMediaStream.current);
            });
            pc.ontrack = ({ streams: [remoteStream] }) => {
              addNewClient(peerID);

              // Save the remote stream temporarily
              if (mediaElements.current[peerID]) {
                mediaElements.current[peerID].srcObject = remoteStream;
              } else {
                // Wait and assign once the ref becomes available
                const interval = setInterval(() => {
                  if (mediaElements.current[peerID]) {
                    mediaElements.current[peerID].srcObject = remoteStream;
                    clearInterval(interval);
                  }
                }, 500);
              }
            };

            // pc.ontrack = ({ streams: [remoteStream] }) => {
            //   addNewClient(peerID);
            //   if (mediaElements.current[peerID]) {
            //     mediaElements.current[peerID].srcObject = remoteStream;
            //   }
            // };

            pc.onicecandidate = (e) => {
              if (e.candidate) {
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

          case "session-description": {
            const pc = peerConnections.current[peerID];
            await pc.setRemoteDescription(new RTCSessionDescription(sessionDescription));

            if (sessionDescription.type === "offer") {
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
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
            const pc = peerConnections.current[peerID];
            if (pc) {
              await pc.addIceCandidate(new RTCIceCandidate(iceCandidate));
            }
            break;
          }

          case "remove-peer": {
            if (peerConnections.current[peerID]) {
              peerConnections.current[peerID].close();
            }

            delete peerConnections.current[peerID];
            delete mediaElements.current[peerID];
            setClients((prev) => prev.filter((c) => c !== peerID));
            break;
          }
          case "assign-peer-id": {
            setOwnPeerID(peerID);
            break;
          }

          default:
            break;
        }
      };
    };

    startCapture();

    return () => {
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
    if (clientID === "You") {
      node.srcObject = localMediaStream.current;
    }
  };

  return { clients, provideMediaRef };
}
