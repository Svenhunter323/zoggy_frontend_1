import { useEffect, useRef } from "react";

export default function TelegramLoginButton({ onAuth = () => {} }) {
  const containerRef = useRef(null);
  const botUsername = import.meta.env.VITE_TG_BOT_USERNAME; // e.g. "zoggycasinobot"

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard
    if (!botUsername) {
      console.warn("[TelegramLoginButton] VITE_TG_BOT_USERNAME is missing");
      return;
    }
    // Install the global callback exactly once
    if (!window.__onTelegramAuth) {
      window.__onTelegramAuth = async function (user) {
        try {
          await onAuth(user);
        } catch (err) {
          console.error("Telegram login failed:", err);
          alert("Telegram login failed: " + (err?.message || err));
        }
      };
    }

    // Avoid duplicate widget insertion
    const container = containerRef.current;
    if (!container) return;
    if (container.querySelector("script[data-telegram-login]")) return;

    // Build the widget script with data-* attributes
    const s = document.createElement("script");
    s.src = "https://telegram.org/js/telegram-widget.js?22";
    s.async = true;
    s.setAttribute("data-telegram-login", botUsername);             // required: your bot username (no @)
    s.setAttribute("data-size", "large");                           // "large" | "medium" | "small"
    s.setAttribute("data-userpic", "true");                         // show avatar
    // When auth completes, Telegram calls the global below with a user object
    s.setAttribute("data-onauth", "window.__onTelegramAuth(user)");
    // s.setAttribute("data-onunauth", "window.__onTelegramAuth(user)");

    container.appendChild(s);

    // Cleanup: remove widget on unmount (optional)
    return () => {
      try {
        container.innerHTML = "";
      } catch {}
    };
  }, [botUsername, onAuth]);

  return (
    <div ref={containerRef} />
  );
}
