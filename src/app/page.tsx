import ScrollExpand from '@/components/ScrollExpand';

export default function Home() {
  return (
    <ScrollExpand
      src="/character& concept/Co/02.jpg"
      mediaType="image"
      alt="Concept art"
      title="Masoud Azad"
      scrollHint="Scroll to explore"
      useWindowScroll
      className="h-screen"
      startWidth={60}
      startHeight={48}
      startRadius={20}
    />
  );
}
