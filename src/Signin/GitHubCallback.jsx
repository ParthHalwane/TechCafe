import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GitHubCallback = () => {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    

    const code = urlParams.get("code");
    console.log(code);
    const fetchToken = async () => {
      try {
        console.log("Into fetch token");
        axios.post(`${backendURL}/api/auth/github/token`, {
          code: code,
        }, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        // console.log("Auth success:", res.data);
        navigate("/"); // Redirect to homepage or dashboard
      } catch (err) {
        console.error("Token exchange failed", err);
        navigate("/signin?error=auth_failed");
      }
    };

    if (code) fetchToken();
    else navigate("/signin?error=no_code");
  }, [backendURL, navigate]);

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
      Logging you in via GitHub...
    </div>
  );
};

export default GitHubCallback;
