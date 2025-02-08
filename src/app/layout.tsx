'use client';

import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [darkMode, setDarkMode] = useState(false);

  // Effect to load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Effect to apply dark mode and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <head>
        <title>Proserv SSV Control Panel</title>
        <meta 
          name="description" 
          content="IoT / Remote Controlled RPi with Automated Pressure Monitoring System" 
        />
        <link rel="icon" href="/logo.webp" />
        <link rel="apple-touch-icon" href="/logo.webp" />
      </head>
      <body className={`${inter.className} bg-background dark:bg-background-dark text-text-primary dark:text-foreground`}>
        {children}
        
        {/* Dark Mode Toggle Button */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="fixed bottom-4 right-4 z-50 
            bg-gray-200 dark:bg-gray-700 
            text-gray-800 dark:text-white
            p-2 rounded-full shadow-lg 
            transition-colors duration-300"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </body>
    </html>
  );
}