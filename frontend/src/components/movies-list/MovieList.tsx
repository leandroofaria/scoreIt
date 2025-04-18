'use client';

import { useEffect, useState } from 'react';
import { MovieCard } from '../film-card/MovieCard';
import { fetchMovies } from '@/services/service_popular_movies';
import { Movie } from '@/types/Movie'; 
export function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      const moviesData = await fetchMovies();
      setMovies(moviesData);
      setLoading(false);
    };

    getMovies();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-white">Carregando filmes...</p>;
  }

  if (movies.length === 0) {
    return <p className="text-center mt-10 text-white">Nenhum filme encontrado.</p>;
  }

  return (
    <section className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-center">
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </section>
  );
}
