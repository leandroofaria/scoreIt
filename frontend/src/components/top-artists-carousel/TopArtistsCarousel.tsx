"use client";

import { useEffect, useState, useRef } from "react";
import { Artist } from "@/types/Artist";
import { ArtistCard } from "@/components/artist-card/ArtistCard";
import { ArrowLeftIcon as IconArrowLeft, ArrowRightIcon as IconArrowRight } from "lucide-react";
import { fetchTopArtists } from "@/services/service_top_artists";

export default function TopArtistsCarouselSection() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const load = async () => {
      const data = await fetchTopArtists();
      setArtists(data);
      setLoading(false);
    };

    load();
  }, []);

  const checkScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    const newScrollLeft =
      direction === "left"
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();
      return () => carousel.removeEventListener("scroll", checkScrollButtons);
    }
  }, [artists]);

  useEffect(() => {
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  const arrowButtonClass = "bg-darkgreen text-white hover:brightness-110 transition-all";

  if (loading) {
    return <div className="text-center text-white py-10">Carregando artistas...</div>;
  }

  if (artists.length === 0) {
    return <div className="text-center text-white py-10">Nenhum artista encontrado.</div>;
  }

  return (
    <div className="w-full py-6">
      <h2 className="text-xl font-bold text-white mb-4">Top Artistas</h2>

      <div className="relative">
        <div
          id="top-artists-carousel"
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto px-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          <style jsx>{`
            #top-artists-carousel::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {artists.map((artist, index) => (
            <ArtistCard key={artist.id} artist={artist} index={index} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex gap-4">
            <button
              onClick={() => scroll("left")}
              className={`group/button flex h-8 w-8 items-center justify-center rounded-full ${
                !showLeftButton ? "opacity-50 cursor-not-allowed" : arrowButtonClass
              }`}
              disabled={!showLeftButton}
              aria-label="Scroll left"
            >
              <IconArrowLeft className="h-5 w-5 group-hover/button:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`group/button flex h-8 w-8 items-center justify-center rounded-full ${
                !showRightButton ? "opacity-50 cursor-not-allowed" : arrowButtonClass
              }`}
              disabled={!showRightButton}
              aria-label="Scroll right"
            >
              <IconArrowRight className="h-5 w-5 group-hover/button:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
