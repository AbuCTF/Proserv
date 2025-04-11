// src/components/LogoutButton.tsx
'use client';
import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/signin' })}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
    >
      Logout
    </button>
  );
};