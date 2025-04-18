import { Artist } from "@/types/Artist";

export const fetchTopArtists = async (): Promise<Artist[]> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token não encontrado.");
      return [];
    }

    const response = await fetch("http://localhost:8080/lastfm/top-artists?page=1&limit=10", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar top artistas: ${response.status}`);
    }

    const rawData = await response.json();

    const data: Artist[] = rawData.map((item: any) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      listeners: item.listeners,
      playcount: item.playcount,
      mbid: item.mbid,
    }));

    return data;
  } catch (error) {
    console.error("Erro ao buscar top artistas:", error);
    return [];
  }
};
