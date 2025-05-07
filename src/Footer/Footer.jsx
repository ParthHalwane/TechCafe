// src/components/Footer.jsx
import { FaGithub, FaTwitter, FaDiscord, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1e1a17] text-white py-12 px-6 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10"
      >
        {/* Brand Description */}
        <div>
          <h1 className="text-3xl font-bold text-pink-400 mb-2">TechCafé ☕</h1>
          <p className="text-sm text-white/70 leading-relaxed">
            A place to chill, collaborate, and create magic in tech.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-pink-300">Explore</h2>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/" className="hover:text-pink-400 transition">Home</Link></li>
            <li><Link to="/rooms" className="hover:text-pink-400 transition">Rooms</Link></li>
            <li><Link to="/hackarena" className="hover:text-pink-400 transition">HackArena</Link></li>
            <li><Link to="/pods" className="hover:text-pink-400 transition">Startup Pods</Link></li>
            <li><Link to="/devs" className="hover:text-pink-400 transition">Devs</Link></li>
            <li><Link to="/contact" className="hover:text-pink-400 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-pink-300">Connect</h2>
          <div className="flex space-x-4 text-xl">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-pink-400"><FaGithub /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-pink-400"><FaTwitter /></a>
            <a href="https://discord.gg" target="_blank" rel="noreferrer" className="hover:text-pink-400"><FaDiscord /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-pink-400"><FaLinkedin /></a>
          </div>
        </div>

        {/* Email Subscription */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-pink-300">Subscribe</h2>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Your email"
              className="bg-[#2a2421] text-white px-4 py-2 rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-4 rounded-lg transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </motion.div>

      {/* Footer Note */}
      <div className="mt-12 border-t border-white/10 pt-6 text-sm text-center text-white/60">
        <p>© {new Date().getFullYear()} TechCafé. Built with 💻 + ☕ by passionate devs.</p>
      </div>
    </footer>
  );
}