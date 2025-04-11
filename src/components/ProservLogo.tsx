// src/components/ProservLogo.tsx
import Image from 'next/image';

export const ProservLogo = ({ size = 80 }) => (
  <div className="flex items-center justify-center">
    {/* Option 1: If you have an actual logo file */}
    <Image 
      src="/logo.webp" // Place your logo in the public folder
      alt="Proserv Logo"
      width={size}
      height={size}
    />
    
    {/* Option 2: If you don't have a logo file yet, use a text placeholder */}
    {/* <div 
      className="flex items-center justify-center bg-primary text-white font-bold rounded-full"
      style={{ width: size, height: size }}
    >
      PS
    </div> */}
  </div>
);