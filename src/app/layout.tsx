'use client';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { AuthProvider } from '@/providers/AuthProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Effect to load theme preference from localStorage
  useEffect(() => {
    // Set mounted to true when component mounts
    setMounted(true);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Effect to apply dark mode and save preference
  useEffect(() => {
    if (!mounted) return;
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode, mounted]);

  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          {children}
          
          {/* Only render button after mounting to prevent hydration mismatch */}
          {mounted && (
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
          )}
        </AuthProvider>
      </body>
    </html>
  );
}