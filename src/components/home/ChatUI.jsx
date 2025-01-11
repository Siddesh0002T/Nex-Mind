import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; // For making API calls

const ChatUI = () => {
  const location = useLocation();

  // Determine the theme based on the current route
  const getTheme = () => {
    if (location.pathname === "/girlfriend-ai") {
      return {
        bg: "bg-gradient-to-b from-pink-500 to-red-400",
        text: "text-pink-100",
        header: "Girlfriend AI",
        inputBg: "bg-pink-200",
        buttonBg: "bg-red-500",
        model: "girlfriend-ai", // Model identifier for API
      };
    } else if (location.pathname === "/friend-ai") {
      return {
        bg: "bg-gradient-to-b from-blue-500 to-green-400",
        text: "text-blue-100",
        header: "Friend AI",
        inputBg: "bg-blue-200",
        buttonBg: "bg-green-500",
        model: "friend-ai", // Model identifier for API
      };
    } else if (location.pathname === "/doppelganger-ai") {
      return {
        bg: "bg-gradient-to-b from-gray-700 to-gray-900",
        text: "text-gray-200",
        header: "Doppelgänger AI",
        inputBg: "bg-gray-600",
        buttonBg: "bg-gray-800",
        model: "doppelganger-ai", // Model identifier for API
      };
    }
    return {
      bg: "bg-white",
      text: "text-black",
      header: "Chat AI",
      inputBg: "bg-gray-100",
      buttonBg: "bg-gray-300",
      model: "default-ai", // Default model identifier
    };
  };

  const theme = getTheme();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // For showing a loading indicator

  const handleSendMessage = async () => {
    if (input.trim()) {
      // Add the user's message to the chat
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setLoading(true);

      try {
        // Make API call to the Flask backend
        const response = await axios.post("http://localhost:5000/api/chat", {
          message: input,
          model: theme.model, // Send the model identifier
        });

        const aiResponse = response.data.response;
        const audioUrl = response.data.audio_url;

        // Add the AI's response to the chat
        setMessages((prev) => [
          ...prev,
          { text: aiResponse, sender: "ai", audioUrl },
        ]);
      } catch (error) {
        console.error("Error communicating with AI:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Error: Unable to connect to AI.", sender: "ai" },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 text-center text-2xl font-bold shadow-md">
        {theme.header}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender === "user"
                ? "text-right"
                : "text-left text-gray-800"
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

      {/* Input Area */}
      <div
        className={`p-4 flex items-center space-x-4 ${theme.inputBg} shadow-md`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className={`px-4 py-2 rounded-lg ${theme.buttonBg} text-white`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
