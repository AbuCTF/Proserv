// src/components/ProservLogo.tsx
import Image from 'next/image';

export const ProservLogo = ({ size = 80 }) => (
  <Image
    src="/logo.webp"
    alt="Proserv SSV Control Panel Logo"
    width={size}
    height={size}
    className="object-contain"
  />
);