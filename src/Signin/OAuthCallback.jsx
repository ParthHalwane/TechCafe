// src/pages/OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    fetch("http://localhost:8000/api/auth/github/callback/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then(({ token, user }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("techcafe_user", JSON.stringify(user));
        navigate("/"); // redirect to homepage or dashboard
      })
      .catch((err) => {
        console.error("GitHub login failed:", err);
        navigate("/signin");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Processing GitHub login...
    </div>
  );
};

export default OAuthCallback;