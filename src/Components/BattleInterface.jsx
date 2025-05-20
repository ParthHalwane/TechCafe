import React, { useEffect, useState } from "react";
import axios from "axios";
import CodeEditor from "./CodeEditor"; 
import BattleEndPopup from "./BattleEndPopup"; 


const BattleInterface = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            setChallengeOver(true);
        }, 15 * 60 * 1000); // 15 minutes

        return () => clearTimeout(timer); // cleanup
    }, []);


    const [questions, setQuestions] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [userId, setUserId] = useState("derty");
    const [submitted, setSubmitted] = useState(false);

    // Remove defaultSnippets, instead track the boilerplate code fetched from backend
    const [boilerplateCode, setBoilerplateCode] = useState({
        Q1: "", Q2: "", Q3: ""
    });

    const [languageMap, setLanguageMap] = useState({
        Q1: "java",
        Q2: "java",
        Q3: "java"
    });

    const [codeMap, setCodeMap] = useState({
        Q1: "", Q2: "", Q3: ""
    });

    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8000/api/questions/get-questions/${userId}`)
            .then(async (res) => {
                setQuestions(res.data.questions);

                const newBoilerplateCode = {};
                const newCodeMap = {};
                const newLanguageMap = {};

                res.data.questions.forEach((question, index) => {
                    const key = `Q${index + 1}`;
                    newBoilerplateCode[key] = question.boilerplate_code_user;
                    newLanguageMap[key] = "java";
                    newCodeMap[key] = question.boilerplate_code_user["java"] || "";
                });

                setBoilerplateCode(newBoilerplateCode);
                setCodeMap(newCodeMap);
                setLanguageMap(newLanguageMap);

                // 👇 Fetch room_id
                const roomRes = await axios.get(`http://localhost:8000/api/get-room/${userId}`);
                setRoomId(roomRes.data.room_id);
            })
            .catch(err => console.error(err));
    }, [userId]);


    const handleCodeChange = (tabIndex, code) => {
        setCodeMap(prev => ({ ...prev, [tabIndex]: code }));
    };

    const handleSubmit = async () => {
        const code = codeMap[`Q${activeTab + 1}`];
        const language = languageMap[`Q${activeTab + 1}`];

        const payload = {
            user_id: userId,
            room_id: roomId,
            question_id: activeTab, 
            code: code,
            language: language,
        };


        try {
            const res = await axios.post("http://localhost:8000/api/questions/submit-code", payload);
            console.log("Submission Result:", res.data);
            console.log("Payload:", payload);
            setSubmitted(true);
            alert("Code submitted successfully!");
            if (res.data.all_test_cases_passed) {
                setSolvedMap(prev => ({
                    ...prev,
                    [activeTab]: true,
                }));
            }

        } catch (err) {
            console.error("Submission Error:", err);
            alert("Error submitting code. Try again.");
        }
    };


    const activeQuestion = questions[activeTab];

    // const [roomId, setRoomId] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8000/api/get-room/${userId}`)
            .then(res => {
                setRoomId(res.data.room_id);  // Add a useState for roomId
            })
            .catch(err => {
                console.error("Error fetching room ID:", err);
            });
    }, [userId]);

    const [challengeEnded, setChallengeEnded] = useState(false);
    const [countdown, setCountdown] = useState(20);

    useEffect(() => {
        let timer;
        if (challengeEnded && countdown > 0) {
            timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        } else if (challengeEnded && countdown === 0) {
            triggerNewChallenge();
        }
        return () => clearTimeout(timer);
    }, [challengeEnded, countdown]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setChallengeEnded(true);
        }, 15 * 60 * 1000); // 15 minutes
        return () => clearTimeout(timer);
    }, []);


    const triggerNewChallenge = async () => {
        try {
            await axios.post(`http://localhost:8000/api/generate_questions/${roomId}`);
            setChallengeEnded(false);
            setCountdown(20);
            window.location.reload(); // or refetch questions programmatically
        } catch (err) {
            console.error("Failed to generate new questions", err);
        }
    };

    const [challengeOver, setChallengeOver] = useState(false);
    const [solvedMap, setSolvedMap] = useState({ 0: false, 1: false, 2: false });
    // const [challengeOver, setChallengeOver] = useState(false);


    useEffect(() => {
        const allSolved = Object.values(solvedMap).every(Boolean);
        if (allSolved) {
            setChallengeOver(true);
        }
    }, [solvedMap]);



    return (
        <div style={{ padding: "20px" }}>
            <h2>Welcome, {userId}</h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {questions.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        style={{
                            padding: "10px",
                            fontWeight: activeTab === index ? "bold" : "normal",
                            backgroundColor: activeTab === index ? "#d0d0ff" : "#eee",
                            borderRadius: "5px"
                        }}
                    >
                        Q{index + 1}
                    </button>
                ))}
            </div>

            {activeQuestion && (
                <div>
                    <h3>Q{activeTab + 1}: {activeQuestion.question}</h3>
                    <pre>Sample Test Case 1: {activeQuestion.test_cases[0].input} → {activeQuestion.test_cases[0].output}</pre>
                    <pre>Sample Test Case 2: {activeQuestion.test_cases[1].input} → {activeQuestion.test_cases[1].output}</pre>

                    <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>

                        <label>
                            Language:
                            <select
                                value={languageMap[`Q${activeTab + 1}`]}
                                onChange={(e) => {
                                    const selectedLang = e.target.value;
                                    const key = `Q${activeTab + 1}`;

                                    setLanguageMap(prev => ({ ...prev, [key]: selectedLang }));

                                    setCodeMap(prev => ({
                                        ...prev,
                                        [key]: boilerplateCode[key][selectedLang] || ""
                                    }));


                                    // Update code editor content with new boilerplate
                                    setCodeMap(prev => ({
                                        ...prev,
                                        [key]: boilerplateCode[key][selectedLang] || ""
                                    }));
                                }}
                                style={{ marginLeft: "8px", padding: "5px" }}
                            >
                                <option value="java">Java</option>
                                <option value="python">Python</option>
                                <option value="c++">C++</option>
                            </select>

                        </label>

                    </div>

                    <CodeEditor
                        code={codeMap[`Q${activeTab + 1}`]}
                        onChange={(code) => handleCodeChange(`Q${activeTab + 1}`, code)}
                        language={languageMap[`Q${activeTab + 1}`]}
                    />



                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <button
                            onClick={handleSubmit}
                            style={{ padding: "10px 30px", fontWeight: "bold", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "6px" }}
                        >
                            ✅ Submit
                        </button>
                    </div>
                </div>
            )}

            {challengeEnded && (
                <div style={{
                    position: 'fixed',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -30%)',
                    padding: '30px',
                    background: 'white',
                    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                    borderRadius: '10px',
                    textAlign: 'center',
                    zIndex: 999
                }}>
                    <h3>Challenge ended!</h3>
                    <p>New game starting in {countdown} seconds</p>
                    <button onClick={() => {
                        // Shuffle logic here
                        console.log("User chose to shuffle");
                    }} style={{ marginRight: "10px" }}>🔀 Shuffle</button>
                    <button onClick={() => {
                        // Leave logic here
                        console.log("User chose to leave");
                    }}>❌ Leave Room</button>
                </div>
            )}

            {challengeOver && (
                <BattleEndPopup
                    roomId={roomId}
                    onReshuffle={() => {
                        // user clicks reshuffle — optional behavior here
                        console.log("User clicked reshuffle");
                    }}
                    onLeave={() => {
                        window.location.href = "/";
                    }}
                />
            )}


        </div>

        
    );
};

export default BattleInterface;
