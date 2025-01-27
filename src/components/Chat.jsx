import React, { useRef } from "react";
import gsap from "gsap";

const FloatingImage = () => {
  const frameRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((yPos - centerY) / centerY) * -10;
    const rotateY = ((xPos - centerX) / centerX) * 10;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;

    if (element) {
      gsap.to(element, {
        duration: 0.3,
        rotateX: 0,
        rotateY: 0,
        ease: "power1.inOut",
      });
    }
  };

  return (
    <div className="relative">
      <div className="story-img-container">
        <div className="story-img-mask">
          <div className="story-img-content">
            <img
              ref={frameRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseLeave}
              onMouseEnter={handleMouseLeave}
              src="/img/entrance.jpg"
              alt="entrance.webp"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  return (
    <div>
      <h1>Chat Page</h1>
      {/* Add your chat component content here */}
      <FloatingImage /> {/* Floating image with animation */}
    </div>
  );
};

export default Chat;
