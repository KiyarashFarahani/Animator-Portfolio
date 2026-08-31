"use client";

import Image from "next/image";

interface SoftwareLogoProps {
  name: string;
  className?: string;
  showLabel?: boolean;
}

const logoMap: Record<string, { file: string; alt: string }> = {
  "Moho": { file: "/logos/moho.svg", alt: "Moho" },
  "Toon Boom Harmony": { file: "/logos/toon-boom-harmony.svg", alt: "Toon Boom Harmony" },
  "TVPaint": { file: "/logos/tvpaint.svg", alt: "TVPaint" },
  "Adobe Photoshop": { file: "/logos/adobe-photoshop.svg", alt: "Adobe Photoshop" },
  "Procreate": { file: "/logos/procreate.svg", alt: "Procreate" },
  "Adobe Premiere Pro": { file: "/logos/adobe-premiere-pro.svg", alt: "Adobe Premiere Pro" },
};

export default function SoftwareLogo({
  name,
  className = "",
  showLabel = false,
}: SoftwareLogoProps) {
  const logo = logoMap[name];

  const tile = logo ? (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900/50 ring-1 ring-white/10 sm:h-12 sm:w-12">
      <Image
        src={logo.file}
        alt={logo.alt}
        width={40}
        height={40}
        className="object-contain"
        unoptimized
      />
    </span>
  ) : (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900/50 px-1 text-center text-[10px] font-medium leading-tight text-white ring-1 ring-white/10 sm:h-12 sm:w-12 sm:text-xs">
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
