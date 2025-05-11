import React, { useEffect, useState } from "react";
import axios from "axios";

const BattleEndPopup = ({ onReshuffle, onLeave, roomId }) => {
    const [timer, setTimer] = useState(20);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    clearInterval(interval);
                    regenerateQuestions(); // auto-trigger
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const regenerateQuestions = async () => {
        try {
            await axios.post(`http://localhost:8000/api/questions/generate_questions/${roomId}`);
            window.location.reload();
        } catch (err) {
            console.error("Regeneration failed", err);
        }
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
                <h2>Challenge Over</h2>
                <p>New challenge in {timer}s...</p>
                <button onClick={onReshuffle} style={{ marginRight: "10px" }}>🔁 Reshuffle</button>
                <button onClick={onLeave}>🚪 Leave</button>
            </div>
        </div>
    );
};

export default BattleEndPopup;
