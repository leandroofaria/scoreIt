'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { RandomMoviesCarousel } from '@/components/random-movies-carousel/RandomMoviesCarousel';
import { MovieList } from '@/components/movies-list/MovieList';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import Link from 'next/link';
import PageTransition from '@/components/page-transition/PageTransition';

export default function Home() {
  const isLoggedIn = useCheckAuth();
  const [randomImage, setRandomImage] = useState('');

  useEffect(() => {
    const posters = [
      'poster1.png',
      'poster2.png',
      'poster3.png',
      'poster4.png',
      'poster5.png',
      'poster6.png',
      'poster7.png',
    ];
    const random = Math.floor(Math.random() * posters.length);
    setRandomImage(`/postershorizont/${posters[random]}`);
  }, []);

  if (isLoggedIn === null) {
    return <p className="text-gray-400 text-center mt-10">Verificando login...</p>;
  }

  return (
    <main className="w-full">
      <Container>
        {isLoggedIn ? (
          <>
            <RandomMoviesCarousel />
            <h2 className="text-white text-xl font-bold mt-10 mb-4">Todos os Filmes</h2>
            <MovieList />
          </>
        ) : (
          <PageTransition>
            <div className="flex flex-col md:flex-row items-center justify-between min-h-[80vh]">
              {/* Imagem à esquerda */}
              <div className="w-full md:w-1/2 mb-10 md:mb-0">
                {randomImage && (
                  <img
                    src={randomImage}
                    alt="Poster aleatório"
                    className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                  />
                )}
              </div>

              {/* Texto à direita */}
              <div className="w-full md:w-1/2 p-8 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-12">
                  Faça login para visualizar nossos filmes e músicas!
                </h1>
                <Link
                  href="/login"
                  className="px-6 py-3 bg-darkgreen text-white rounded-md hover:brightness-110 transition"
                >
                  Fazer Login
                </Link>
              </div>
            </div>
          </PageTransition>
        )}
      </Container>
    </main>
  );
}
