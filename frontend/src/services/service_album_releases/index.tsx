import { Album } from "@/types/Album";

export const fetchNewAlbumReleases = async (token: string): Promise<Album[]> => {
  try {
    const response = await fetch("http://localhost:8080/spotify/api/newAlbumReleases", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar álbuns: ${response.status}`);
    }

    const raw = await response.json();

    const albums: Album[] = raw
      .map((album: any) => ({
        id: album.id,
        name: album.name,
        release_date: album.release_date,
        imageUrl: album.images?.[0]?.url || "/fallback.jpg",
        artistName: album.artists?.[0]?.name || "Desconhecido",
      }))
      .sort((a: Album, b: Album) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      )
      .slice(0, 15); // pega só os 15 mais recentes

    return albums;
  } catch (error) {
    console.error("❌ Erro ao buscar álbuns:", error);
    return [];
  }
};
