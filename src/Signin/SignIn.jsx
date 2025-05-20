import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice"; // adjust path

const SignIn = () => {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL; // e.g. http://localhost:8000

  // Check if token is valid on mount
  useEffect(() => {
    console.log("Loading");
    fetch("http://127.0.0.1:8000/test-cors", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(console.log)
      .catch(console.error);
    console.log("User response:");
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/users/me`, {
          withCredentials: true,
        });
        dispatch(setUser(res.data)); // store user in Redux
      } catch (err) {
        dispatch(setUser(null)); // Not logged in
      } finally {
        setCheckingAuth(false);
      }
    };


    fetchUser();
  }, [backendURL]);

  const handleGithubLogin = () => {
  window.location.href = `${backendURL}/auth/github/login`;
  
};


  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        Checking authentication...
      </div>
    );
  }

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
          {user
            ? `Hello, ${user.username}! You are signed in.`
            : "Sign in with your GitHub account to continue exploring, collaborating, and coding."}
        </p>

        {!user ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-3 bg-pink-500 hover:bg-pink-400 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 w-full shadow-md"
          >
            <FaGithub size={24} />
            Sign in with GitHub
          </motion.button>
        ) : (
          <div className="text-green-400 font-semibold">
            ✅ You are already logged in.
          </div>
        )}

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
