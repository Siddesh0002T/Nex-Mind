import React, { useEffect } from "react";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const { offsetTop, offsetHeight } = section;

      if (
        scrollPosition >= offsetTop &&
        scrollPosition < offsetTop + offsetHeight
      ) {
        const scrollbarColor = section.getAttribute("data-scrollbar-color");
        const backgroundColor = section.getAttribute("data-background-color");

        document.documentElement.style.setProperty(
          "--scrollbar-thumb",
          scrollbarColor
        );
        document.documentElement.style.setProperty(
          "--background-color",
          backgroundColor
        );
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <section
        id="hero"
        data-scrollbar-color="#0069fb"
        data-background-color="rgba(0, 0, 0, 0)"
        className="min-h-screen"
      >
        <Hero />
      </section>
      <section
        id="about"
        data-scrollbar-color="#ff0000"
        data-background-color="rgba(0, 0, 0, 0)"
        className="min-h-screen"
      >
        <About />
      </section>             
      <section
        id="features"
        data-scrollbar-color="#00ff00"
        data-background-color="#000"
        className="min-h-screen"
      >
        <Features />
      </section>
      <section
        id="story"
        data-scrollbar-color="#ff00ff"
        data-background-color="#fbeffb"
        className="min-h-screen"
      >
        <Story />
      </section>
      <section
        id="contact"
        data-scrollbar-color="#0000ff"
        data-background-color="#e6f0ff"
        className="min-h-screen"
      >
        <Contact />
      </section>
      <Footer />
    </main>
  );
}

export default App;
