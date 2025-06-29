"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { FiEdit2 } from "react-icons/fi";
import ProfileEditModal from "@/components/features/user/ProfileEditModal";
import { useMember } from "@/context/MemberContext";
import { Member } from "@/types/Member";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { updateMember } from "@/services/user/member";
import FavouriteAlbumCarouselSection from "@/components/features/album/FavouriteAlbumCarouselSection";
import { useTabContext } from "@/context/TabContext";
import FavouriteMoviesCarouselSection from "@/components/features/movie/FavouriteMoviesCarouselSection";
import FavouriteSeriesCarouselSection from "@/components/features/serie/FavouriteSeriesCarouselSection";
import { ProfileStats } from "@/components/features/user/ProfileStats";
import { CustomListModal } from "@/components/features/user/CustomListModal";
import { countFollowers, countFollowing } from "@/services/followers/countStats";
import { fetchMemberLists } from "@/services/customList/add_content_list";
import { CustomList } from "@/types/CustomList";
import ReviewsCarouselSection from "@/components/features/review/ReviewsCarouselSection";
import { AnimatePresence, motion } from "framer-motion";

export default function Profile() {
  const { member, setMember } = useMember();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  const [isListsOpen, setIsListsOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<CustomList | null>(null);
  const { activeTab } = useTabContext();
  const t = useTranslations("profile");
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);

  const handleUpdateMember = async (
    formData: { name: string; bio: string; birthDate: string; gender: string },
    imageFile: File | null
  ) => {
    if (!member) return;

    try {
      const payload = {
        id: member.id,
        name: formData.name,
        email: member.email,
        bio: formData.bio,
        birthDate: formData.birthDate,
        gender: formData.gender,
      };

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

        if (!uploadRes.ok) throw new Error(t("error_uploading_image"));
      }

      const updated = await updateMember(member.id.toString(), payload);
      setMember(updated);

      toast.success(t("success_updating_profile"));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast.error(t("error_updating_profile"));
    }
  };

  const handleCreateList = async (formData: { name: string; description: string }) => {
    if (!member) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const payload = {
        memberId: member.id,
        listName: formData.name,
        description: formData.description,
      };

      const res = await fetch("http://localhost:8080/customList/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar lista");

      toast.success("lista criada");
      setIsCreateListModalOpen(false);

      await loadCustomLists();
    } catch (error) {
      toast.error("erro ao criar lista");
      console.error(error);
    }
  };

    const loadCustomLists = async () => {
      if (!member) return;

      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const lists = await fetchMemberLists(token, member.id);
        setCustomLists(lists);
      } catch (error) {
        console.error("Erro ao carregar listas personalizadas:", error);
        toast.error("erro ao carregar lista");
      }
    };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token || !member) return;

        const [followerCount, followingCount] = await Promise.all([
          countFollowers(member.id.toString(), token),
          countFollowing(member.id.toString(), token),
        ]);

        setFollowers(followerCount);
        setFollowing(followingCount);
      } catch (err) {
        console.error("Erro ao buscar contadores:", err);
      }
    };

    fetchStats();
    loadCustomLists();
  }, [member]);

  const handleOpenListModal = (list: CustomList) => {
    setSelectedList(list);
  };

  const handleCloseListModal = () => {
    setSelectedList(null);
  };

  return (
    <ProtectedRoute>
      <main className="w-full">
        <Container>
          <div className="mt-5 space-y-4">
            <ProfileHeader
              member={member}
              onEditClick={() => setIsEditModalOpen(true)}
              t={t}
              followers={followers}
              following={following}
            />

            <div className="flex justify-end">
              <button
                onClick={() => setIsCreateListModalOpen(true)}
                className="bg-darkgreen text-white px-4 py-2 rounded hover:brightness-110"
              >
                + Criar Lista
              </button>
            </div>

            <section className="mt-6">
              <div className="mb-4">
                <button
                  className="flex items-center justify-between w-full text-xl font-semibold text-white"
                  onClick={() => setIsListsOpen(!isListsOpen)}
                >
                  <svg
                    className={`w-5 h-5 transform transition-transform ${isListsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

    <AnimatePresence>
      {isListsOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, overflow: "hidden" }}
          animate={{ opacity: 1, height: "auto", overflow: "visible" }}
          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {customLists.length === 0 ? (
            <p className="text-gray-400 py-2">Você não possui nenhuma lista!</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {customLists.map((list) => (
                <div
                  key={list.id}
                  className="bg-neutral-800 p-4 rounded-lg cursor-pointer hover:bg-neutral-700"
                  onClick={() => handleOpenListModal(list)}
                >
                  <h3 className="text-lg font-semibold">{list.listName}</h3>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </section>
          </div>
        </Container>

        <Container>
          
          {activeTab == "filmes" && <FavouriteMoviesCarouselSection />}
          {activeTab == "musicas" && <FavouriteAlbumCarouselSection />}
          {activeTab == "series" && <FavouriteSeriesCarouselSection />}
        </Container>

        {isEditModalOpen && member && (
          <ProfileEditModal
            member={member}
            onUpdateMember={handleUpdateMember}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}

        {isCreateListModalOpen && member &&(
          <CustomListModal
            onClose={() => setIsCreateListModalOpen(false)}
            onCreate={handleCreateList}
            member={member}
          />
        )}

        {selectedList && member && (
          <CustomListModal
            isOpen={true}
            onClose={handleCloseListModal}
            id={selectedList.id}
            listName={selectedList.listName}
            listDescription={selectedList.list_description}
            onListDeleted={loadCustomLists}
            onListUpdated={loadCustomLists}
            member={member}
          />
        )}

        <Container>
          <ReviewsCarouselSection />
        </Container>
      </main> 
    </ProtectedRoute>
  );
}

interface ProfileHeaderProps {
  member: Member | null;
  onEditClick: () => void;
  t: any;
  followers: number;
  following: number;
}

const ProfileHeader = ({ member, onEditClick, t, followers, following }: ProfileHeaderProps) => (
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
            title={t("edit_profile")}
          >
            <FiEdit2 size={18} />
          </button>
        </div>
        <p className="text-gray-400 text-sm max-w-md">{member?.bio || t("no_bio")}</p>
      </div>
    </div>
    {member && <ProfileStats t={t} followers={followers} following={following} memberId={member.id.toString()}/>}
  </div>
);
