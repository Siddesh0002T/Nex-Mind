import React, { useState, useEffect, useRef } from "react";

const DG = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const API_URL = "https://be8d-2409-40c2-6053-ce31-c8db-46e3-c3ea-508f.ngrok-free.app/api/chat";
  const chatContainerRef = useRef(null);

  const randomResponses = [
    "Hey man, caught up with some stuff right now. I'll hit you up when I’m free! 👊",
    // more responses...
  ];

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue, type: "doppelganger-ai" }),
      });

      const data = await response.json();

      setTimeout(() => {
        setIsTyping(false);
        if (data.messages) {
          setMessages((prev) => [
            ...prev,
            ...data.messages.map((msg, index) => ({
              id: prev.length + index + 1,
              text: msg.message,
              sender: msg.sender,
              isImage: isImageUrl(msg.message),
            })),
          ]);
        } else if (data.response) {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              text: data.response,
              sender: "ai",
              isImage: isImageUrl(data.response),
            },
          ]);
        }
      }, 1500);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setTimeout(() => {
        setIsTyping(false);
        const randomResponse =
          randomResponses[Math.floor(Math.random() * randomResponses.length)];
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: randomResponse,
            sender: "ai",
            isImage: false,
          },
        ]);
      }, 1500);
    }
  };

  const isImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative h-screen w-full text-white flex flex-col">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(/img/Doppelagnger.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />

      <div className="fixed top-0 left-0 right-0 bg-black bg-opacity-70 py-4 text-center z-10">
        <h1 className="text-2xl font-bold text-white">Doppelganger</h1>
      </div>

      <div
        ref={chatContainerRef}
        className="flex flex-col flex-grow overflow-y-auto pt-20 pb-24 px-4 relative z-10"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            {msg.sender === "ai" && !msg.isImage && (
              <span className="text-white font-bold mr-2">AI</span>
            )}

            <div
              className={`rounded-xl p-3 max-w-[70%] ${
                msg.sender === "user"
                  ? "bg-white bg-opacity-40 text-black"
                  : "bg-black bg-opacity-50 text-white"
              }`}
            >
              {msg.isImage ? (
                <img
                  src={msg.text}
                  alt="AI Response"
                  className="rounded-xl w-full"
                />
              ) : (
                msg.text
              )}
            </div>

            {msg.sender === "user" && (
              <span className="text-white font-bold ml-2">You</span>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-2">
            <span className="text-white font-bold mr-2">AI</span>
            <div className="bg-black bg-opacity-50 text-white rounded-xl p-3 max-w-[70%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-20 p-4 z-30">
        <div className="flex items-center rounded-lg bg-black bg-opacity-30 p-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white outline-none p-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-white bg-opacity-20 text-white rounded-lg px-4 py-2 hover:bg-opacity-30 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default DG;
