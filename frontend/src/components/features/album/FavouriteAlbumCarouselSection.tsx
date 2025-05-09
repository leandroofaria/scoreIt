"use client";

import { useEffect, useState } from "react";
import { Album } from "@/types/Album";
import { AlbumCarousel } from "@/components/features/album/AlbumCarousel";
import { fetchFavouriteAlbuns } from "@/services/service_favourite_albuns";
import { useMember } from "@/context/MemberContext";
import { useTranslations } from "next-intl";

const FavouriteAlbumCarouselSection = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("NowPlayingCarousel");
  const { member } = useMember();

  useEffect(() => {
    const loadAlbums = async () => {
      const token = localStorage.getItem("authToken");
      console.log("👉 TOKEN:", token);
      console.log("🙋‍♂️ MEMBER:", member);

      if (!token || !member?.id) {
        console.error(t("tokenNotFound"));
        setLoading(false);
        return;
      }
      const data = await fetchFavouriteAlbuns(String(member.id));
      setAlbums(data);
      setLoading(false);
    };

    loadAlbums();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-white">{t("loadingFavAlbum")}</div>;
  }

  if (albums.length === 0) {
    return <div className="text-center py-10 text-white">{t("noFavAlbum")}</div>;
  }

  const handleRemoveAlbum = (id: string) => {
    setAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== id));
  };

  return <AlbumCarousel title={t("AlbunsFavoritos")} albums={albums} onRemoveAlbum={handleRemoveAlbum}/>;
};

export default FavouriteAlbumCarouselSection;
