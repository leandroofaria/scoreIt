"use client";

import { useEffect, useState } from "react";
import { Album } from "@/types/Album";
import { fetchNewAlbumReleases } from "@/services/service_album_releases";
import { AlbumCarousel } from "@/components/album-carousel/AlbumCarousel";

const RecentsAlbumCarousel = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlbums = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("Token não encontrado. Faça login primeiro.");
        setLoading(false);
        return;
      }

      const data = await fetchNewAlbumReleases(token);
      setAlbums(data);
      setLoading(false);
    };

    loadAlbums();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-white">Carregando álbuns...</div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-10 text-white">
        Nenhum álbum encontrado.
      </div>
    );
  }

  return <AlbumCarousel title="Albuns lançados recentemente" albums={albums} />;
};

export default RecentsAlbumCarousel;
