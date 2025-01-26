import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { database } from "../../firebaseConfig";
import { ref, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const ChatUI = () => {
  const location = useLocation();
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(window.speechSynthesis);

  // Theme configuration based on route
  const getTheme = () => {
    if (location.pathname === "/girlfriend-ai") {
      return {
        bg: "bg-gradient-to-b from-pink-500 to-red-400",
        text: "text-pink-100",
        header: "Girlfriend AI",
        inputBg: "bg-pink-200",
        buttonBg: "bg-red-500",
        model: "girlfriend-ai",
      };
    } else if (location.pathname === "/friend-ai") {
      return {
        bg: "bg-gradient-to-b from-blue-500 to-green-400",
        text: "text-blue-100",
        header: "Friend AI",
        inputBg: "bg-blue-200",
        buttonBg: "bg-green-500",
        model: "friend-ai",
      };
    } else if (location.pathname === "/doppelganger-ai") {
      return {
        bg: "bg-gradient-to-b from-gray-700 to-gray-900",
        text: "text-gray-200",
        header: "Doppelgänger AI",
        inputBg: "bg-gray-600",
        buttonBg: "bg-gray-800",
        model: "doppelganger-ai",
      };
    }
    return {
      bg: "bg-white",
      text: "text-black",
      header: "Chat AI",
      inputBg: "bg-gray-100",
      buttonBg: "bg-gray-300",
      model: "default-ai",
    };
  };

  const theme = getTheme();

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
        model: theme.model,
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
    <div className={`${theme.bg} ${theme.text} min-h-screen flex flex-col`}>
      <div className="p-4 text-center text-2xl font-bold shadow-md">{theme.header}</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender === "user" ? "text-right" : "text-left text-gray-800"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {message.text}
              {message.audioUrl && (
                <audio controls className="mt-2">
                  <source src={message.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left text-gray-800">
            <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-black">
              Typing...
            </div>
          </div>
        )}
      </div>

      {isCalling ? (
        <div className="p-4 flex items-center space-x-4 bg-red-200 shadow-md">
          <button onClick={handleEndCall} className="px-4 py-2 bg-red-500 text-white rounded-lg">
            End Call
          </button>
        </div>
      ) : (
        <div className={`p-4 flex items-center space-x-4 ${theme.inputBg} shadow-md`}>
          <button onClick={handleCall} className={`px-4 py-2 rounded-lg ${theme.buttonBg} text-white`}>
            Call
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage(input)}
            className={`px-4 py-2 rounded-lg ${theme.buttonBg} text-white`}
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
