import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import HomePage from "./Components/HomePage";
import { Route, Routes } from "react-router-dom";
import SignIn from "./Signin/SignIn";
import OAuthCallback from "./Signin/OAuthCallback";
import Layout from "./Layout";
import AuthGuard from "./Signin/AuthGuard.jsx"
import Room from "./Components/Room.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="auth/github/callback" element={<OAuthCallback/>} />
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
