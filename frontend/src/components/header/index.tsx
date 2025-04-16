// src/components/header/index.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";
import { useTabContext } from "@/context/TabContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/utils/shadcn";
import LogoLateral from "@/assets/LogoLateral";

export function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  const { activeTab, setActiveTab } = useTabContext();

  return (
    <header className="w-full h-20 bg-black relative">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex-1">
          <Link href="/" className="text-white text-lg font-semibold">
            <LogoLateral />
          </Link>
        </div>

        {/* Botões de navegação */}
        {isLoggedIn && (
          <nav className="flex justify-center w-full md:absolute md:left-1/2 md:-translate-x-1/2">
            <div className="relative flex">
              <div
                className={`absolute inset-0 h-full w-1/2 bg-darkgreen rounded-md transition-all duration-300 ${
                  activeTab === "musicas" ? "translate-x-full" : "translate-x-0"
                }`}
              ></div>
              <button
                onClick={() => setActiveTab("filmes")}
                className={`w-32 text-center py-2 text-white relative z-10 transition-all ${
                  activeTab === "filmes" ? "font-bold" : "text-gray-400"
                }`}
              >
                Filmes
              </button>
              <button
                onClick={() => setActiveTab("musicas")}
                className={`w-32 text-center py-2 text-white relative z-10 transition-all ${
                  activeTab === "musicas" ? "font-bold" : "text-gray-400"
                }`}
              >
                Músicas
              </button>
            </div>
          </nav>
        )}

        {/* Perfil ou botão de login */}
        <div className="flex-1 flex justify-end items-center">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none ml-4">
                <Image
                  src="/profile.jpg"
                  alt="Avatar"
                  width={50}
                  height={50}
                  className="rounded-full cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-48 bg-black shadow-lg rounded-md p-2 border border-gray-700"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="block px-2 py-1 hover:bg-gray-900 rounded"
                  >
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/favoritos"
                    className="block px-2 py-1 hover:bg-gray-900 rounded"
                  >
                    Meus Favoritos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    setIsLoggedIn(false);
                    window.location.href = "/login";
                  }}
                  className="block px-2 py-1 text-red-300 hover:bg-red-900 rounded cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="text-white bg-darkgreen px-6 py-2 rounded-md hover:brightness-110 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
