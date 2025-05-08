import React, { useState } from "react";
import AceEditor from "react-ace";
import axios from "axios";

// Themes
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-solarized_dark";

// Modes (languages)
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/snippets/java";


import "ace-builds/src-noconflict/ext-language_tools";


const pistonLangMap = {
    python: "python3",
    c_cpp: "c++",
    java: "java"
};
  


const CodeEditor = ({ code, onChange, language, onLanguageChange }) => {
    const [theme, setTheme] = useState("monokai");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        setOutput("");

        const payload = {
            language: pistonLangMap[language], // map Ace language to Piston
            version: "*", // use latest version
            files: [
                {
                    name: pistonLangMap[language],
                    content: code,
                },
            ],
        };

        try {
            const response = await axios.post("http://localhost:8000/run-code", payload);
            const result = response.data;

            if (result.run.stdout) {
                setOutput(result.run.stdout);
            } else if (result.run.stderr) {
                setOutput("Error:\n" + result.run.stderr);
            } else {
                setOutput("No output or unknown error.");
            }
        } catch (err) {
            console.error("Execution error:", err);
            setOutput("Failed to run code: " + err.message);
        }

        setLoading(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>
                <label>
                    Theme:
                    <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ marginLeft: "5px", padding: "5px" }}>
                        <option value="monokai">Monokai</option>
                        <option value="github">GitHub</option>
                        <option value="solarized_dark">Solarized Dark</option>
                    </select>
                </label>

            </div>

            <AceEditor
                mode={language}
                theme={theme}
                onChange={onChange}  // Pass `onChange` prop to update the code
                name="code_editor"
                editorProps={{ $blockScrolling: true }}
                value={code}
                fontSize={16}
                width="100%"
                height="400px"
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />

{/* I have commented the 'Run code' and 'Show output' code, because we want users to trust their own code and submit it without running, LOL */}

            {/* <div style={{ marginTop: "15px", textAlign: "center" }}>
                <button onClick={handleRun} disabled={loading} style={{ padding: "10px 20px", fontWeight: "bold" }}>
                    {loading ? "⏳ Running..." : "▶️ Run"}
                </button>
            </div> */}

            {/* <div style={{ marginTop: "20px", backgroundColor: "#f4f4f4", padding: "15px", borderRadius: "5px" }}>
                <strong>Output:</strong>
                <pre style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>{output}</pre>
            </div> */}
        </div>
    );
};



export default CodeEditor;
