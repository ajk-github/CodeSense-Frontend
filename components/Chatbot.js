// File: frontend/components/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';

export default function Chatbot({ context, modelId }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    setLoadingChat(true);
    try {
      const response = await axios.post('/api/chat/', {
        message: userMessage,
        context: context,
        model_id: modelId
      });
      const answer = response.data.answer;
      setChatHistory([...chatHistory, { user: userMessage, bot: answer }]);
      setUserMessage("");
    } catch (error) {
      console.error("Chat error:", error);
    }
    setLoadingChat(false);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Chatbot</h3>
      <div style={styles.chatWindow}>
        {chatHistory.map((turn, idx) => (
          <div key={idx} style={styles.chatMessage}>
            <strong style={styles.userText}>User:</strong> {turn.user}<br/>
            <strong style={styles.botText}>Bot:</strong> {turn.bot}
          </div>
        ))}
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Ask about the codebase..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button style={styles.button} onClick={sendMessage} disabled={loadingChat}>
          {loadingChat ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    padding: '20px',
    borderTop: '1px solid #333',   // Makes it flush with the parent component
    boxShadow: 'none',             // Removed shadow to make it sit flush
  },
  title: {
    marginBottom: '10px',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  chatWindow: {
    // Removed flexGrow: 1
    height: '300px',               // Fixed height so the chat area doesn't expand
    overflowY: 'auto',
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    color: '#ccc',
  },
  chatMessage: {
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '6px',
    backgroundColor: '#1e1e1e',
    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
  },
  userText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  botText: {
    color: '#FFC107',
    fontWeight: 'bold',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
    borderRadius: '30px',
    border: 'none',
    outline: 'none',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '1rem',
    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
  },
  button: {
    backgroundColor: '#ffffff',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '30px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease',
  },
};
