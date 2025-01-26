  import { useState, useRef } from "react";
  import { TiLocationArrow } from "react-icons/ti";
  import { useNavigate } from "react-router-dom"; // Import useNavigate

  export const BentoTilt = ({ children, className = "" }) => {
    const [transformStyle, setTransformStyle] = useState("");
    const itemRef = useRef(null);

    const handleMouseMove = (event) => {
      if (!itemRef.current) return;

      const { left, top, width, height } =
        itemRef.current.getBoundingClientRect();

      const relativeX = (event.clientX - left) / width;
      const relativeY = (event.clientY - top) / height;

      const tiltX = (relativeY - 0.5) * 5;
      const tiltY = (relativeX - 0.5) * -5;

      const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
      setTransformStyle(newTransform);
    };

    const handleMouseLeave = () => {
      setTransformStyle("");
    };

    return (
      <div
        ref={itemRef}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform: transformStyle }}
      >
        {children}
      </div>
    );
  };

  export const BentoCard = ({ src, title, description, isAvailable, onClick }) => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [hoverOpacity, setHoverOpacity] = useState(0);
    const hoverButtonRef = useRef(null);

    const handleMouseMove = (event) => {
      if (!hoverButtonRef.current) return;
      const rect = hoverButtonRef.current.getBoundingClientRect();

      setCursorPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setHoverOpacity(1);
    const handleMouseLeave = () => setHoverOpacity(0);

    return (
      <div className="relative size-full">
        <video
          src={src}
          loop
          muted
          autoPlay
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
        <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
          <div>
            <h1 className="bento-title special-font">{title}</h1>
            {description && (
              <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
            )}
          </div>

          {isAvailable && (
            <div
              ref={hoverButtonRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
              onClick={onClick} // Add onClick handler
            >
              {/* Radial gradient hover effect */}
              <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                  opacity: hoverOpacity,
                  background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
                }}
              />
              <TiLocationArrow className="relative z-20" />
              <p className="relative z-20">available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const Features = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
      <section id="models" className="bg-black pb-52">
        <div className="container mx-auto px-3 md:px-10">
          <div className="px-5 py-32">
            <p className="font-circular-web text-lg text-blue-50">
              Step Into NexMind’s Wonderland
            </p>
            <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
              A Universe Where Reality and Fantasy Collide. Brace yourself for a
              seamless blend of cutting-edge AI magic, turning your world into an
              endless adventure.
            </p>
          </div>

          <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
            <BentoCard
              src="videos/feature-1.mp4"
              title={
                <>
                  Girlfrie<b>n</b>d AI
                </>
              }
              description="Ever wished for a partner who always understands you, never complains, and is always there? Meet our Girlfriend AI—designed to bring sweetness and companionship to your digital life."
              isAvailable
              onClick={() => navigate("/girlfriend-ai")} // Navigate to Girlfriend AI page
            />
          </BentoTilt>

          <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
            <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
              <BentoCard
                src="videos/feature-2.mp4"
                title={
                  <>
                    Doppelgäng<b>e</b>r AI
                  </>
                }
                description="Imagine having a digital twin that remembers every story, photo, and video. Our Doppelgänger AI captures your daily moments, making it easy to relive your cherished memories anytime."
                isAvailable
                onClick={() => navigate("/doppelganger-ai")} // Navigate to Doppelgänger AI page
              />
            </BentoTilt>

            <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
              <BentoCard
                src="videos/feature-3.mp4"
                title={
                  <>
                    Fri<b>e</b>nd AI
                  </>
                }
                description="Need someone to chat with, brainstorm ideas, or just have a laugh? Our Friend AI is your go-to buddy, always ready to lend an ear or share a witty remark."
                isAvailable
                onClick={() => navigate("/friend-ai")} // Navigate to Friend AI page
              />
            </BentoTilt>

            <BentoTilt className="bento-tilt_2">
              <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
                <h1 className="bento-title special-font max-w-64 text-black">
                  M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
                </h1>
                <TiLocationArrow className="m-5 scale-[5] self-end" />
              </div>
            </BentoTilt>
          </div>
        </div>
      </section>
    );
  };

  export default Features;
