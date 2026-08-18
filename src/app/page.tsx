import ScrollExpand from '@/components/ScrollExpand';

export default function Home() {
  return (
    <ScrollExpand
      src="/character& concept/Co/02.jpg"
      mediaType="image"
      alt="Concept art"
      title="Masoud Azad"
      scrollHint=""
      useWindowScroll
      className="h-screen"
      startWidth={60}
      startHeight={48}
      startRadius={20}
    >
      <div className="self-start text-left mt-auto mb-[9%] sm:mb-[7%] ms-[8%] sm:ms-[6%]">
        <p className="text-white/70 text-base sm:text-lg mt-2 max-w-md drop-shadow">
            Hi, I'm
        </p>
        <h2 className="text-white text-4xl sm:text-6xl font-bold leading-tight drop-shadow-lg">
            Masoud Azad
        </h2>
        <p className="text-white/70 text-base sm:text-lg mt-2 max-w-md drop-shadow">
            2D Character Animator &amp; Visual Development Artist
        </p>
      </div>
    </ScrollExpand>
  );
}
