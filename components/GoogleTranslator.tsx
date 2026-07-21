"use client";

import { useEffect, useState } from "react";

export default function GoogleTranslator() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    // 1. Helper to retrieve cookie by name
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    // 2. Read the standard Google Translate cookie
    const currentTrans = getCookie("googtrans");
    if (currentTrans === "/en/am") {
      setLang("am");
    } else {
      setLang("en");
    }

    // 3. Declare Google Translate script init callback
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,am",
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // 4. Load the Google Translate web element script
    const existing = document.getElementById("google-translate-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // 5. Active style observer interval to override Google Translate inline offsets
    const interval = setInterval(() => {
      if (document.body) {
        if (document.body.style.top !== "0px" && document.body.style.top !== "") {
          document.body.style.setProperty("top", "0px", "important");
        }
        if (document.body.style.position === "relative") {
          document.body.style.setProperty("position", "static", "important");
        }
      }
      const htmlEl = document.documentElement;
      if (htmlEl) {
        if (htmlEl.style.top !== "0px" && htmlEl.style.top !== "") {
          htmlEl.style.setProperty("top", "0px", "important");
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Set the standard Google translation cookies and trigger reload
  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "am" : "en";
    const cookieValue = nextLang === "am" ? "/en/am" : "/en/en";

    // Set cookie on base path
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    
    // Set cookie on current hostname and root domains
    const host = window.location.hostname;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${host};`;

    if (host.includes(".")) {
      const parts = host.split(".");
      if (parts.length >= 2) {
        const rootDomain = parts.slice(-2).join(".");
        document.cookie = `googtrans=${cookieValue}; path=/; domain=.${rootDomain};`;
      }
    }

    // Reload the page to activate the translation script
    window.location.reload();
  };

  return (
    <div className="flex items-center">
      {/* Hidden google translate container required for the script to load */}
      <div id="google_translate_element" style={{ display: "none" }} />
      
      <button
        onClick={toggleLanguage}
        className="flex items-center justify-center border border-ink/20 hover:border-ink rounded-full w-10 h-10 text-lg text-ink bg-white/40 hover:bg-zinc-100/50 transition-all duration-300 shadow-sm"
        title={lang === "en" ? "Translate to አማርኛ" : "Switch to English"}
        aria-label="Translate website"
      >
        🌐
      </button>
    </div>
  );
}
