"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  //Only show the button after the browser has loaded to prevent hydration errors
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  //if we havent mounted yet, render a "placeholder" with the same dimensions
  //to prevent the layout shift
  if (!mounted) {
    return null;
    // return <div className="p-2 w-9 h-9"/>;
  }
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle Dark Mode" //Accessibility label added
      //transition-colors: This makes the background and text color change fade smoothly instead of instantly, harshly snapping.
      className="p-2 cursor-pointer rounded-md bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
