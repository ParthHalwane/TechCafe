import React, { useEffect, useState } from "react";
import axios from "axios";
import CodeEditor from "./CodeEditor"; // assuming your existing code editor is in the same directory

const BattleInterface = () => {
    const [questions, setQuestions] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [userId] = useState("aa"); // statically set, or replace with actual user ID if needed

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/questions/get-questions/${userId}`)
            .then((res) => setQuestions(res.data.questions))
            .catch((err) => console.error("Error fetching questions:", err));
    }, [userId]);

    return (
        <div style={{ display: "flex", height: "100vh", padding: "20px", gap: "20px" }}>
            {/* Left: Tabs + Question */}
            <div style={{ flex: "0 0 40%", borderRight: "1px solid #ccc", paddingRight: "20px" }}>
                {/* Tabs */}
                <div style={{ display: "flex", marginBottom: "10px", gap: "10px" }}>
                    {questions.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveTab(idx)}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: activeTab === idx ? "#007bff" : "#f0f0f0",
                                color: activeTab === idx ? "#fff" : "#000",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Q{idx + 1}
                        </button>
                    ))}
                </div>

                {/* Question Content */}
                {questions.length > 0 && (
                    <div>
                        <h2 style={{ marginBottom: "10px" }}>
                            Q{activeTab + 1}: {questions[activeTab].question}
                        </h2>

                        <h3 style={{ marginTop: "20px" }}>Sample Test Cases</h3>
                        <ul style={{ paddingLeft: "20px" }}>
                            {questions[activeTab].test_cases.slice(0, 2).map((tc, i) => (
                                <li key={i} style={{ marginBottom: "10px" }}>
                                    <strong>Input:</strong> {tc.input}
                                    <br />
                                    <strong>Expected Output:</strong> {tc.output}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Right: Code Editor */}
            <div style={{ flex: "0 0 60%", paddingLeft: "20px" }}>
                <CodeEditor />
            </div>
        </div>
    );
};

export default BattleInterface;
