// src/app/[locale]/series/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Series } from "@/types/Series";
import { FaHeart, FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import Image from "next/image";
import { useMember } from "@/context/MemberContext";
import { isFavoritedMedia } from "@/services/user/is_favorited";
import { addFavouriteSeries } from "@/services/series/add_fav_series";
import { removeFavouriteMedia } from "@/services/user/remove_fav";
import toast from "react-hot-toast";
import RatingModal from "@/components/features/review/RatingModal";
import ReviewSection from "@/components/features/review/ReviewSection";

export default function SeriePage() {
  const { id } = useParams<{ id: string }>();
  const [serie, setSerie] = useState<Series | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(false); // ✅ novo state
  const { member } = useMember();

  useEffect(() => {
    const loadSerie = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:8080/series/${id}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();
        setSerie(data);
      } catch (err) {
        console.error("Erro ao buscar detalhes da série:", err);
      }
    };

    loadSerie();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (member) {
        const fav = await isFavoritedMedia(member.id, Number(id));
        setIsFavorited(fav);
      }
    };
    checkFavorite();
  }, [member, id]);

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !member || !serie) return;

    if (isFavorited) {
      const success = await removeFavouriteMedia(member.id, serie.id, "series");
      if (success) {
        toast.success("Removido dos favoritos");
        setIsFavorited(false);
      } else {
        toast.error("Erro ao remover");
      }
    } else {
      const success = await addFavouriteSeries(token, member.id, serie.id);
      if (success) {
        toast.success("Adicionado aos favoritos");
        setIsFavorited(true);
      } else {
        toast.error("Erro ao favoritar");
      }
    }
  };

  if (!serie) return <p className="text-white p-10">Carregando série...</p>;

  const year = serie.release_date ? new Date(serie.release_date).getFullYear() : "Desconhecido";

  return (
    <main className="relative w-full min-h-screen text-white">
      {serie.backdropUrl && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={serie.backdropUrl.replace("/w500/", "/original/")}
            alt={serie.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      )}

      <div className="flex flex-col justify-end h-screen max-w-6xl mx-auto px-8 pb-24 space-y-5">
        <h1 className="text-6xl font-extrabold">{serie.name}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1 text-yellow-400">
            <FaStar />
            <span className="text-lg font-medium">{serie.vote_average.toFixed(1)}</span>
          </div>
          <span className="uppercase">{serie.genres?.[0] || "DESCONHECIDO"}</span>
          <span>{year}</span>
        </div>

        <p className="max-w-2xl text-gray-200 text-base leading-relaxed">
          {serie.overview || "Sem descrição disponível."}
        </p>

        <div className="flex gap-2 flex-wrap">
          {serie.genres?.map((genre: string, idx: number) => (
            <span
              key={idx}
              className="bg-white/20 px-3 py-1 rounded-full text-sm text-white font-medium"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-black font-semibold px-6 py-3 rounded hover:bg-gray-200 transition"
          >
            Avaliar
          </button>
          <button
            onClick={handleFavoriteToggle}
            className="bg-white/10 border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-black transition flex items-center gap-2"
          >
            {isFavorited ? (
              <>
                <FaHeart className="text-red-500" /> Remover dos Favoritos
              </>
            ) : (
              <>
                <FiHeart /> Adicionar aos Favoritos
              </>
            )}
          </button>
        </div>
      </div>

      {member && serie && (
        <RatingModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mediaId={serie.id}
          mediaType="series"
          onSuccess={() => setRefreshReviews(prev => !prev)} 
        />
      )}

      {serie && (
        <ReviewSection
          mediaId={serie.id.toString()}
          refreshTrigger={refreshReviews} 
        />
      )}
    </main>
  );
}
