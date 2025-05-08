// Enhanced HomePage with animations, transitions, and improved interactivity
import { useEffect,useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaDiscord, FaLinkedin } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';

const imageData = [
    {
      id: 1,
      title: "Chill Vibes",
      src: "https://images.assetsdelivery.com/compings_v2/fizkes/fizkes1807/fizkes180700085.jpg", // Unsplash random image
      description: "Relax in our peaceful and chill spaces.",
    },
    {
      id: 2,
      title: "Competitive Esports",
      src: "https://us.v-cdn.net/6036147/uploads/GOQOTHGYG807/l-18-1-1200x675.jpg", // Different theme
      description: "Join thrilling esports competitions.",
    },
    {
      id: 3,
      title: "Podcast Moments",
      src: "https://ohoje.com/wp-content/uploads/2024/10/marketing-mentor-podcast-keszites-1024x578.jpg",
      description: "Listen to our latest tech podcasts.",
    },
  ];


const modules = [
  {
    name: 'TechCafé Rooms',
    description: 'Collaborate in real-time, explore AI-guided dev quests, and chill with fellow geeks.',
    features: ['Live Video Collab', 'AI Task Generator', 'Gamified Rooms'],
    href: '#techcafe-rooms',
    image:"https://4kwallpapers.com/images/walls/thumbs_3t/13640.png",
    alt:"TechCafe img",
  },
  {
    name: 'HackArena',
    description: 'Compete in fast-paced hack battles with team matchmaking and live scoring.',
    features: ['Team Matching', 'Live Leaderboard', 'AI Evaluation'],
    href: '#hackarena',
    image:"https://img.icons8.com/?size=160&id=wgH2Qk7mFnEl&format=png",
    alt:"Hackathon Img"
  },
  {
    name: 'Startup & Research Pods',
    description: 'Join pods to launch startup ideas or sprint through research challenges.',
    features: ['Innovation Pods', 'Idea Pitches', 'Mentor Feedback'],
    href: '#startup-pods',
    image:"https://www.crimsl.utoronto.ca/sites/www.crimsl.utoronto.ca/files/styles/ne_3btn_widget/public/podcast-7858186_1920%202960x2160.jpg?itok=mDcHw0UF",
    alt:"Startup & Research Pods Img",
  },
];

const testimonials = [
  '“Built my dream AI app here!”',
  '“Best place to hack & chill.”',
  '“Loved the live AI code evaluations.”',
  '“Incredible dev culture.”',
];

const sentences = [
    'Chill rooms, live hackathons & startup sparks await you.',
    'Work on exciting challenges with like-minded devs and innovators.',
    'Get feedback, grow your skills, and take your ideas to the next level.'
  ];

const devs = [
  {
    name: 'Lokesh Kad',
    role: 'Full-Stack Developer',
    github: 'https://github.com/lokeshkad21',
  },
  {
    name: 'Parth Halwame',
    role: 'Next Awesome Contributor',
    github: '#',
  },
];

export default function HomePage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageData.length);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    document.title = 'TechCafé – Chill Place for Devs';
  }, []);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentenceIndex((prevIndex) =>
        prevIndex === sentences.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change sentence every 4 seconds (adjust as needed)

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);
  return (
    <div className="bg-[#1e1b18] text-white font-sans scroll-smooth">
     

      {/* Hero Section */}
      <section className="text-center py-25 px-8 relative">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-pulse"
      >
        Where Geeks Hangout, Build & Battle
      </motion.h2>

      <motion.div className="relative">
        {sentences.map((sentence, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentSentenceIndex === index ? 1 : 0,
              transition: { duration: 1 }
            }}
            className="absolute inset-0 text-lg md:text-xl text-pink-200"
          >
            {sentence}
          </motion.p>
        ))}
      </motion.div>
    </section>
    
    <section className="py-10  text-white">
      <div className="flex justify-center">
        <div className="relative w-full max-w-4xl bg-gray-800 rounded-xl shadow-xl">
          {/* Image Carousel */}
          <motion.div
            key={imageData[currentImageIndex].id}
            className="relative w-full h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img
            className="w-full h-full object-cover rounded-xl"
            src={imageData[currentImageIndex].src}
            alt={imageData[currentImageIndex].title}
            />


            <div className="absolute inset-0 flex flex-col justify-center items-center backdrop-blur-2 bg-opacity-10 p-6">
              <motion.h3
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {imageData[currentImageIndex].title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-white/80"
              >
                {imageData[currentImageIndex].description}
              </motion.p>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 p-4">
            <button
              onClick={() =>
                setCurrentImageIndex(
                  currentImageIndex === 0 ? imageData.length - 1 : currentImageIndex - 1
                )
              }
              className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
            >
              &#10094;
            </button>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 p-4">
            <button
              onClick={() =>
                setCurrentImageIndex((currentImageIndex + 1) % imageData.length)
              }
              className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
            >
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </section>

      {/* Modules Section */}
      <section className="grid md:grid-cols-3 gap-8 px-6 pb-20" id="techcafe-rooms">
        
  {modules.map((mod, idx) => (
    <motion.div
      key={mod.name}
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-t from-[#2d2a26] to-[#3a3530] rounded-2xl p-6 border border-pink-300 shadow-xl group transition-all duration-500 hover:shadow-xl hover:shadow-pink-500/30 hover:bg-[#3a3530]"
    >
      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 * idx }}
        className="w-full h-48 mb-4 rounded-lg overflow-hidden flex items-center justify-center"
        >
        <img
            src={mod.image}
            alt={mod.name}
            className="w-[60%] max-h-full object-contain transition-opacity duration-300 group-hover:opacity-80"
        />
        </motion.div>



      {/* Module Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold text-pink-300 mb-2 group-hover:underline group-hover:text-white transition-all duration-300"
      >
        {mod.name}
      </motion.h3>

      {/* Module Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 * idx }}
        className="text-white/90 mb-4 text-lg font-medium leading-relaxed"
      >
        {mod.description}
      </motion.p>

      {/* Features List */}
      <ul className="text-sm text-white/70 space-y-1">
        {mod.features.map((f, i) => (
          <li key={i} className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-pink-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12l5 5L19 7"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  ))}
</section>


      {/* Animated Testimonials */}
      <section className="bg-[#292522] py-5 overflow-hidden" id="testimonials">
  <h3 className="text-3xl font-bold text-center text-white mb-6">What Devs Say</h3>

  <div className="relative  w-full">
    <div
      className="flex gap-10 whitespace-nowrap"
      style={{
        animation: 'marqueeLoop 30s linear infinite',
        willChange: 'transform',
        display: 'inline-flex',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
      onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
    >
      {[...testimonials, ...testimonials].map((msg, i) => (
        <div
          key={i}
          className="inline-block px-6 py-4 bg-[#1e1c1a] border border-pink-300 rounded-xl text-white text-sm min-w-[300px] max-w-[350px] shadow-md transition-all duration-300 hover:scale-105 hover:shadow-pink-500/30 hover:border-pink-400 hover:bg-[#292522]"
        >
          <p className="text-pink-200 font-semibold mb-1">@dev_user_{i % testimonials.length}</p>
          <p className="text-white/90">{msg}</p>
        </div>
      ))}
    </div>
  </div>

  <style>
    {`
      @keyframes marqueeLoop {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }
    `}
  </style>
</section>



      {/* Dev Team */}
      <section className="px-6 py-20 bg-black" id="devs">
  <h3 className="text-3xl font-bold text-white mb-14 text-center">Meet the Devs</h3>

  <div className="flex flex-wrap justify-between gap-6 max-w-3xl mx-auto">
    {devs.map((dev, index) => (
      <motion.div
        key={dev.name}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.03 }}
        className="group w-full sm:w-[48%] bg-gradient-to-br from-[#2d2a26] to-[#3a3530] border border-pink-300 rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-[0_0_20px_#ec4899] flex flex-col items-center text-center"
      >
        {/* Profile Image */}
        {dev.image ? (
          <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-pink-300">
            <img src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-24 h-24 mb-6 rounded-full border-2 border-pink-300 bg-gray-700 flex items-center justify-center text-white text-xl">
            {dev.name.charAt(0)}
          </div>
        )}

        {/* Name & Role */}
        <h4 className="text-xl font-bold text-pink-200 group-hover:text-white transition mb-1">
          {dev.name}
        </h4>
        <p className="text-white/80 text-sm mb-4">{dev.role}</p>

        {/* Social Links */}
        <div className="flex justify-center gap-4 text-2xl text-pink-400">
          {dev.github && (
            <a href={dev.github} target="_blank" rel="noopener noreferrer" className="hover:text-pink-200">
              <FaGithub />
            </a>
          )}
          {dev.twitter && (
            <a href={dev.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-pink-200">
              <FaTwitter />
            </a>
          )}
          {dev.linkedin && (
            <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-pink-200">
              <FaLinkedin />
            </a>
          )}
        </div>
      </motion.div>
    ))}
  </div>
</section>




      {/* Contact Form */}
      <section className="px-6 py-20 bg-black" id="contact">
  <motion.h3
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-3xl font-bold text-white mb-6 text-center"
  >
    Get in Touch
  </motion.h3>

  <motion.form
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="grid gap-5 max-w-xl mx-auto bg-gradient-to-br from-[#2d2a26] to-[#3a3530] p-8 rounded-2xl border border-pink-200 shadow-[0_0_30px_#ec489920]"
  >
    {/* Name Field */}
    <motion.input
      whileFocus={{ scale: 1.03 }}
      type="text"
      placeholder="Your Name"
      className="p-3 rounded-lg bg-[#1e1a17] text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
    />

    {/* Email Field */}
    <motion.input
      whileFocus={{ scale: 1.03 }}
      type="email"
      placeholder="Your Email"
      className="p-3 rounded-lg bg-[#1e1a17] text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
    />

    {/* Message Field */}
    <motion.textarea
      whileFocus={{ scale: 1.02 }}
      placeholder="Your Message"
      rows="5"
      className="p-3 rounded-lg bg-[#1e1a17] text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300 resize-none"
    ></motion.textarea>

    {/* Button */}
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 0 15px #ec4899" }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      className="bg-pink-500 hover:bg-pink-400 transition-all text-white font-semibold py-3 rounded-lg shadow-md"
    >
      🚀 Send Message
    </motion.button>
  </motion.form>
</section>

     
    </div>
  );
}