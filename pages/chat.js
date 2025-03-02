import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  // In a real scenario, you'd preload the context (e.g. summary) and let it persist.
  const [context, setContext] = useState("Codebase summary context goes here...");

  const sendMessage = async () => {
    try {
      const response = await axios.post('/api/chat/', {
        message: userMessage,
        context: context,
        model_id: "ibm/granite-3-8b-instruct"
      });
      const answer = response.data.answer;
      setChatHistory([...chatHistory, { user: userMessage, bot: answer }]);
      setUserMessage("");
    } catch (error) {
      console.error("Chat error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat with Your Codebase</h1>
      <div>
        {chatHistory.map((turn, idx) => (
          <div key={idx}>
            <strong>User:</strong> {turn.user}<br/>
            <strong>Bot:</strong> {turn.bot}
            <hr />
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Enter your question"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
