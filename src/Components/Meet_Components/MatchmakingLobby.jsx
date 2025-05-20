// src/pages/MatchmakingLobby.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function MatchmakingLobby() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.currentUser);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    if (!userId?.github_id) return;

    // Enqueue user into the matchmaking system
    // fetch("http://localhost:8000/api/queue/enqueue", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ user_id: userId.github_id }),
    // });

    // Listen for room assignment via SSE
    const eventSource = new EventSource(
      `${backendURL}/api/queue/join?user_id=${userId.github_id}`
    );

    eventSource.onmessage = (e) => {
      const { room_id } = JSON.parse(e.data);
      if (room_id) {
        navigate(`/room/${room_id}`);
        eventSource.close();
      }
    };

    return () => eventSource.close();
  }, [userId, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <h1 className="text-3xl font-semibold">Finding teammates...</h1>
        <p className="text-gray-400">Waiting for 3 more users to join</p>
        <div className="w-12 h-12 mx-auto border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
      </motion.div>
    </div>
  );
}
