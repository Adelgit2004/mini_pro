import React, { useState } from "react";
import { BACKEND_URL } from "../config";

const languages = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  ml: "ml-IN",
};

function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en");
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = languages[language];
    recognition.onstart = () => setListening(true);

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setUserText(text);
      getAIResponse(text);
    };

    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const speak = (text) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languages[language];
    speechSynthesis.speak(utterance);
  };

  const getAIResponse = async (text) => {
    if (text.split(/\s+/).length > 50) {
      speak("Please limit input to fifty words.");
      return;
    }

    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, language }),
    });

    const data = await res.json();
    setAiText(data.reply);
    speak(data.reply);
  };

  return (
    <div>
      <h2>🇮🇳 AI Voice Assistant</h2>
      <select onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="ta">Tamil</option>
        <option value="ml">Malayalam</option>
      </select>
      <button onClick={startListening}>
        {listening ? "Listening..." : "Speak"}
      </button>
      <p><b>You:</b> {userText}</p>
      <p><b>AI:</b> {aiText}</p>
    </div>
  );
}

export default VoiceAssistant;
