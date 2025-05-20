// src/pages/Room.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import MatchmakingLobby from "../components/Meet Components/MatchmakingLobby";
import { useSelector } from "react-redux";
export default function Room() {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const handlePublicJoin = async () => {
    setWaiting(true);
    if (!user) {
      alert("User not logged in.");
      return;
    }

    try {
      // 1. Enqueue the user
      console.log("Sending req to join queue");
      const res = await axios.post(`http://${backendURL}/api/matchmaking/join-queue`, {
        domain: "coding",
        user_id: user.github_id,
                 // domain selected
        // room_type: "coding",      // same as room type in backend logic
      });
      console.log(res);
      // 2. Poll for room formation
      // const pollForRoom = async () => {
      //   try {
      //     const response = await axios.get("http://localhost:8000/api/queue/dequeue", {
      //       params: {
      //         domain: "coding",
      //         room_type: "coding"
      //       }
      //     });
      //     console.log(response);
      //     if (response.data.users && response.data.users.length === 1) {
      //       const roomId = response.data.users.map(u => u.user_id).sort().join("-");
      //       navigate(`/room/${roomId}`);
      //     } else {
      //       setTimeout(pollForRoom, 2000);
      //     }
      //   } catch (pollError) {
      //     console.error("Polling failed", pollError);
      //     setTimeout(pollForRoom, 3000); // Retry after a while
      //   }
      // };

      // pollForRoom();
    } catch (err) {
      console.error("Matchmaking error", err);
      alert("Unable to join queue.");
      setWaiting(false);
    }
  };

  if (waiting) return <MatchmakingLobby />;

  return (
    <section className="px-6 py-20 bg-[#121212]" id="rooms">
      <h3 className="text-4xl font-bold text-white text-center mb-6">Explore Rooms</h3>
      <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
        Choose how you want to collaborate. Join an open space or create a secure environment with private access.
      </p>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-[#1e1e1e] to-[#2c2c2c] border border-pink-400 rounded-2xl p-8 shadow-md hover:shadow-pink-500/30 transition-all duration-300 group"
        >
          <h4 className="text-2xl font-semibold text-pink-300 mb-3 group-hover:text-white transition">
            🌐 Join a Public Room
          </h4>
          <p className="text-gray-300 mb-6">
            Jump into a public room with developers from around the world. Share ideas, collaborate on challenges,
            and meet new people in real-time.
          </p>
          <button
            onClick={handlePublicJoin}
            className="bg-pink-400 text-black px-5 py-2 rounded-lg font-medium hover:bg-pink-300 transition duration-300"
          >
            Enter Public Room
          </button>
        </motion.div>
      </div>
    </section>
  );
}




// src/pages/Room.jsx
// import { motion } from "framer-motion";

// export default function Room() {
//   return (
//     <section className="px-6 py-20 bg-[#121212]" id="rooms">
//       <h3 className="text-4xl font-bold text-white text-center mb-6">Explore Rooms</h3>
//       <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
//         Choose how you want to collaborate. Join an open space or create a secure environment with private access.
//       </p>

//       <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
//         {/* Public Room Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           whileHover={{ scale: 1.03 }}
//           className="bg-gradient-to-br from-[#1e1e1e] to-[#2c2c2c] border border-pink-400 rounded-2xl p-8 shadow-md hover:shadow-pink-500/30 transition-all duration-300 group"
//         >
//           <h4 className="text-2xl font-semibold text-pink-300 mb-3 group-hover:text-white transition">
//             🌐 Join a Public Room
//           </h4>
//           <p className="text-gray-300 mb-6">
//             Jump into a public room with developers from around the world. Share ideas, collaborate on challenges,
//             and meet new people in real-time.
//           </p>
//           <button className="bg-pink-400 text-black px-5 py-2 rounded-lg font-medium hover:bg-pink-300 transition duration-300">
//             Enter Public Room
//           </button>
//         </motion.div>

//         {/* Private Room Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           whileHover={{ scale: 1.03 }}
//           className="bg-gradient-to-br from-[#1e1e1e] to-[#2c2c2c] border border-blue-400 rounded-2xl p-8 shadow-md hover:shadow-blue-500/30 transition-all duration-300 group"
//         >
//           <h4 className="text-2xl font-semibold text-blue-300 mb-3 group-hover:text-white transition">
//             🔒 Join a Private Room
//           </h4>
//           <p className="text-gray-300 mb-6">
//             Prefer a focused session? Use or share a room code to join a private room. Ideal for teams, friends,
//             or invite-only hackathons.
//           </p>
//           <button className="bg-blue-400 text-black px-5 py-2 rounded-lg font-medium hover:bg-blue-300 transition duration-300">
//             Enter Private Room
//           </button>
//         </motion.div>
//       </div>
//     </section>
//   );
// }
