'use client'

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const SphereGif = () => {
  const pathname = usePathname();
  
  return (
    <div className="relative w-[350px] h-[350px] flex items-center justify-center">
      <Image
        src="/sphere.gif"
        alt="AI Sphere"
        width={350}
        height={350}
        className="object-contain"
        priority
      />
    </div>
  );
};

export default SphereGif;
