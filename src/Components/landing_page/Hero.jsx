import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Hero.css";
const CRAZY_NOTIFICATIONS = [
  "Start your day with a tasty breakfast! ✨",
  "Quick and easy meals under 30 mins! ⏱️",
  "Fuel your day with something delicious! 🔥",
  "Cooking is love made edible. ❤️",
  "Discover new recipes every day! 🍳",
  "Snacks, meals, and desserts – all in one place! 🍿",
];
export default function Hero() {
  const [greeting, setGreeting] = useState("");
  const [notification, setNotification] = useState("");
  const [notifIndex, setNotifIndex] = useState(0);
  // Set greeting and notification based on the time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting("Good Morning");
      setNotification("Don't skip breakfast! Have a quick meal to fuel your day. 🍳");
    } else if (hours >= 12 && hours < 17) {
      setGreeting("Good Afternoon");
      setNotification("Time for lunch! Grab a tasty and filling meal to power through. 🥗");
    } else if (hours >= 17 && hours < 21) {
      setGreeting("Good Evening");
      setNotification("Hungry after a long day? Try some snacks for the evening. 🍿");
    } else {
      setGreeting("Night Hunger");
      setNotification("Before sleep, try a light and delicious dinner.🍝");
    }
  }, []);
  // Cycle through "crazy" notifications every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % CRAZY_NOTIFICATIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="hero-heading"
      >
        👋 Hey, {greeting} Taylor!
      </motion.h1>
      <p className="hero-subheading">{notification}</p>
      <motion.div
        key={notifIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="hero-notification"
      >
        {CRAZY_NOTIFICATIONS[notifIndex]}
      </motion.div>
    </section>
  );
}