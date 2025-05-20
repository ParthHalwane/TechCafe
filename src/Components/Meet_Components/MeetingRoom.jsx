// src/pages/MeetingRoom.jsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import VideoTile from "./VideoTitle";
import useWebRTC from "../../hooks/useWebRTC";
import { useSelector } from "react-redux";


export default function MeetingRoom() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { roomId } = useParams();
  const { clients, provideMediaRef } = useWebRTC(roomId);
  const userId = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    const handleRemoveUser = async () => {
      if (!userId) return;
      try {
        await fetch(`http://${backendURL}/api/room/remove-user`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            room_id: roomId
          }),
        });

      } catch (err) {
        console.error("Failed to remove user from room:", err);
      }
    };

    // ❗ Window unload (reload or tab close)
    window.addEventListener("beforeunload", handleRemoveUser);

    // ❗ Component unmount (navigate away)
    return () => {
      handleRemoveUser();
      window.removeEventListener("beforeunload", handleRemoveUser);
    };
  }, [roomId, userId]);
  return (
    <div className="h-screen bg-[#111] text-white p-6 flex flex-col gap-4">
      <motion.h1
        className="text-center text-2xl font-bold text-pink-400"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Welcome to Room {roomId}
      </motion.h1>

      <div className="grid grid-cols-2 gap-6 justify-center items-center flex-grow">
        {clients.map((clientID) => (
          <VideoTile
            key={clientID}
            clientID={clientID}
            provideMediaRef={provideMediaRef}
          />
        ))}
      </div>
    </div>
  );
}
