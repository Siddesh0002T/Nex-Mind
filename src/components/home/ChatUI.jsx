import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { database } from "../../firebaseConfig";
import { ref, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const ChatUI = () => {
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(window.speechSynthesis);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const emailKey = user.email.replace(/\./g, "_");
      setUserEmail(emailKey);
      fetchChatHistory(emailKey);
    }
    // Initialize Speech Recognition API
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    setSpeechRecognition(recognition);
  }, [auth]);

  const fetchChatHistory = (emailKey) => {
    const chatRef = ref(database, `chats/${emailKey}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatHistory = Object.values(data);
        setMessages(chatHistory);
      }
    });
  };

  const saveMessageToFirebase = (message) => {
    if (userEmail) {
      const chatRef = ref(database, `chats/${userEmail}`);
      push(chatRef, message);
    }
  };

  const handleSendMessage = async (message) => {
    const userMessage = { text: message, sender: "user" };
    setMessages([...messages, userMessage]);
    setLoading(true);
    saveMessageToFirebase(userMessage);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message,
        model: "default-ai",
      });
      const aiResponse = {
        text: response.data.response,
        sender: "ai",
        audioUrl: response.data.audio_url,
      };
      setMessages((prev) => [...prev, aiResponse]);
      saveMessageToFirebase(aiResponse);

      // Play AI's response audio
      const utterance = new SpeechSynthesisUtterance(aiResponse.text);
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      const errorMessage = { text: "Error: Unable to connect to AI.", sender: "ai" };
      setMessages((prev) => [...prev, errorMessage]);
      saveMessageToFirebase(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    setIsCalling(true);
    speechRecognition.start();

    speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      if (event.results[0].isFinal) {
        handleSendMessage(transcript);
      }
    };
  };

  const handleEndCall = () => {
    setIsCalling(false);
    speechRecognition.stop();
  };

  return (
    <div>
      <div>Chat AI</div>

      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <div>
              {message.text}
              {message.audioUrl && (
                <audio controls>
                  <source src={message.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
        ))}
        {loading && <div>Typing...</div>}
      </div>

      {isCalling ? (
        <div>
          <button onClick={handleEndCall}>End Call</button>
        </div>
      ) : (
        <div>
          <button onClick={handleCall}>Call</button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatUI;
