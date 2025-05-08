// src/pages/SignIn.jsx
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const SignIn = () => {
  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = "http://localhost:5173/auth/github/callback"; // same as frontend GitHub callback route

    const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
    window.location.href = githubAuthURL;
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#1f1b17] to-[#292522] border border-pink-400 rounded-3xl shadow-xl max-w-md w-full p-10 text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Welcome to TechCafé</h2>
        <p className="text-gray-400 mb-8">
          Sign in with your GitHub account to continue exploring, collaborating, and coding.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGithubLogin}
          className="flex items-center justify-center gap-3 bg-pink-500 hover:bg-pink-400 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 w-full shadow-md"
        >
          <FaGithub size={24} />
          Sign in with GitHub
        </motion.button>

        <div className="mt-10 text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <a href="/terms" className="underline hover:text-pink-300">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-pink-300">
            Privacy Policy
          </a>.
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
