"use client";

import Image from "next/image";

interface SoftwareLogoProps {
  name: string;
  className?: string;
}

const logoMap: Record<string, { file: string; alt: string }> = {
  "Moho": { file: "/logos/moho.svg", alt: "Moho" },
  "Toon Boom Harmony": { file: "/logos/toon-boom-harmony.svg", alt: "Toon Boom Harmony" },
  "TVPaint": { file: "/logos/tvpaint.svg", alt: "TVPaint" },
  "Adobe Photoshop": { file: "/logos/adobe-photoshop.svg", alt: "Adobe Photoshop" },
  "Procreate": { file: "/logos/procreate.svg", alt: "Procreate" },
  "Adobe Premiere Pro": { file: "/logos/adobe-premiere-pro.svg", alt: "Adobe Premiere Pro" },
};

export default function SoftwareLogo({ name, className = "" }: SoftwareLogoProps) {
  const logo = logoMap[name];

  if (!logo) {
    return (
      <span className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-900/50 ring-1 ring-white/10 text-white text-xs font-medium ${className}`}>
        {name}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-900/50 ring-1 ring-white/10 ${className}`}>
      <Image
        src={logo.file}
        alt={logo.alt}
        width={40}
        height={40}
        className="object-contain"
        unoptimized
      />
    </span>
  );
}