"use client";

import Image from "next/image";

interface SoftwareLogoProps {
  name: string;
  className?: string;
  showLabel?: boolean;
}

const logoMap: Record<string, { file: string; alt: string }> = {
  "Moho": { file: "/logos/Moho.png", alt: "Moho" },
  "Toon Boom Harmony": { file: "/logos/Toon Boom Harmony.png", alt: "Toon Boom Harmony" },
  "TVPaint": { file: "/logos/TVPaint.png", alt: "TVPaint" },
  "Adobe Photoshop": { file: "/logos/Photoshop.png", alt: "Adobe Photoshop" },
  "Procreate": { file: "/logos/Procreate.png", alt: "Procreate" },
  "Adobe Premiere Pro": { file: "/logos/Premiere Pro.png", alt: "Adobe Premiere Pro" },
};

export default function SoftwareLogo({
  name,
  className = "",
  showLabel = false,
}: SoftwareLogoProps) {
  const logo = logoMap[name];

  const tile = logo ? (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900/50 ring-1 ring-white/10 sm:h-10 sm:w-10 lg:h-11 lg:w-11">
      <Image
        src={logo.file}
        alt={logo.alt}
        width={36}
        height={36}
        className="object-contain"
      />
    </span>
  ) : (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900/50 px-1 text-center text-[9px] font-medium leading-tight text-white ring-1 ring-white/10 sm:h-10 sm:w-10 sm:text-xs lg:h-11 lg:w-11 lg:text-sm">
      {name}
    </span>
  );

  if (!showLabel) return tile;

  return (
    <span className={`inline-flex flex-col items-center gap-2 ${className}`}>
      {tile}
      <span className="text-xs font-medium text-white/60">{name}</span>
    </span>
  );
}
