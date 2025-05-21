// src/components/VideoTile.jsx
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function VideoTile({ clientID, provideMediaRef }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
  if (videoRef.current) {
    provideMediaRef(clientID, videoRef.current);
    console.log(`[VideoTile] Media ref assigned for ${clientID}`);
  }
}, [clientID, provideMediaRef]);


  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="rounded-xl overflow-hidden shadow-md bg-[#1c1c1c] border border-pink-500"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={clientID === "You"} // ✅ Prevent echo for local video
        className="w-full h-64 object-cover rounded-xl"
      />
      <div className="p-2 text-center text-gray-300">
        {clientID === "You" ? "You" : `User: ${clientID}`}
      </div>
    </motion.div>
  );
}

// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";

// export default function VideoTile({ clientID, provideMediaRef }) {
//   const videoRef = useRef(null);
  
//   useEffect(() => {
//     provideMediaRef(clientID, videoRef.current);
//   }, [clientID]);

//   return (
//     <motion.div
//       initial={{ scale: 0.8, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       className="rounded-xl overflow-hidden shadow-md bg-[#1c1c1c] border border-pink-500"
//     >
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         className="w-full h-64 object-cover rounded-xl"
//       />
//       <div className="p-2 text-center text-gray-300">User: {clientID}</div>
//     </motion.div>
//   );
// }
