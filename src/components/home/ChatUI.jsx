import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatUI = ({ modelName, aiType, bgImage }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { sender: "You", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
        type: aiType,
      });

      if (response.data.response) {
        setMessages([...newMessages, { sender: modelName, text: response.data.response }]);
      } else {
        setMessages([...newMessages, { sender: modelName, text: "No response from AI." }]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([...newMessages, { sender: modelName, text: "Error connecting to AI." }]);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-900"
      style={{ background: `url(${bgImage}) center/cover no-repeat` }}
    >
      <div className="w-full max-w-lg h-[85vh] flex flex-col bg-white/90 rounded-lg shadow-lg backdrop-blur-md overflow-hidden border border-gray-300">
        <div className="p-4 bg-gray-800 text-white text-center text-lg font-semibold">
          {modelName}
        </div>
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-4 py-2 max-w-[75%] text-sm ${msg.sender === "You" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-300 text-black rounded-bl-none"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-gray-300 bg-white flex items-center">
          <input
            type="text"
            className="flex-1 px-4 py-2 text-sm border rounded-full outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export const GFChat = () => <ChatUI modelName="Girlfriend AI" aiType="girlfriend-ai" bgImage="/img/gf-bg.jpg" />;
export const BFChat = () => <ChatUI modelName="Best Friend AI" aiType="friend-ai" bgImage="/img/bf-bg.jpg" />;
export const DGChat = () => <ChatUI modelName="Doppelganger AI" aiType="doppelganger-ai" bgImage="/img/dg-bg.jpg" />;

export default ChatUI;
