import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import HomePage from "./Components/HomePage";
import { Route, Routes } from "react-router-dom";
import SignIn from "./Signin/SignIn";
import OAuthCallback from "./Signin/GitHubCallback.jsx";
import Layout from "./Layout";
import AuthGuard from "./Signin/AuthGuard.jsx"
import Room from "./Components/Room.jsx";
import MeetingRoom from "./Components/Meet Components/MeetingRoom.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import axios from "axios";
import MatchmakingLobby from "./components/Meet Components/MatchmakingLobby.jsx";

function App() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  useEffect(() => {
    axios.get(`${backendURL}/api/users/me`, { withCredentials: true })
      .then(res => dispatch(setUser(res.data)))
      .catch(() => dispatch(setUser(null)));
  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<HomePage />} />
          <Route path="/lobby" element={<MatchmakingLobby/>} />
          <Route path="signin" element={<SignIn />} />
          <Route path="auth/github/callback" element={<OAuthCallback/>} />
          <Route path="/room/:roomId" element={<MeetingRoom/>} />

          {/* Protected Routes */}
          <Route
            path="rooms"
            element={
              <AuthGuard>
                <Room/>
              </AuthGuard>
            }
          />
          {/* <Route
            path="hackarena"
            element={
              <AuthGuard>
                <HackArena />
              </AuthGuard>
            }
          />
          <Route
            path="pods"
            element={
              <AuthGuard>
                <Pods />
              </AuthGuard>
            }
          />
          <Route
            path="devs"
            element={
              <AuthGuard>
                <Devs />
              </AuthGuard>
            }
          />
          <Route
            path="contact"
            element={
              <AuthGuard>
                <Contact />
              </AuthGuard>
            }
          /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
