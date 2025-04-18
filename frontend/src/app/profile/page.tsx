"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/container";
import { ProtectedRoute } from "@/components/protected-route/ProtectedRoute";
import { fetchMembers, updateMember } from "@/services/member.service";
import { createPortal } from "react-dom";
import { FiEdit2 } from "react-icons/fi";
import ProfileEditModal from "@/components/profile-edit-modal/ProfileEditModal";
import { useMember } from "@/context/MemberContext";
import NowPlayingCarouselSection from "@/components/now-playing-carousel/NowPlayingCarouselSection";
import { Member } from "@/types/Member";
import toast from "react-hot-toast";

export default function Profile() {
  const { member, setMember } = useMember();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const membersData = await fetchMembers(true);
        setMember(membersData);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Erro ao carregar usuário.");
      } finally {
        setLoading(false);
      }
    };

    if (!member) {
      loadMembers();
    } else {
      setLoading(false);
    }
  }, [member, setMember]);

  const handleUpdateMember = async (
    formData: { name: string; bio: string },
    imageFile: File | null
  ) => {
    if (!member) return;

    try {
      const payload = {
        id: member.id,
        name: formData.name,
        email: member.email,
        bio: formData.bio,
      };

      const updated = await updateMember(member.id.toString(), payload);
      setMember(updated);

      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("file", imageFile);

        const token = localStorage.getItem("authToken");
        const uploadRes = await fetch(
          `http://localhost:8080/api/images/upload/${member.id}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formDataImage,
          }
        );

        if (!uploadRes.ok) {
          throw new Error("Erro ao enviar imagem de perfil");
        }
      }

      toast.success("Perfil atualizado com sucesso!");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Erro ao atualizar perfil.");
      console.error(err);
    }
  };

  if (loading) return <div className="text-white p-6">Carregando perfil...</div>;

  return (
    <ProtectedRoute>
      <main className="w-full">
        <Container>
          <ProfileHeader member={member} onEditClick={() => setIsModalOpen(true)} />
        </Container>
        <Container>
          <NowPlayingCarouselSection />
        </Container>
        {isModalOpen && member && (
          <ProfileEditModal
            member={member}
            onUpdateMember={handleUpdateMember}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}

const ProfileHeader = ({
  member,
  onEditClick,
}: {
  member: Member | null;
  onEditClick: () => void;
}) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-400 overflow-hidden relative">
        <Image
          src={
            member?.profileImageUrl ||
            "https://marketup.com/wp-content/themes/marketup/assets/icons/perfil-vazio.jpg"
          }
          alt="Foto de perfil"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col text-white space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">{member?.name}</span>
          <button
            onClick={onEditClick}
            className="text-gray-400 hover:text-white"
            title="Editar perfil"
          >
            <FiEdit2 size={18} />
          </button>
        </div>
        <p className="text-gray-400 text-sm max-w-sm break-all">
          {member?.bio || "Sem biografia."}
        </p>
      </div>
    </div>
    <ProfileStats />
  </div>
);

const ProfileStats = () => (
  <div className="flex gap-6 text-center">
    <Stat label="Filmes" value="7" />
    <Stat label="Seguidores" value="25" />
    <Stat label="Seguindo" value="14" />
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-white">{label}</p>
    <p className="text-lg font-semibold text-white">{value}</p>
  </div>
);
