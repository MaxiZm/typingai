"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [stopwatch, setStopwatch] = useState(0); // Stopwatch in seconds
  const [isStopwatchActive, setIsStopwatchActive] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [language, setLanguage] = useState("English"); // Language state

  const fetchText = async (lang = "English") => {
    try {
      const response = await axios.get(`/api/text?lang=${lang}`);
      setDisplayText(response.data.text);
    } catch (error) {
      console.error("Error fetching text:", error);
    }
  };

  useEffect(() => {
    // Fetch the text whenever the language changes
    fetchText(language);
  }, [language]);

  useEffect(() => {
    let interval;
    if (isStopwatchActive) {
      interval = setInterval(() => {
        setStopwatch((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchActive]);

  const handleFirstKeyPress = () => {
    if (!isStopwatchActive) {
      setIsStopwatchActive(true);
    }
  };

  const handleSubmit = () => {
    const userInput = document.getElementById("userInput").value;
    const params = new URLSearchParams({
      time: stopwatch, // Total time recorded on the stopwatch
      typed_text: userInput,
      original_text: displayText,
    });
    window.location.href = `/result?${params.toString()}`;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const toggleLanguage = async () => {
    const newLanguage = language === "English" ? "Russian" : "English";
    setLanguage(newLanguage); // Trigger text regeneration
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl w-full">
        {/* Display Text */}
        <h2 className="text-lg md:text-2xl font-semibold mb-6 leading-relaxed overflow-y-auto max-h-64 text-gray-300">
          <span id="displayText">{displayText || "Loading text..."}</span>
        </h2>

        {/* Typing Input Field */}
        <div className="flex flex-col gap-4">
          <label htmlFor="userInput" className="text-sm font-medium text-gray-400">
            Your Input:
          </label>
          <textarea
            id="userInput"
            name="user_text"
            autoComplete="off"
            required
            onKeyDown={(event) => {
              handleFirstKeyPress();
              handleKeyDown(event);
            }}
            className="w-full h-40 p-4 bg-gray-700 rounded-lg text-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white shadow-inner hover:shadow-purple-500/50 focus:shadow-purple-500/50 transition-shadow"
          ></textarea>

          {/* Stopwatch */}
          <p id="stopwatch" className="text-lg font-bold text-gray-400">
            Time elapsed: {Math.floor(stopwatch / 60)}:{String(stopwatch % 60).padStart(2, "0")}
          </p>

          {/* Change Language Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="w-full md:w-auto bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Change Language (Current: {language})
          </button>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full md:w-auto bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
