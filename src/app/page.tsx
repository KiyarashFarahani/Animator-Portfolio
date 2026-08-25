import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/Hero/dusha_02_bg.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover select-none pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent max-md:bg-gradient-to-t max-md:from-black/60 max-md:via-black/20" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col-reverse items-center justify-center gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:gap-4 md:px-12 lg:px-16 md:py-0">
        <div className="max-w-xl text-center md:text-left">
          <p className="text-white/75 text-lg sm:text-xl">Hi, I&apos;m</p>
          <h1 className="mt-2 text-5xl font-bold leading-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
            Masoud Azad
          </h1>
          <p className="mt-3 text-lg text-white/75 sm:text-xl">
            2D Character Animator &amp; Visual Development Artist
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
            <button
              type="button"
              className="rounded-full bg-white px-7 py-3 text-base font-semibold text-neutral-900 shadow-lg transition hover:bg-white/85 active:scale-95"
            >
              View Projects
            </button>
            <button
              type="button"
              className="rounded-full border border-white/40 px-7 py-3 text-base font-semibold text-white transition hover:border-white/70 hover:bg-white/10 active:scale-95"
            >
              About Me
            </button>
          </div>
        </div>

        <Image
          src="/Hero/dusha_02_CH.png"
          alt="Masoud Azad character illustration"
          width={3474}
          height={4961}
          priority
          sizes="(max-width: 768px) 80vw, 45vw"
          className="h-auto w-64 object-contain select-none drop-shadow-2xl sm:w-80 md:w-[42%] md:max-w-[560px] lg:w-[46%]"
          draggable={false}
        />
      </div>
    </main>
  );
}
