import React, { useEffect, useState } from "react";
import axios from "axios";
import CodeEditor from "./CodeEditor"; // assuming it's in the same directory

const BattleInterface = () => {
    const [questions, setQuestions] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [userId, setUserId] = useState("rr4");
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

    useEffect(() => {
        axios.get(`http://localhost:8000/api/questions/get-questions/${userId}`)
            .then(res => {
                setQuestions(res.data.questions);

                const newBoilerplateCode = {};
                const newCodeMap = {};
                const newLanguageMap = {};

                res.data.questions.forEach((question, index) => {
                    const key = `Q${index + 1}`;
                    newBoilerplateCode[key] = question.boilerplate_code_user;  // 👈 Only show user code
                    newLanguageMap[key] = "java";
                    newCodeMap[key] = question.boilerplate_code_user["java"] || "";  // 👈 Not boilerplate_code anymore
                });


                setBoilerplateCode(newBoilerplateCode);
                setCodeMap(newCodeMap);
                setLanguageMap(newLanguageMap);
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
        } catch (err) {
            console.error("Submission Error:", err);
            alert("Error submitting code. Try again.");
        }
    };


    const activeQuestion = questions[activeTab];

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
        </div>
    );
};

export default BattleInterface;
