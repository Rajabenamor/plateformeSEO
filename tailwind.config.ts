import type { Config } from "tailwindcss";

const config : Config ={
    darkMode:"class", // This is the magic line that makes the Moon/Sun toggle work!
    content:[
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme:{
        extend:{
            colors:{
                // This links your Tailwind classes to the globals.css variables
                background:"var(--background)",
                foreground:"var(--foreground)",
                card:"var(--card)",
                primary:"var(--primary)",
                border:"var(--border)",
                border_card:"var(--border-card)",
            },
        },
    },
    plugins:[],

};

export default config;