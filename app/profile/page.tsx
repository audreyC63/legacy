import PageHeader from "@/components/ui/PageHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";

import ProfileForm from "@/features/profile/components/ProfileForm";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-28">
        <PageHeader
          title="Profil"
          subtitle="Informations de votre enfant"
        />

        <ProfileForm />
      </div>

      <BottomNavigation />
    </main>
  );
}