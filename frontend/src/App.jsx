import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [tool, setTool] = useState('');
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [tone, setTone] = useState('formal');
  const [language, setLanguage] = useState('Hindi');

  const runTool = async () => {
    let res;
    try {
      if (tool === 'summarize') {
        res = await axios.post('http://localhost:5000/summarize', { text });
        setOutput(res.data.summary);
      } else if (tool === 'translate') {
        res = await axios.post('http://localhost:5000/translate', { text, targetLang: language });
        setOutput(res.data.translatedText);
      } else if (tool === 'generate-email') {
        res = await axios.post('http://localhost:5000/generate-email', { topic: text, tone });
        setOutput(res.data.email);
      }
    } catch (error) {
      setOutput('Error while processing your request.');
    }
  };

  return (
    <div className="container">
      <h1>Smart Utility Tool Dashboard</h1>

      <div className="card-container">
        <div className="card" onClick={() => setTool('summarize')}>
          <h3>Summarize Text</h3>
          <p>Generate a short summary from input text.</p>
        </div>

        <div className="card" onClick={() => setTool('translate')}>
          <h3>Translate Text</h3>
          <p>Convert text to another language.</p>
        </div>

        <div className="card" onClick={() => setTool('generate-email')}>
          <h3>Email Generator</h3>
          <p>Generate an email based on topic and tone.</p>
        </div>
      </div>

      {tool && (
        <div className="tool-section">
          <h2>{tool.replace('-', ' ').toUpperCase()}</h2>

          <textarea
            placeholder={tool === 'generate-email' ? "Enter email topic..." : "Enter your text..."}
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {tool === 'generate-email' && (
            <div className="dropdown">
              <label>Select Tone: </label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          )}

          {tool === 'translate' && (
            <div className="dropdown">
              <label>Select Language: </label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="Hindi">Hindi</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          )}

          <button onClick={runTool}>Run</button>

          <div className="output-box">
            <h4>Output:</h4>
            <pre>{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
