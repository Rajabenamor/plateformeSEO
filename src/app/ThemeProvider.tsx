"use client";
// Dark mode / Light Mode


import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({children} : {children: ReactNode}){
//attribute="class" tells next-themes to inject a "dark" CSS class into the HTML code
return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
}