"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/service_login";
import PageTransition from "@/components/page-transition/PageTransition";
import { Container } from "@/components/container";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [randomImage, setRandomImage] = useState("/posters/poster1.png");

  const router = useRouter();
  const { setIsLoggedIn } = useAuthContext();

  useEffect(() => {
    const posters = [
      "poster1.png",
      "poster2.png",
      "poster3.png",
      "poster4.png",
      "poster5.png",
      "poster6.png",
      "poster7.png",
    ];
    const random = Math.floor(Math.random() * posters.length);
    setRandomImage(`/postershorizont/${posters[random]}`);
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setMensagem("");
    setLoading(true);

    const response = await loginUser(email, senha);

    if (response.success) {
      setIsLoggedIn(true);
      toast.success("Login feito com sucesso!");
      router.push("/");
    } else {
      toast.error("Erro ao fazer login! Verifique se preencheu corretamente as informações.");
    }

    setLoading(false);
  };

  return (
    <PageTransition>
      <main className="w-full h-full flex">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between min-h-[80vh]">
            {/* Imagem à esquerda */}
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <img
                src={randomImage}
                alt="Poster aleatório"
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Formulário à direita */}
            <div className="w-full md:w-1/2 p-8 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-8">Login</h1>
              <form
                onSubmit={handleLogin}
                className="space-y-4 max-w-md mx-auto md:mx-0"
              >
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-md border border-[var(--color-darkgreen)] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full p-3 rounded-md border border-[var(--color-darkgreen)] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-darkgreen hover:brightness-110 transition text-white font-semibold py-3 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
                {mensagem && (
                  <p className="text-red-400 text-sm text-center mt-2">
                    {mensagem}
                  </p>
                )}
                <div className="text-center">
                  <a href="/cadastro" className="text-emerald-400 hover:underline">
                    Não possui conta? Cadastre-se
                  </a>
                </div>
                <div className="text-center">
                  <a href="/envia_email" className="text-emerald-400 hover:underline">
                    Esqueceu sua senha?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </main>
    </PageTransition>
  );
}
